import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	LessThanOrEqual,
	MoreThan,
	MoreThanOrEqual,
	Repository,
} from 'typeorm';
import { Edital } from '../database/entities/edital.entity';

@Injectable()
export class EditalRepository {
	constructor(
		@InjectRepository(Edital)
		private readonly repo: Repository<Edital>,
	) {}

	async obterTodos(): Promise<Edital[]> {
		return this.repo.find({ order: { ano: 'DESC', id: 'DESC' } });
	}

	async obterVigente(): Promise<Edital | null> {
		const now = new Date();
		return this.repo.findOne({
			where: {
				ativo: true,
				dataInicioInscricao: LessThanOrEqual(now),
				dataFimInscricao: MoreThanOrEqual(now),
			},
			order: { id: 'DESC' },
			relations: { etapas: true },
		});
	}

	async obterProximo(): Promise<Edital | null> {
		const now = new Date();
		return this.repo.findOne({
			where: { dataInicioInscricao: MoreThan(now) },
			order: { dataInicioInscricao: 'ASC' },
		});
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
