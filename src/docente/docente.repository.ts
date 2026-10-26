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
			comentario?: string | null;
			expertiseAssunto?: number | null;
		}[],
	): Promise<void> {
		await this.notaCriterioRepo.upsert(
			notas.map((n) => {
				const base = {
					idInscricao: n.idInscricao,
					idCriterioAvaliacao: n.idCriterioAvaliacao,
					codigoDocente,
					nota: n.nota,
				};
				
				const updates: Record<string, any> = {};
				
				// Só inclui comentario quando a chave vier definida (mesmo que null),
				// para que salvar subcritérios (sem comentario) não apague observações existentes
				if (n.comentario !== undefined) {
					const comentarioNormalizado =
						typeof n.comentario === 'string' && n.comentario.trim()
							? n.comentario.trim()
							: null;
					updates.comentario = comentarioNormalizado;
				}
				
				// Mesma lógica para expertiseAssunto
				if (n.expertiseAssunto !== undefined) {
					const expertiseValida = 
						typeof n.expertiseAssunto === 'number' && 
						n.expertiseAssunto >= 1 && 
						n.expertiseAssunto <= 5;
					updates.expertiseAssunto = expertiseValida ? n.expertiseAssunto : null;
				}
				
				return { ...base, ...updates };
			}),
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
					linhaPesquisa: true,
					inscricoesPalavraChave: { palavraChave: true },
				},
			},
		});
	}

	async verificarVinculoComCandidato(
		codigoDocente: string,
		idInscricao: number,
	): Promise<boolean> {
		const count = await this.notaCriterioRepo.count({
			where: { codigoDocente, idInscricao },
		});
		return count > 0;
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
