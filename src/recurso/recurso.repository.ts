import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EtapaEdital } from '../database/entities/etapa-edital.entity';
import { Inscricao } from '../database/entities/inscricao.entity';
import { Recurso } from '../database/entities/recurso.entity';

@Injectable()
export class RecursoRepository {
	constructor(
		@InjectRepository(Recurso)
		private readonly recursoRepo: Repository<Recurso>,
		@InjectRepository(Inscricao)
		private readonly inscricaoRepo: Repository<Inscricao>,
		@InjectRepository(EtapaEdital)
		private readonly etapaEditalRepo: Repository<EtapaEdital>,
	) {}

	async obterInscricaoPorId(id: number): Promise<Inscricao | null> {
		return this.inscricaoRepo.findOne({ where: { id } });
	}

	async obterEtapasDeRecurso(idEdital: number): Promise<EtapaEdital[]> {
		return this.etapaEditalRepo.find({
			where: { idEdital, recurso: true },
			order: { ordem: 'ASC' },
		});
	}

	async obterEtapaPorId(id: number): Promise<EtapaEdital | null> {
		return this.etapaEditalRepo.findOne({ where: { id } });
	}

	async obterRecursosPorInscricaoEEtapas(
		idInscricao: number,
		idsEtapa: number[],
	): Promise<Recurso[]> {
		if (idsEtapa.length === 0) return [];
		return this.recursoRepo
			.createQueryBuilder('recurso')
			.where('recurso.idInscricao = :idInscricao', { idInscricao })
			.andWhere('recurso.idEtapaEdital IN (:...idsEtapa)', { idsEtapa })
			.getMany();
	}

	async obterExistente(
		idInscricao: number,
		idEtapaEdital: number,
	): Promise<Recurso | null> {
		return this.recursoRepo.findOne({
			where: { idInscricao, idEtapaEdital },
		});
	}

	async obterPorId(id: number): Promise<Recurso | null> {
		return this.recursoRepo.findOne({ where: { id } });
	}

	async obterPorEtapaGestao(
		idEdital: number,
		etapaNome: string,
	): Promise<Recurso[]> {
		return this.recursoRepo
			.createQueryBuilder('recurso')
			.innerJoinAndSelect('recurso.etapaEdital', 'etapaEdital')
			.innerJoinAndSelect('recurso.inscricao', 'inscricao')
			.innerJoinAndSelect('inscricao.candidato', 'candidato')
			.where('etapaEdital.idEdital = :idEdital', { idEdital })
			.andWhere('etapaEdital.nome = :etapaNome', { etapaNome })
			.orderBy('recurso.createdAt', 'DESC')
			.getMany();
	}

	async criar(dados: {
		texto: string;
		idEtapaEdital: number;
		idInscricao: number;
	}): Promise<Recurso> {
		const recurso = this.recursoRepo.create(dados);
		return this.recursoRepo.save(recurso);
	}

	async salvarDecisao(
		recurso: Recurso,
		deferido: boolean,
		comentario: string,
	): Promise<Recurso> {
		recurso.deferido = deferido;
		recurso.comentario = comentario;
		return this.recursoRepo.save(recurso);
	}

	async remover(id: number): Promise<void> {
		await this.recursoRepo.delete({ id });
	}
}
