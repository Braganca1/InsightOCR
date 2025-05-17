// backend/src/documents/documents.controller.ts
import { Controller, UseGuards, Req, Get, Post, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@UseGuards(JwtAuthGuard)            // ← protect every route here
@Controller('documents')
export class DocumentsController {
  constructor(private docsService: DocumentsService) {}

  @Post('upload')
  // req.user is now populated
  upload(@Req() req, /* … */) { /* … */ }

  @Get()
  list(@Req() req) {
    return this.docsService.findAllByUser(req.user.userId);  // ← req.user.userId
  }

  @Get(':id')
  getOne(@Req() req, @Param('id') id: string) {
    return this.docsService.findOne(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.docsService.deleteDocument(id, req.user.userId);
  }
}
