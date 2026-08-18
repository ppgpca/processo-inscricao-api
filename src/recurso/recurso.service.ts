import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Documento } from '../database/entities/documento.entity';
import { Recurso } from '../database/entities/recurso.entity';
import { TipoDocumentoEdital } from '../database/entities/tipo-documento-edital.entity';
import { DocumentoService } from '../documento/documento.service';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { DecisaoRecursoDto } from './dto/decisao-recurso.dto';
import { UploadDocumentoRecursoDto } from './dto/upload-documento-recurso.dto';
import { RecursoRepository } from './recurso.repository';
import {
	DocumentoRecursoResumo,
	EtapaRecursoConsulta,
	obterSlotsDocumentoRecurso,
	RecursoGestaoRow,
	RecursoResumo,
	SlotDocumentoRecurso,
	SlotDocumentoRecursoConfig,
	StatusEtapaRecurso,
} from './recurso.types';

@Injectable()
export class RecursoService {
	constructor(
		private readonly recursoRepository: RecursoRepository,
		private readonly documentoService: DocumentoService,
	) {}

	async consultar(
		cpf: string,
		idInscricao: number,
	): Promise<EtapaRecursoConsulta[]> {
		const inscricao =
			await this.recursoRepository.obterInscricaoPorId(idInscricao);
		if (!inscricao || inscricao.cpf !== cpf) {
			throw new NotFoundException('Inscrição não encontrada.');
		}

		const etapas = await this.recursoRepository.obterEtapasDeRecurso(
			inscricao.idEdital,
		);
		if (etapas.length === 0) return [];

		const recursos =
			await this.recursoRepository.obterRecursosPorInscricaoEEtapas(
				idInscricao,
				etapas.map((e) => e.id),
			);

		const padroes = [
			...new Set(
				etapas.flatMap((e) =>
					obterSlotsDocumentoRecurso(e.nome).map((s) => s.padraoNome),
				),
			),
		];
		const tipos =
			await this.recursoRepository.obterTiposDocumentoPorPadroes(
				inscricao.idEdital,
				padroes,
			);
		const tipoPorPadrao = new Map(
			tipos.map((t) => [t.padraoNome, t] as const),
		);
		const documentos = await this.recursoRepository.obterDocumentosAtuais(
			idInscricao,
			tipos.map((t) => t.id),
		);
		const documentoPorTipo = new Map(
			documentos.map((d) => [d.idTipoDocumentoEdital, d] as const),
		);

		const agora = new Date();

		return etapas.map((etapa) => {
			const slotsConfig = obterSlotsDocumentoRecurso(etapa.nome);
			const slotsDocumento = this.montarSlots(
				slotsConfig,
				tipoPorPadrao,
				documentoPorTipo,
			);
			const recurso =
				recursos.find((r) => r.idEtapaEdital === etapa.id) ?? null;

			return {
				etapa: {
					id: etapa.id,
					nome: etapa.nome,
					descricao: etapa.descricao,
					ordem: etapa.ordem,
					dataInicio: etapa.dataInicio,
					dataFim: etapa.dataFim,
				},
				status: this.calcularStatus(
					etapa.dataInicio,
					etapa.dataFim,
					agora,
				),
				recurso: recurso
					? this.toRecursoResumo(recurso, slotsDocumento)
					: null,
				slotsDocumento,
			};
		});
	}

	async criar(dto: CreateRecursoDto): Promise<RecursoResumo> {
		const inscricao = await this.recursoRepository.obterInscricaoPorId(
			dto.idInscricao,
		);
		if (!inscricao || inscricao.cpf !== dto.cpf) {
			throw new NotFoundException('Inscrição não encontrada.');
		}

		const etapa = await this.recursoRepository.obterEtapaPorId(
			dto.idEtapaEdital,
		);
		if (!etapa || etapa.idEdital !== inscricao.idEdital || !etapa.recurso) {
			throw new BadRequestException('Etapa de recurso inválida.');
		}

		const agora = new Date();
		if (
			this.calcularStatus(etapa.dataInicio, etapa.dataFim, agora) !==
			'ativa'
		) {
			throw new BadRequestException(
				'Fora do prazo de recurso para esta etapa.',
			);
		}

		const existente = await this.recursoRepository.obterExistente(
			dto.idInscricao,
			dto.idEtapaEdital,
		);
		if (existente) {
			throw new ConflictException('Recurso já enviado para esta etapa.');
		}

		const recurso = await this.recursoRepository.criar({
			texto: dto.texto.trim(),
			idEtapaEdital: dto.idEtapaEdital,
			idInscricao: dto.idInscricao,
		});

		const slotsDocumento = await this.obterSlotsDaEtapa(
			inscricao.idEdital,
			dto.idInscricao,
			etapa.nome,
		);

		return this.toRecursoResumo(recurso, slotsDocumento);
	}

