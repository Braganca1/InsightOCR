import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Param,
  Delete,
  Res,
  Header,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtAuthGuard }        from '../auth/jwt-auth.guard';
import { FileInterceptor }     from '@nestjs/platform-express';
import { diskStorage }         from 'multer';
import { extname }             from 'path';
import { Response }            from 'express';
import { DocumentsService }    from './documents.service';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly docsService: DocumentsService) {}

 
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    try {
      
      return await this.docsService.processDocument(file, req.user.userId);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }


  @Get()
  list(@Req() req) {
    return this.docsService.findAllByUser(req.user.userId);
  }


  @Get(':id')
  getOne(@Req() req, @Param('id') id: string) {
    return this.docsService.findOne(id, req.user.userId);
  }


  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.docsService.deleteDocument(id, req.user.userId);
  }

  
  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    
    const fileBuffer = await this.docsService.generateDownload(id);

    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${id}.pdf"`,
    });
    res.send(fileBuffer);
  }
}
