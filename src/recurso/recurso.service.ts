import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Recurso } from '../database/entities/recurso.entity';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { DecisaoRecursoDto } from './dto/decisao-recurso.dto';
import { RecursoRepository } from './recurso.repository';
import {
	EtapaRecursoConsulta,
	RecursoGestaoRow,
	StatusEtapaRecurso,
} from './recurso.types';

@Injectable()
export class RecursoService {
	constructor(private readonly recursoRepository: RecursoRepository) {}

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

		const agora = new Date();

		return etapas.map((etapa) => ({
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
			recurso: recursos.find((r) => r.idEtapaEdital === etapa.id) ?? null,
		}));
	}

	async criar(dto: CreateRecursoDto): Promise<Recurso> {
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

		return this.recursoRepository.criar({
			texto: dto.texto.trim(),
			idEtapaEdital: dto.idEtapaEdital,
			idInscricao: dto.idInscricao,
		});
	}

	async listarPorEtapa(
		idEdital: number,
		etapaNome: string,
	): Promise<RecursoGestaoRow[]> {
		const recursos = await this.recursoRepository.obterPorEtapaGestao(
			idEdital,
			etapaNome,
		);
		return recursos.map((r) => ({
			id: r.id,
			texto: r.texto,
			idEtapaEdital: r.idEtapaEdital,
			idInscricao: r.idInscricao,
			deferido: r.deferido,
			comentario: r.comentario,
			createdAt: r.createdAt,
			updatedAt: r.updatedAt,
			candidatoNome: r.inscricao.candidato?.nome ?? '',
			candidatoCpf: r.inscricao.cpf,
		}));
	}

	async decidir(id: number, dto: DecisaoRecursoDto): Promise<Recurso> {
		const recurso = await this.recursoRepository.obterPorId(id);
		if (!recurso) {
			throw new NotFoundException(`Recurso ${id} não encontrado.`);
		}
		return this.recursoRepository.salvarDecisao(
			recurso,
			dto.deferido,
			dto.comentario,
		);
	}

	async remover(id: number): Promise<void> {
		const recurso = await this.recursoRepository.obterPorId(id);
		if (!recurso) {
			throw new NotFoundException(`Recurso ${id} não encontrado.`);
		}
		await this.recursoRepository.remover(id);
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
