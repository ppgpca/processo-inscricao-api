import {
	BadRequestException,
	ForbiddenException,
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
import {
	ConsultaDocumentosRespostaDto,
	DocumentoCandidatoDto,
} from './dto/documento-candidato.dto';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
	'application/pdf',
	'image/jpeg',
	'image/png',
	'image/webp',
];

/** 5 dígitos intermediários do CPF, no formato ".123.45." (item 3.7.1). */
function identificacaoCandidato(cpf: string): string {
	const digitos = cpf.replace(/\D/g, '').slice(3, 8);
	if (!/^\d{5}$/.test(digitos)) {
		return '';
	}
	return `.${digitos.slice(0, 3)}.${digitos.slice(3)}.`;
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
		return this.documentoRepository.obterAtual(
			idInscricao,
			idTipoDocumentoEdital,
		);
	}

	async upload(
		idInscricao: number,
		idTipo: number,
		file: Express.Multer.File,
		somentePdf = false,
	): Promise<Documento> {
		if (file.size > MAX_FILE_SIZE) {
			fs.unlinkSync(file.path);
			throw new BadRequestException(
				'O arquivo excede o tamanho máximo de 10 MB.',
			);
		}

		const mimeTypes = somentePdf
			? ['application/pdf']
			: ALLOWED_MIME_TYPES;
		const formatos = somentePdf ? 'PDF' : 'PDF, JPG, PNG ou WEBP';

		if (!mimeTypes.includes(file.mimetype)) {
			fs.unlinkSync(file.path);
			throw new BadRequestException(
				`Tipo de arquivo não permitido: ${file.mimetype}. Envie ${formatos}.`,
			);
		}

		const inscricao =
			await this.inscricaoRepository.obterPorIdSimples(idInscricao);
		if (!inscricao) {
			fs.unlinkSync(file.path);
			throw new NotFoundException(
				`Inscrição ${idInscricao} não encontrada.`,
			);
		}

		if (inscricao.finalizada) {
			fs.unlinkSync(file.path);
			throw new ForbiddenException(
				'Não é possível enviar documentos em uma inscrição finalizada.',
			);
		}

		const tipo = await this.tipoDocumentoRepo.findOne({
			where: { id: idTipo },
		});
		if (!tipo) {
			fs.unlinkSync(file.path);
			throw new NotFoundException(
				`Tipo de documento ${idTipo} não encontrado.`,
			);
		}

		await this.documentoRepository.desmarcarAtual(idInscricao, idTipo);
		const versao = await this.documentoRepository.obterProximaVersao(
			idInscricao,
			idTipo,
		);

		const identificacao = identificacaoCandidato(inscricao.cpf);
		if (!/^\.\d{3}\.\d{2}\.$/.test(identificacao)) {
			fs.unlinkSync(file.path);
			throw new BadRequestException(
				'CPF da inscrição não permite identificar a pasta do candidato.',
			);
		}

		const ext = path.extname(file.originalname).toLowerCase();
		const nomeArquivo = `${identificacao}_${tipo.padraoNome}_v${versao}${ext}`;
		const dirCandidato = path.join(path.dirname(file.path), identificacao);
		fs.mkdirSync(dirCandidato, { recursive: true });
		const novoCaminho = path.join(dirCandidato, nomeArquivo);

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
		const documento = await this.documentoRepository.obterAtual(
			idInscricao,
			idTipo,
		);
		if (!documento) {
			throw new NotFoundException('Documento não encontrado.');
		}

		if (!fs.existsSync(documento.caminhoArmazenamento)) {
			throw new NotFoundException('Arquivo não encontrado no servidor.');
		}

		return {
			documento,
			caminho: path.resolve(documento.caminhoArmazenamento),
		};
	}

	async remover(idInscricao: number, idTipo: number): Promise<void> {
		const inscricao =
			await this.inscricaoRepository.obterPorIdSimples(idInscricao);
		if (inscricao?.finalizada) {
			throw new ForbiddenException(
				'Não é possível remover documentos de uma inscrição finalizada.',
			);
		}
		await this.documentoRepository.remover(idInscricao, idTipo);
	}

	async consultar(
		cpf: string,
		idInscricao: number,
	): Promise<ConsultaDocumentosRespostaDto> {
		const inscricao =
			await this.inscricaoRepository.obterPorId(idInscricao);
		if (!inscricao || inscricao.cpf !== cpf) {
			throw new NotFoundException('Inscrição não encontrada.');
		}

		const documentos =
			await this.documentoRepository.obterTodasVersoesSemRecurso(
				idInscricao,
			);

		return {
			id: inscricao.id,
			idEdital: inscricao.idEdital,
			linhaPesquisa: inscricao.linhaPesquisa?.nome ?? null,
			finalizada: inscricao.finalizada,
			deferida: inscricao.deferida,
			documentos: documentos.map(
				(d): DocumentoCandidatoDto => ({
					idTipoDocumentoEdital: d.idTipoDocumentoEdital,
					nomeTipo: d.tipoDocumentoEdital?.nome ?? '',
					versao: d.versao,
					atual: d.atual,
					nomeArquivoOriginal: d.nomeArquivoOriginal,
					mimeType: d.mimeType,
					tamanhoBytes: d.tamanhoBytes,
					enviadoEm: d.enviadoEm,
				}),
			),
		};
	}

	/**
	 * Localiza o documento atual de uma inscrição pelo padrãoNome do tipo
	 * (ex.: 'anteprojeto'), sem depender de CPF. Usado pelo endpoint de
	 * download restrito a avaliadores.
	 */
	async obterArquivoAnteprojetoPorPadraoNome(
		idInscricao: number,
		padraoNome: string,
	): Promise<{ documento: Documento; caminho: string }> {
		const inscricao =
			await this.inscricaoRepository.obterPorIdSimples(idInscricao);
		if (!inscricao) {
			throw new NotFoundException(
				`Inscrição ${idInscricao} não encontrada.`,
			);
		}

		const tipo = await this.tipoDocumentoRepo.findOne({
			where: {
				idEdital: inscricao.idEdital,
				padraoNome,
				recurso: false,
			},
		});
		if (!tipo) {
			throw new NotFoundException(
				`Tipo de documento '${padraoNome}' não encontrado para o edital.`,
			);
		}

		const documento = await this.documentoRepository.obterAtual(
			idInscricao,
			tipo.id,
		);
		if (!documento) {
			throw new NotFoundException('Documento não encontrado.');
		}

		if (!fs.existsSync(documento.caminhoArmazenamento)) {
			throw new NotFoundException('Arquivo não encontrado no servidor.');
		}

		return {
			documento,
			caminho: path.resolve(documento.caminhoArmazenamento),
		};
	}

	async downloadConsulta(
		cpf: string,
		idInscricao: number,
		idTipo: number,
		versao?: number,
		inline = false,
	): Promise<{
		documento: Documento;
		caminho: string;
		inline: boolean;
	}> {
		const inscricao =
			await this.inscricaoRepository.obterPorIdSimples(idInscricao);
		if (!inscricao || inscricao.cpf !== cpf) {
			throw new NotFoundException('Inscrição não encontrada.');
		}

		const documento =
			versao !== undefined
				? await this.documentoRepository.obterVersaoEspecifica(
						idInscricao,
						idTipo,
						versao,
					)
				: await this.documentoRepository.obterAtual(idInscricao, idTipo);

		if (!documento) {
			throw new NotFoundException('Documento não encontrado.');
		}

		if (!fs.existsSync(documento.caminhoArmazenamento)) {
			throw new NotFoundException('Arquivo não encontrado no servidor.');
		}

		return {
			documento,
			caminho: path.resolve(documento.caminhoArmazenamento),
			inline,
		};
	}
}
