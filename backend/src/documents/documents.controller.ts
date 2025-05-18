// backend/src/documents/documents.controller.ts
import { Controller, UseGuards, Req, Get, Post, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { diskStorage }               from 'multer';
import { extname }                   from 'path';

@UseGuards(JwtAuthGuard)            // ← protect every route here
@Controller('documents')
export class DocumentsController {
  constructor(private readonly docsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${name}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    // processDocument returns the updated Document as JSON
    return this.docsService.processDocument(file, req.user.userId);
  }

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
