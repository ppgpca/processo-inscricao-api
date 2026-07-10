import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from '../database/entities/documento.entity';
import { TipoDocumentoEdital } from '../database/entities/tipo-documento-edital.entity';
import { InscricaoRepository } from '../inscricao/inscricao.repository';
import { DocumentoRepository } from './documento.repository';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

function cpfMeio(cpf: string): string {
  return cpf.replace(/\D/g, '').slice(3, 9);
}

@Injectable()
export class DocumentoService {
  constructor(
    private readonly documentoRepository: DocumentoRepository,
    private readonly inscricaoRepository: InscricaoRepository,
    @InjectRepository(TipoDocumentoEdital)
    private readonly tipoDocumentoRepo: Repository<TipoDocumentoEdital>,
  ) {}

  async obterPorInscricao(idInscricao: number): Promise<Documento[]> {
    return this.documentoRepository.obterPorInscricao(idInscricao);
  }

  async obterAtual(
    idInscricao: number,
    idTipoDocumentoEdital: number,
  ): Promise<Documento | null> {
    return this.documentoRepository.obterAtual(idInscricao, idTipoDocumentoEdital);
  }

  async upload(
    idInscricao: number,
    idTipo: number,
    file: Express.Multer.File,
  ): Promise<Documento> {
    if (file.size > MAX_FILE_SIZE) {
      fs.unlinkSync(file.path);
      throw new BadRequestException('O arquivo excede o tamanho máximo de 10 MB.');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        `Tipo de arquivo não permitido: ${file.mimetype}. Envie PDF, JPG, PNG ou WEBP.`,
      );
    }

    const inscricao = await this.inscricaoRepository.obterPorIdSimples(idInscricao);
    if (!inscricao) {
      fs.unlinkSync(file.path);
      throw new NotFoundException(`Inscrição ${idInscricao} não encontrada.`);
    }

    const tipo = await this.tipoDocumentoRepo.findOne({ where: { id: idTipo } });
    if (!tipo) {
      fs.unlinkSync(file.path);
      throw new NotFoundException(`Tipo de documento ${idTipo} não encontrado.`);
    }

    await this.documentoRepository.desmarcarAtual(idInscricao, idTipo);
    const versao = await this.documentoRepository.obterProximaVersao(idInscricao, idTipo);

    const ext = path.extname(file.originalname).toLowerCase();
    const nomeArquivo = `${cpfMeio(inscricao.cpf)}_${tipo.padraoNome}_v${versao}${ext}`;
    const dir = path.dirname(file.path);
    const novoCaminho = path.join(dir, nomeArquivo);

    fs.renameSync(file.path, novoCaminho);

    return this.documentoRepository.criar({
      idInscricao,
      idTipoDocumentoEdital: idTipo,
      versao,
      atual: true,
      nomeArquivoOriginal: file.originalname,
      nomeArquivo,
      caminhoArmazenamento: novoCaminho,
      mimeType: file.mimetype,
      tamanhoBytes: file.size,
      enviadoEm: new Date(),
    });
  }

  async download(
    idInscricao: number,
    idTipo: number,
  ): Promise<{ documento: Documento; caminho: string }> {
    const documento = await this.documentoRepository.obterAtual(idInscricao, idTipo);
    if (!documento) {
      throw new NotFoundException('Documento não encontrado.');
    }

    if (!fs.existsSync(documento.caminhoArmazenamento)) {
      throw new NotFoundException('Arquivo não encontrado no servidor.');
    }

    return { documento, caminho: path.resolve(documento.caminhoArmazenamento) };
  }

  async remover(idInscricao: number, idTipo: number): Promise<void> {
    await this.documentoRepository.remover(idInscricao, idTipo);
  }
}