	async uploadDocumento(
		dto: UploadDocumentoRecursoDto,
		file: Express.Multer.File,
	): Promise<DocumentoRecursoResumo> {
		const inscricao = await this.recursoRepository.obterInscricaoPorId(
			dto.idInscricao,
		);
		if (!inscricao || inscricao.cpf !== dto.cpf) {
			throw new NotFoundException('Inscrição não encontrada.');
		}

		const etapa = await this.recursoRepository.obterEtapaPorId(
			dto.idEtapaEdital,
		);
		if (!etapa || etapa.idEdital !== inscricao.idEdital || !etapa.recurso) {
			throw new BadRequestException('Etapa de recurso inválida.');
		}

		const agora = new Date();
		if (
			this.calcularStatus(etapa.dataInicio, etapa.dataFim, agora) !==
			'ativa'
		) {
			throw new BadRequestException(
				'Fora do prazo de recurso para esta etapa.',
			);
		}

		const slotsConfig = obterSlotsDocumentoRecurso(etapa.nome);
		if (slotsConfig.length === 0) {
			throw new BadRequestException(
				'Tipo de documento de recurso não configurado para esta etapa.',
			);
		}

		const tipoDoc = await this.recursoRepository.obterTipoDocumentoPorId(
			dto.idTipoDocumentoEdital,
		);
		if (
			!tipoDoc ||
			tipoDoc.idEdital !== inscricao.idEdital ||
			!tipoDoc.recurso
		) {
			throw new BadRequestException(
				'Tipo de documento inválido para esta etapa de recurso.',
			);
		}

		const slot = slotsConfig.find(
			(s) => s.padraoNome === tipoDoc.padraoNome,
		);
		if (!slot) {
			throw new BadRequestException(
				'Tipo de documento inválido para esta etapa de recurso.',
			);
		}

		const documento = await this.documentoService.upload(
			dto.idInscricao,
			tipoDoc.id,
			file,
		);

		return this.toDocumentoResumo(documento, slot, tipoDoc);
	}

	async listarPorEtapa(
		idEdital: number,
		etapaNome: string,
	): Promise<RecursoGestaoRow[]> {
		const recursos = await this.recursoRepository.obterPorEtapaGestao(
			idEdital,
			etapaNome,
		);
		if (recursos.length === 0) return [];

		const slotsConfig = obterSlotsDocumentoRecurso(etapaNome);
		const tipos =
			await this.recursoRepository.obterTiposDocumentoPorPadroes(
				idEdital,
				slotsConfig.map((s) => s.padraoNome),
			);
		const tipoPorPadrao = new Map(
			tipos.map((t) => [t.padraoNome, t] as const),
		);

		const idsInscricao = [...new Set(recursos.map((r) => r.idInscricao))];
		const docsPorInscricaoTipo = new Map<string, Documento>();
		if (tipos.length > 0 && idsInscricao.length > 0) {
			for (const tipo of tipos) {
				const docsTipo =
					await this.recursoRepository.obterDocumentosAtuaisPorInscricoes(
						idsInscricao,
						tipo.id,
					);
				for (const doc of docsTipo) {
					docsPorInscricaoTipo.set(
						`${doc.idInscricao}:${doc.idTipoDocumentoEdital}`,
						doc,
					);
				}
			}
		}

		return recursos.map((r) => {
			const documentoPorTipo = new Map<number, Documento>();
			for (const tipo of tipos) {
				const doc = docsPorInscricaoTipo.get(`${r.idInscricao}:${tipo.id}`);
				if (doc) documentoPorTipo.set(tipo.id, doc);
			}
			const slotsDocumento = this.montarSlots(
				slotsConfig,
				tipoPorPadrao,
				documentoPorTipo,
			);
			return {
				...this.toRecursoResumo(r, slotsDocumento),
				candidatoNome: r.inscricao.candidato?.nome ?? '',
				candidatoCpf: r.inscricao.cpf,
			};
		});
	}

	async decidir(id: number, dto: DecisaoRecursoDto): Promise<RecursoResumo> {
		const recurso = await this.recursoRepository.obterPorId(id);
		if (!recurso) {
			throw new NotFoundException(`Recurso ${id} não encontrado.`);
		}

		const etapa = await this.recursoRepository.obterEtapaPorId(
			recurso.idEtapaEdital,
		);
		if (!etapa) {
			throw new NotFoundException('Etapa de recurso não encontrada.');
		}
		this.garantirPrazoEncerradoParaGestao(etapa.dataFim);

		const salvo = await this.recursoRepository.salvarDecisao(
			recurso,
			dto.deferido,
			dto.comentario,
		);

		const slotsDocumento = await this.obterSlotsDaEtapa(
			etapa.idEdital,
			salvo.idInscricao,
			etapa.nome,
		);

		return this.toRecursoResumo(salvo, slotsDocumento);
	}

