import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class InteractionsService {
  private hf: HfInference;

  constructor(private prisma: PrismaService) {
    this.hf = new HfInference(
  process.env.HF_API_TOKEN!);
  }

  async askQuestion(documentId: string, question: string, userId: string) {
    // 1) Verify document ownership
    const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.userId !== userId) throw new NotFoundException();

    // 2) Build the chat prompt
    const messages = [
      { role: 'system', content: 'You are a helpful invoice assistant.' },
      { role: 'user', content: `Here is the invoice text:\n${doc.extractedText}\n\nUser: ${question}` },
    ];

    let answer: string;
    try {
      const res = await this.hf.questionAnswering({
        model: 'deepset/roberta-base-squad2', // or another QA model available on HuggingFace
        inputs: {
          question,
          context: doc.extractedText ?? '',
        },
      });
      answer = res.answer?.trim() ?? 'No answer found.';
    } catch (err: any) {
      throw new HttpException(`LLM error: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 3) Persist & return
    return this.prisma.interaction.create({
      data: { documentId, question, answer },
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