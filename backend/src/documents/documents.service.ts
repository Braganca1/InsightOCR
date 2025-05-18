import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb }                               from 'pdf-lib';
import { promises as fs }                                                 from 'fs';
import { PrismaService }                                                  from '../prisma/prisma.service';
import { createWorker }                                                   from 'tesseract.js';
import { join }                                                           from 'path';
import * as sharp                                                         from 'sharp';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async processDocument(file: Express.Multer.File, userId: string) {
    await this.prisma.user.upsert({
      where:  { id: userId },
      update: {},
      create: {
        id:           userId,
        email:        'dummy@local',
        passwordHash: 'dontcare',
      },
    });

    const doc = await this.prisma.document.create({
      data: {
        filename:     file.filename,
        originalName: file.originalname,
        userId,
      },
    });

    try {
      const worker = (await createWorker('eng')) as any;
      const { data: { text } } = await worker.recognize(
        join(process.cwd(), 'uploads', file.filename),
      );
      await worker.terminate();

      return this.prisma.document.update({
        where: { id: doc.id },
        data:  { extractedText: text },
      });
    } catch (err: any) {
      throw new InternalServerErrorException(`OCR failed: ${err.message}`);
    }
  }

  findAllByUser(userId: string) {
    return this.prisma.document.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(id: string, userId: string): Promise<{ success: boolean }> {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId) {
      throw new NotFoundException('Document not found');
    }
    await this.prisma.interaction.deleteMany({ where: { documentId: id } });
    await this.prisma.document.delete({ where: { id } });
    return { success: true };
  }

  async findOne(id: string, userId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc || doc.userId !== userId) throw new NotFoundException();
    return doc;
  }

  async generateDownload(id: string) {
    const doc = await this.prisma.document.findUnique({
      where:   { id },
      include: { interactions: true },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const filePath = join(process.cwd(), 'uploads', doc.filename);
    const origBytes = await fs.readFile(filePath);

    const pdf = await PDFDocument.create();
    const ext = doc.filename.toLowerCase().slice(doc.filename.lastIndexOf('.'));

    if (ext === '.pdf') {
      const origPdf = await PDFDocument.load(origBytes);
      const pages = await pdf.copyPages(origPdf, origPdf.getPageIndices());
      pages.forEach((p) => pdf.addPage(p));
    } else {
      let img;
      try {
        if (ext === '.png') {
          img = await pdf.embedPng(origBytes);
        } else if (ext === '.jpg' || ext === '.jpeg') {
          const pngBytes = await sharp(origBytes).png().toBuffer();
          img = await pdf.embedPng(pngBytes);
        } else {
          throw new Error(`Unsupported extension "${ext}"`);
        }
      } catch (e: any) {
        throw new InternalServerErrorException(
          `Failed to embed image (${doc.filename}): ${e.message}`
        );
      }
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const textPage = pdf.addPage();
    const { width, height } = textPage.getSize();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = height - 2 * fontSize;

    textPage.drawText('Extracted Text:', { x: 50, y, size: 14, font, color: rgb(0,0,0) });
    y -= 1.5 * fontSize;

    for (const line of (doc.extractedText ?? '').split('\n')) {
      if (y < 50) {
        pdf.addPage();
        y = height - 2 * fontSize;
      }
      textPage.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0,0,0) });
      y -= fontSize * 1.2;
    }

    if (doc.interactions.length) {
      y -= fontSize;
      textPage.drawText('Conversations:', { x: 50, y, size: 14, font, color: rgb(0,0,0) });
      y -= 1.5 * fontSize;
      for (const convo of doc.interactions) {
        for (const prefix of [`Q: ${convo.question}`, `A: ${convo.answer}`]) {
          if (y < 50) {
            pdf.addPage();
            y = height - 2 * fontSize;
          }
          textPage.drawText(prefix, { x: 60, y, size: fontSize, font, color: rgb(0,0,0) });
          y -= fontSize * 1.2;
        }
        y -= fontSize * 0.8;
      }
    }

    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  }
}