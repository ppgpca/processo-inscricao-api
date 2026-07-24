import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edital } from '../database/entities/edital.entity';

@Injectable()
export class EditalRepository {
	constructor(
		@InjectRepository(Edital)
		private readonly repo: Repository<Edital>,
	) {}

	async obterTodos(): Promise<Edital[]> {
		return this.repo.find({
			relations: { etapas: true },
			order: { ano: 'DESC', id: 'DESC' },
		});
	}

	async obterVigente(): Promise<Edital | null> {
		const now = new Date();
		return this.repo
			.createQueryBuilder('edital')
			.innerJoin(
				'edital.etapas',
				'etapa',
				'etapa.nome = :nome AND etapa.data_inicio <= :now AND etapa.data_fim >= :now',
				{ nome: 'INSCRICAO', now },
			)
			.leftJoinAndSelect('edital.etapas', 'todas_etapas')
			.where('edital.ativo = true')
			.orderBy('edital.id', 'DESC')
			.addOrderBy('todas_etapas.ordem', 'ASC')
			.getOne();
	}

	async obterProximo(): Promise<Edital | null> {
		const now = new Date();
		return this.repo
			.createQueryBuilder('edital')
			.innerJoin(
				'edital.etapas',
				'etapa',
				'etapa.nome = :nome AND etapa.data_inicio > :now',
				{ nome: 'INSCRICAO', now },
			)
			.leftJoinAndSelect('edital.etapas', 'todas_etapas')
			.orderBy('etapa.data_inicio', 'ASC')
			.addOrderBy('todas_etapas.ordem', 'ASC')
			.getOne();
	}

	async obterPorId(id: number): Promise<Edital | null> {
		return this.repo.findOne({
			where: { id },
			relations: { etapas: true },
			order: { etapas: { ordem: 'ASC' } },
		});
	}

	async obterComTiposDocumento(id: number): Promise<Edital | null> {
		return this.repo.findOne({
			where: { id },
			relations: { tiposDocumento: true },
		});
	}
}
