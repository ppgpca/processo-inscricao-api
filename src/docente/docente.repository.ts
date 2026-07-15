import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CriterioAvaliacao } from '../database/entities/criterio-avaliacao.entity';
import { DocenteEdital } from '../database/entities/docente-edital.entity';
import { Edital } from '../database/entities/edital.entity';
import { NotaCriterio } from '../database/entities/nota-criterio.entity';

@Injectable()
export class DocenteRepository {
	constructor(
		@InjectRepository(DocenteEdital)
		private readonly docenteEditalRepo: Repository<DocenteEdital>,
		@InjectRepository(CriterioAvaliacao)
		private readonly criterioRepo: Repository<CriterioAvaliacao>,
		@InjectRepository(NotaCriterio)
		private readonly notaCriterioRepo: Repository<NotaCriterio>,
	) {}

	async obterEditaisComoAvaliador(codigoDocente: string): Promise<Edital[]> {
		const vinculos = await this.docenteEditalRepo.find({
			where: { codigoDocente, avaliador: true },
			relations: { edital: true },
		});
		return vinculos
			.map((v) => v.edital)
			.sort((a, b) => b.ano - a.ano || b.id - a.id);
	}

	async obterCriteriosPorEdital(
		idEdital: number,
	): Promise<CriterioAvaliacao[]> {
		return this.criterioRepo.find({
			where: { idEdital, idCriterioPai: IsNull() },
			order: { ordem: 'ASC' },
		});
	}

	async obterSubCriteriosPorPai(
		idCriterioPai: number,
	): Promise<CriterioAvaliacao[]> {
		return this.criterioRepo.find({
			where: { idCriterioPai },
			order: { ordem: 'ASC' },
		});
	}

	async salvarNotas(
		codigoDocente: string,
		notas: {
			idInscricao: number;
			idCriterioAvaliacao: number;
			nota: number;
		}[],
	): Promise<void> {
		await this.notaCriterioRepo.upsert(
			notas.map((n) => ({
				idInscricao: n.idInscricao,
				idCriterioAvaliacao: n.idCriterioAvaliacao,
				codigoDocente,
				nota: n.nota,
			})),
			{
				conflictPaths: [
					'idInscricao',
					'idCriterioAvaliacao',
					'codigoDocente',
				],
				skipUpdateIfNoValuesChanged: true,
			},
		);
	}

	async obterCandidatosParaAvaliar(
		codigoDocente: string,
		idCriterio: number,
	): Promise<NotaCriterio[]> {
		return this.notaCriterioRepo.find({
			where: { codigoDocente, idCriterioAvaliacao: idCriterio },
			relations: {
				inscricao: {
					inscricoesPalavraChave: { palavraChave: true },
				},
			},
		});
	}

	async obterNotasPorInscricaoECriterio(
		codigoDocente: string,
		idInscricao: number,
		idCriterio: number,
	): Promise<NotaCriterio[]> {
		const subCriterios = await this.criterioRepo.find({
			where: { idCriterioPai: idCriterio },
			select: { id: true },
		});
		const idsCriterio = [idCriterio, ...subCriterios.map((c) => c.id)];

		return this.notaCriterioRepo
			.createQueryBuilder('nc')
			.where('nc.codigoDocente = :codigoDocente', { codigoDocente })
			.andWhere('nc.idInscricao = :idInscricao', { idInscricao })
			.andWhere('nc.idCriterioAvaliacao IN (:...idsCriterio)', {
				idsCriterio,
			})
			.getMany();
	}
}
