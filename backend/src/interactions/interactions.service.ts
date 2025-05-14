// backend/src/interactions/interactions.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// default‐import the OpenAI client
import OpenAI from 'openai';

@Injectable()
export class InteractionsService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // auto‐loads from your .env
    });
  }

  async askQuestion(documentId: string, question: string, userId: string) {
    // 1) Verify document ownership
    const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.userId !== userId) {
      throw new NotFoundException('Document not found');
    }
    if (!doc.extractedText) {
      throw new NotFoundException('Document text not available yet');
    }

    // 2) Call OpenAI ChatCompletion on the new client
    const response = await this.openai.chat.completions.create({
      model: 'tts-1-hd-1106',
      messages: [
        { role: 'system', content: 'You are a helpful invoice assistant.' },
        {
          role: 'user',
          content: `
Here is the invoice text:
${doc.extractedText}

User question: ${question}
          `,
        },
      ],
    });

    const answer = response.choices?.[0]?.message?.content?.trim() ?? '';

    // 3) Persist and return
    return this.prisma.interaction.create({
      data: {
        documentId,
        question,
        answer,
      },
    });
  }

  async listByDocument(documentId: string, userId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.userId !== userId) {
      throw new NotFoundException('Document not found');
    }
    return this.prisma.interaction.findMany({
      where: { documentId },
      orderBy: { createdAt: 'asc' },
    });
  }
}