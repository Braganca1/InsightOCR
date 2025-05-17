import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { promises as fs } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { createWorker } from 'tesseract.js';
import { join } from 'path';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async processDocument(file: Express.Multer.File, userId: string) {

     await this.prisma.user.upsert({
    where:   { id: userId },
    update:  {},
    create: {
      id:           userId,
      email:        'dummy@local',
      passwordHash: 'dontcare',
    },
  });
    // 1) Create DB record
    const doc = await this.prisma.document.create({
      data: {filename: file.filename, originalName: file.originalname,userId},
    });

    try {
      // 2) Perform OCR
      const worker = (await createWorker('eng')) as any;


      const {
        data: { text },
      } = await worker.recognize(
        join(process.cwd(), 'uploads', file.filename),
      );

      await worker.terminate();

      // 3) Update record with extracted text
      return this.prisma.document.update({
        where: { id: doc.id },
        data: { extractedText: text },
      });
    } catch (err: any) {
      throw new InternalServerErrorException(`OCR failed: ${err.message}`);
    }
  }

  findAllByUser(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

async deleteDocument(id: string, userId: string): Promise<{ success: boolean }> {
  // 1) Verify ownership
  const doc = await this.prisma.document.findUnique({ where: { id } });
  if (!doc || doc.userId !== userId) {
    throw new NotFoundException('Document not found');
  }

  // 2) Delete all chat interactions for this document
  await this.prisma.interaction.deleteMany({
    where: { documentId: id },
  });

  // 3) Now delete the document itself
  await this.prisma.document.delete({
    where: { id },
  });

  return { success: true };
}


/**
 * Fetch a single document by id.
 */
async findOne(id: string, userId: string) {
  const doc = await this.prisma.document.findUnique({ where: { id } });
  if (!doc || doc.userId !== userId) throw new NotFoundException();
  return doc;
}

 async generateDownload(id: string) {
    // 1) Load the document record
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { interactions: true },  // assumes you have relation set up
    });
    if (!doc) throw new NotFoundException('Document not found');

    // 2) Read original file from disk
    const filePath = join(process.cwd(), 'uploads', doc.filename);
    const origBytes = await fs.readFile(filePath);

    // 3) Create a new PDF
    const pdf = await PDFDocument.create();
    let origPdf: PDFDocument | null = null;

    // If original is a PDF, embed its pages; otherwise embed as image
    if (doc.filename.toLowerCase().endsWith('.pdf')) {
      origPdf = await PDFDocument.load(origBytes);
      const origPages = await pdf.copyPages(origPdf, origPdf.getPageIndices());
      origPages.forEach((page) => pdf.addPage(page));
    } else {
      // embed image on single page
      const img = await (doc.filename.match(/\.png$/i)
        ? pdf.embedPng(origBytes)
        : pdf.embedJpg(origBytes));
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    // 4) Append a page with OCR text and interactions
    const textPage = pdf.addPage();
    const { width, height } = textPage.getSize();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = height - 2 * fontSize;

    // Title
    textPage.drawText('Extracted Text:', { x: 50, y, size: 14, font, color: rgb(0,0,0) });
    y -= 1.5 * fontSize;

    // OCR text
    const lines = (doc.extractedText ?? '').split('\n');
    for (const line of lines) {
      if (y < 50) {
        // new page if out of space
        const p = pdf.addPage();
        y = p.getSize().height - 2 * fontSize;
      }
      textPage.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0,0,0) });
      y -= fontSize * 1.2;
    }

    // Conversations
    if (doc.interactions.length) {
      y -= fontSize;
      textPage.drawText('Conversations:', { x: 50, y, size: 14, font, color: rgb(0,0,0) });
      y -= 1.5 * fontSize;

      for (const convo of doc.interactions) {
        const q = `Q: ${convo.question}`;
        const a = `A: ${convo.answer}`;
        for (const str of [q, a]) {
          if (y < 50) {
            pdf.addPage();
            y = height - 2 * fontSize;
          }
          textPage.drawText(str, { x: 60, y, size: fontSize, font, color: rgb(0,0,0) });
          y -= fontSize * 1.2;
        }
        y -= fontSize * 0.8;
      }
    }

    // 5) Serialize
    return Buffer.from(await pdf.save());
  }
}