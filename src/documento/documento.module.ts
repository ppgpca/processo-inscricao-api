import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documento } from '../database/entities/documento.entity';
import { TipoDocumentoEdital } from '../database/entities/tipo-documento-edital.entity';
import { InscricaoModule } from '../inscricao/inscricao.module';
import { DocumentoController } from './documento.controller';
import { DocumentoRepository } from './documento.repository';
import { DocumentoService } from './documento.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Documento, TipoDocumentoEdital]),
    InscricaoModule,
  ],
  controllers: [DocumentoController],
  providers: [DocumentoService, DocumentoRepository],
})
export class DocumentoModule {}
