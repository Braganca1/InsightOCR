import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('documents/:documentId/interactions')
export class InteractionsController {
  constructor(private readonly interactions: InteractionsService) {}

  @Post()
  async ask(
    @Param('documentId') documentId: string,
    @Body('question') question: string,
    @Req() req,
  ) {
    // temporary dummy user ID until auth is wired
    const dummyUserId = '00000000-0000-0000-0000-000000000000';
    return this.interactions.askQuestion(documentId, question, dummyUserId);
  }

  @Get()
  async list(
    @Param('documentId') documentId: string,
    @Req() req,
  ) {
    const dummyUserId = '00000000-0000-0000-0000-000000000000';
    return this.interactions.listByDocument(documentId, dummyUserId);
  }
}