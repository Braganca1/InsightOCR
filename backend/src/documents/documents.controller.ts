import {
  Controller, Post, Get, UploadedFile, UseInterceptors, Req, Delete, Param, Header, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { Response } from 'express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly docsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`;
          const fileExt = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    // temporary dummy user ID until you wire up real auth
    const dummyUserId = '00000000-0000-0000-0000-000000000000';
    return this.docsService.processDocument(file, dummyUserId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.docsService.findOne(id);
  }

  @Get()
  list() {
    // same dummy user ID for listing
    const dummyUserId = '00000000-0000-0000-0000-000000000000';
    return this.docsService.findAllByUser(dummyUserId);
  }
  
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    // for now use dummyUserId here too
  ) {
    const dummyUserId = '00000000-0000-0000-0000-000000000000';
    return this.docsService.deleteDocument(id, dummyUserId);
  }

    @Get(':id/download')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="document.pdf"')
  async download(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.docsService.generateDownload(id);
    res.end(pdfBuffer);
  }
}