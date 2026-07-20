import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { CriterioAvaliacao } from '../database/entities/criterio-avaliacao.entity';
import { DocenteEdital } from '../database/entities/docente-edital.entity';
import { Inscricao } from '../database/entities/inscricao.entity';
import { NotaCriterio } from '../database/entities/nota-criterio.entity';
import {
	DocenteParaDistribuir,
	InscricaoParaDistribuir,
} from './algorithms/distribuir-anteprojeto.algorithm';
import {
	CandidatoDistribuicao,
	DocenteAtribuido,
	DocenteDistribuicao,
	EtapaDistribuicaoSigla,
	NOME_CRITERIO_POR_ETAPA,
} from './distribuicao.types';

@Injectable()
export class DistribuicaoRepository {
	constructor(
		@InjectRepository(Inscricao)
		private readonly inscricaoRepo: Repository<Inscricao>,
		@InjectRepository(DocenteEdital)
		private readonly docenteEditalRepo: Repository<DocenteEdital>,
		@InjectRepository(CriterioAvaliacao)
		private readonly criterioRepo: Repository<CriterioAvaliacao>,
		@InjectRepository(NotaCriterio)
		private readonly notaCriterioRepo: Repository<NotaCriterio>,
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async obterCriterioPaiPorEtapa(
		idEdital: number,
		siglaEtapa: EtapaDistribuicaoSigla,
	): Promise<CriterioAvaliacao | null> {
		return this.criterioRepo.findOne({
			where: {
				idEdital,
				nome: NOME_CRITERIO_POR_ETAPA[siglaEtapa],
				idCriterioPai: IsNull(),
			},
		});
	}

	async obterSubCriterios(idCriterioPai: number): Promise<CriterioAvaliacao[]> {
		return this.criterioRepo.find({ where: { idCriterioPai } });
	}

	private async carregarInscricoesElegiveis(
		idEdital: number,
	): Promise<Inscricao[]> {
		return this.inscricaoRepo.find({
			where: { idEdital, ativa: true, deferida: true },
			relations: {
				candidato: true,
				linhaPesquisa: true,
				inscricoesPalavraChave: { palavraChave: true },
			},
			order: { id: 'ASC' },
		});
	}

	private async carregarDocentesAtribuidosPorInscricao(
		idsInscricao: number[],
		idsCriterio: number[],
	): Promise<Map<number, string[]>> {
		if (idsInscricao.length === 0) return new Map();

		const rows = await this.notaCriterioRepo
			.createQueryBuilder('nc')
			.distinct(true)
			.select('nc.idInscricao', 'idInscricao')
			.addSelect('nc.codigoDocente', 'codigoDocente')
			.where('nc.idInscricao IN (:...idsInscricao)', { idsInscricao })
			.andWhere('nc.idCriterioAvaliacao IN (:...idsCriterio)', {
				idsCriterio,
			})
			.getRawMany<{ idInscricao: number; codigoDocente: string }>();

		const porInscricao = new Map<number, string[]>();
		for (const row of rows) {
			const lista = porInscricao.get(row.idInscricao) ?? [];
			lista.push(row.codigoDocente);
			porInscricao.set(row.idInscricao, lista);
		}
		return porInscricao;
	}

	async obterCandidatos(
		idEdital: number,
		idCriterioPai: number,
		idsSubCriterios: number[],
	): Promise<CandidatoDistribuicao[]> {
		const inscricoes = await this.carregarInscricoesElegiveis(idEdital);
		if (inscricoes.length === 0) return [];

		const idsCriterio = [idCriterioPai, ...idsSubCriterios];
		const notas = await this.notaCriterioRepo
			.createQueryBuilder('nc')
			.innerJoin('nc.docente', 'docente')
			.select('nc.idInscricao', 'idInscricao')
			.addSelect('nc.codigoDocente', 'codigoDocente')
			.addSelect('docente.nome', 'nome')
			.addSelect('nc.nota', 'nota')
			.where('nc.idInscricao IN (:...idsInscricao)', {
				idsInscricao: inscricoes.map((i) => i.id),
			})
			.andWhere('nc.idCriterioAvaliacao IN (:...idsCriterio)', {
				idsCriterio,
			})
			.getRawMany<{
				idInscricao: number;
				codigoDocente: string;
				nome: string;
				nota: string | null;
			}>();

		const porInscricao = new Map<number, Map<string, DocenteAtribuido>>();
		for (const row of notas) {
			if (!porInscricao.has(row.idInscricao)) {
				porInscricao.set(row.idInscricao, new Map());
			}
			const mapa = porInscricao.get(row.idInscricao)!;
			const temNota = row.nota !== null;
			const existente = mapa.get(row.codigoDocente);
			if (existente) {
				existente.temNotaLancada = existente.temNotaLancada || temNota;
			} else {
				mapa.set(row.codigoDocente, {
					codigoDocente: row.codigoDocente,
					nome: row.nome,
					temNotaLancada: temNota,
				});
			}
		}

		return inscricoes.map((inscricao) => ({
			idInscricao: inscricao.id,
			cpf: inscricao.cpf,
			nome: inscricao.candidato?.nome ?? '',
			idLinhaPesquisa: inscricao.idLinhaPesquisa,
			linhaPesquisa: inscricao.linhaPesquisa?.nome ?? '',
			projetoPesquisa: inscricao.projetoPesquisa ?? '',
			palavrasChave:
				inscricao.inscricoesPalavraChave?.map(
					(ipk) => ipk.palavraChave?.palavra ?? '',
				) ?? [],
			docentesAtribuidos: [...(porInscricao.get(inscricao.id)?.values() ?? [])],
		}));
	}

	async obterInscricoesParaAlgoritmo(
		idEdital: number,
		idCriterioPai: number,
		idsSubCriterios: number[],
	): Promise<InscricaoParaDistribuir[]> {
		const inscricoes = await this.carregarInscricoesElegiveis(idEdital);
		if (inscricoes.length === 0) return [];

		const idsCriterio = [idCriterioPai, ...idsSubCriterios];
		const atribuidosPorInscricao =
			await this.carregarDocentesAtribuidosPorInscricao(
				inscricoes.map((i) => i.id),
				idsCriterio,
			);

		return inscricoes.map((inscricao) => ({
			idInscricao: inscricao.id,
			idLinhaPesquisa: inscricao.idLinhaPesquisa,
			idsPalavraChave: new Set(
				inscricao.inscricoesPalavraChave?.map((ipk) => ipk.idPalavraChave) ??
					[],
			),
			codigosJaAtribuidos: atribuidosPorInscricao.get(inscricao.id) ?? [],
		}));
	}

	private async carregarCargaPorDocente(
		idCriterioPai: number,
	): Promise<Map<string, number>> {
		const cargas = await this.notaCriterioRepo
			.createQueryBuilder('nc')
			.select('nc.codigoDocente', 'codigoDocente')
			.addSelect('COUNT(DISTINCT nc.idInscricao)', 'carga')
			.where('nc.idCriterioAvaliacao = :idCriterioPai', { idCriterioPai })
			.groupBy('nc.codigoDocente')
			.getRawMany<{ codigoDocente: string; carga: string }>();
		return new Map(cargas.map((c) => [c.codigoDocente, Number(c.carga)]));
	}

	async obterDocentes(
		idEdital: number,
		idCriterioPai: number,
	): Promise<DocenteDistribuicao[]> {
		const vinculos = await this.docenteEditalRepo.find({
			where: { idEdital, avaliador: true },
			relations: {
				docente: {
					docentesPalavraChave: { palavraChave: true },
					linhasPesquisa: { linhaPesquisa: true },
				},
			},
		});
		const cargaPorDocente = await this.carregarCargaPorDocente(idCriterioPai);

		return vinculos
			.filter((v) => !!v.docente)
			.map((v) => v.docente)
			.map((docente) => ({
				codigo: docente.codigo,
				nome: docente.nome,
				palavrasChave:
					docente.docentesPalavraChave?.map(
						(dpk) => dpk.palavraChave?.palavra ?? '',
					) ?? [],
				linhasPesquisa:
					docente.linhasPesquisa?.map((dlp) => ({
						id: dlp.idLinhaPesquisa,
						nome: dlp.linhaPesquisa?.nome ?? '',
					})) ?? [],
				cargaAtual: cargaPorDocente.get(docente.codigo) ?? 0,
			}));
	}

	async obterDocentesParaAlgoritmo(
		idEdital: number,
		idCriterioPai: number,
	): Promise<DocenteParaDistribuir[]> {
		const vinculos = await this.docenteEditalRepo.find({
			where: { idEdital, avaliador: true },
			relations: {
				docente: { docentesPalavraChave: true, linhasPesquisa: true },
			},
		});
		const cargaPorDocente = await this.carregarCargaPorDocente(idCriterioPai);

		return vinculos
			.filter((v) => !!v.docente)
			.map((v) => v.docente)
			.map((docente) => ({
				codigo: docente.codigo,
				idsPalavraChave: new Set(
					docente.docentesPalavraChave?.map((dpk) => dpk.idPalavraChave) ??
						[],
				),
				idsLinhaPesquisa: new Set(
					docente.linhasPesquisa?.map((dlp) => dlp.idLinhaPesquisa) ?? [],
				),
				cargaAtual: cargaPorDocente.get(docente.codigo) ?? 0,
			}));
	}

	async substituirAtribuicoes(
		idInscricao: number,
		idCriterioPai: number,
		idsSubCriterios: number[],
		codigosDocentesDesejados: string[],
	): Promise<{ ok: true } | { ok: false; motivo: string }> {
		const idsCriterio = [idCriterioPai, ...idsSubCriterios];

		return this.dataSource.transaction(async (manager) => {
			const atuaisRows = await manager
				.createQueryBuilder(NotaCriterio, 'nc')
				.select('DISTINCT nc.codigoDocente', 'codigoDocente')
				.where('nc.idInscricao = :idInscricao', { idInscricao })
				.andWhere('nc.idCriterioAvaliacao IN (:...idsCriterio)', {
					idsCriterio,
				})
				.getRawMany<{ codigoDocente: string }>();
			const atuais = atuaisRows.map((r) => r.codigoDocente);

			const paraAdicionar = codigosDocentesDesejados.filter(
				(c) => !atuais.includes(c),
			);
			const paraRemover = atuais.filter(
				(c) => !codigosDocentesDesejados.includes(c),
			);

			if (paraRemover.length > 0) {
				const bloqueadosRows = await manager
					.createQueryBuilder(NotaCriterio, 'nc')
					.select('DISTINCT nc.codigoDocente', 'codigoDocente')
					.where('nc.idInscricao = :idInscricao', { idInscricao })
					.andWhere('nc.codigoDocente IN (:...paraRemover)', { paraRemover })
					.andWhere('nc.idCriterioAvaliacao IN (:...idsCriterio)', {
						idsCriterio,
					})
					.andWhere('nc.nota IS NOT NULL')
					.getRawMany<{ codigoDocente: string }>();

				if (bloqueadosRows.length > 0) {
					return {
						ok: false,
						motivo: `Não é possível remover ${bloqueadosRows.map((b) => b.codigoDocente).join(', ')}: já possui nota lançada para esta inscrição.`,
					};
				}

				await manager.delete(NotaCriterio, {
					idInscricao,
					codigoDocente: In(paraRemover),
					idCriterioAvaliacao: In(idsCriterio),
				});
			}

			if (paraAdicionar.length > 0) {
				const linhas = paraAdicionar.flatMap((codigoDocente) =>
					idsCriterio.map((idCriterioAvaliacao) => ({
						idInscricao,
						idCriterioAvaliacao,
						codigoDocente,
						nota: null,
					})),
				);
				await manager.insert(NotaCriterio, linhas);
			}

			return { ok: true };
		});
	}
}