	async remover(id: number): Promise<void> {
		const recurso = await this.recursoRepository.obterPorId(id);
		if (!recurso) {
			throw new NotFoundException(`Recurso ${id} não encontrado.`);
		}

		const etapa = await this.recursoRepository.obterEtapaPorId(
			recurso.idEtapaEdital,
		);
		if (!etapa) {
			throw new NotFoundException('Etapa de recurso não encontrada.');
		}
		this.garantirPrazoEncerradoParaGestao(etapa.dataFim);

		await this.recursoRepository.remover(id);
	}

	/** Decisão e remoção só após o fim do prazo de envio do candidato. */
	private garantirPrazoEncerradoParaGestao(dataFim: Date | null): void {
		if (!dataFim || new Date(dataFim) >= new Date()) {
			throw new BadRequestException(
				'A edição de recursos só é permitida após o término do prazo de envio. A visualização e o download dos documentos permanecem disponíveis.',
			);
		}
	}

	private async obterSlotsDaEtapa(
		idEdital: number,
		idInscricao: number,
		nomeEtapa: string,
	): Promise<SlotDocumentoRecurso[]> {
		const slotsConfig = obterSlotsDocumentoRecurso(nomeEtapa);
		const tipos =
			await this.recursoRepository.obterTiposDocumentoPorPadroes(
				idEdital,
				slotsConfig.map((s) => s.padraoNome),
			);
		const tipoPorPadrao = new Map(
			tipos.map((t) => [t.padraoNome, t] as const),
		);
		const documentos = await this.recursoRepository.obterDocumentosAtuais(
			idInscricao,
			tipos.map((t) => t.id),
		);
		const documentoPorTipo = new Map(
			documentos.map((d) => [d.idTipoDocumentoEdital, d] as const),
		);
		return this.montarSlots(slotsConfig, tipoPorPadrao, documentoPorTipo);
	}

	private montarSlots(
		slotsConfig: SlotDocumentoRecursoConfig[],
		tipoPorPadrao: Map<string, TipoDocumentoEdital>,
		documentoPorTipo: Map<number, Documento>,
	): SlotDocumentoRecurso[] {
		const slots: SlotDocumentoRecurso[] = [];
		for (const slot of slotsConfig) {
			const tipo = tipoPorPadrao.get(slot.padraoNome);
			if (!tipo) continue;
			const documento = documentoPorTipo.get(tipo.id) ?? null;
			slots.push({
				padraoNome: slot.padraoNome,
				label: slot.label,
				idTipoDocumentoEdital: tipo.id,
				documento: documento
					? this.toDocumentoResumo(documento, slot, tipo)
					: null,
			});
		}
		return slots;
	}

	private toDocumentoResumo(
		documento: Documento,
		slot: SlotDocumentoRecursoConfig,
		tipo: TipoDocumentoEdital,
	): DocumentoRecursoResumo {
		return {
			idTipoDocumentoEdital: documento.idTipoDocumentoEdital,
			padraoNome: tipo.padraoNome,
			label: slot.label,
			versao: documento.versao,
			nomeArquivoOriginal: documento.nomeArquivoOriginal,
			nomeArquivo: documento.nomeArquivo,
			mimeType: documento.mimeType,
			tamanhoBytes: documento.tamanhoBytes,
			enviadoEm: documento.enviadoEm,
		};
	}

	private toRecursoResumo(
		recurso: Recurso,
		slotsDocumento: SlotDocumentoRecurso[],
	): RecursoResumo {
		return {
			id: recurso.id,
			texto: recurso.texto,
			idEtapaEdital: recurso.idEtapaEdital,
			idInscricao: recurso.idInscricao,
			deferido: recurso.deferido,
			comentario: recurso.comentario,
			createdAt: recurso.createdAt,
			updatedAt: recurso.updatedAt,
			documentos: slotsDocumento
				.map((s) => s.documento)
				.filter((d): d is DocumentoRecursoResumo => d !== null),
		};
	}

	private calcularStatus(
		dataInicio: Date,
		dataFim: Date | null,
		agora: Date,
	): StatusEtapaRecurso {
		if (dataFim && new Date(dataFim) < agora) return 'passada';
		if (new Date(dataInicio) <= agora) return 'ativa';
		return 'futura';
	}
}
