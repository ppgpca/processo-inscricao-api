import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { DocumentoService } from './documento.service';

@Controller('documentos')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Get('inscricao/:idInscricao')
  obterPorInscricao(@Param('idInscricao', ParseIntPipe) idInscricao: number) {
    return this.documentoService.obterPorInscricao(idInscricao);
  }

  @Get('inscricao/:idInscricao/tipo/:idTipo')
  obterAtual(
    @Param('idInscricao', ParseIntPipe) idInscricao: number,
    @Param('idTipo', ParseIntPipe) idTipo: number,
  ) {
    return this.documentoService.obterAtual(idInscricao, idTipo);
  }

  @Get('inscricao/:idInscricao/tipo/:idTipo/download')
  async download(
    @Param('idInscricao', ParseIntPipe) idInscricao: number,
    @Param('idTipo', ParseIntPipe) idTipo: number,
    @Res() res: Response,
  ) {
    const { documento, caminho } = await this.documentoService.download(idInscricao, idTipo);
    res.setHeader('Content-Type', documento.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(documento.nomeArquivoOriginal)}"`,
    );
    res.sendFile(caminho);
  }

  @Post('inscricao/:idInscricao/tipo/:idTipo')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          const base = path.basename(file.originalname, ext).replace(/\s+/g, '-');
          cb(null, `${Date.now()}-${base}${ext}`);
        },
      }),
    }),
  )
  async upload(
    @Param('idInscricao', ParseIntPipe) idInscricao: number,
    @Param('idTipo', ParseIntPipe) idTipo: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    return this.documentoService.upload(idInscricao, idTipo, file);
  }

  @Delete('inscricao/:idInscricao/tipo/:idTipo')
  @HttpCode(HttpStatus.OK)
  remover(
    @Param('idInscricao', ParseIntPipe) idInscricao: number,
    @Param('idTipo', ParseIntPipe) idTipo: number,
  ) {
    return this.documentoService.remover(idInscricao, idTipo);
  }
}
