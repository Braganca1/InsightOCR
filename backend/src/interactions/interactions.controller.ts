import { Controller, UseGuards, Req, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InteractionsService } from './interactions.service';

@UseGuards(JwtAuthGuard)
@Controller('documents/:id/interactions')
export class InteractionsController {
  constructor(private interactionsService: InteractionsService) {}

  @Get()
  list(@Req() req, @Param('id') documentId: string) {
    return this.interactionsService.listByDocument(documentId, req.user.userId);
  }

  @Post()
  ask(@Req() req, @Param('id') documentId: string, @Body('question') question: string) {
    return this.interactionsService.askQuestion(documentId, question, req.user.userId);
  }
}
