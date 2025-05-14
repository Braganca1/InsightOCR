// backend/src/documents/documents.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      data: { filename: file.filename, userId },
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
}
