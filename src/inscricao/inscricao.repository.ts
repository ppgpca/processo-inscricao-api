import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CriterioAvaliacao } from '../database/entities/criterio-avaliacao.entity';
import {
	EtapaEdital,
	TipoEtapa,
} from '../database/entities/etapa-edital.entity';
import { InscricaoPalavraChave } from '../database/entities/inscricao-palavra-chave.entity';
import { Inscricao } from '../database/entities/inscricao.entity';
import { NotaCriterio } from '../database/entities/nota-criterio.entity';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';

export interface AvaliadorNota {
	codigoDocente: string;
	nome: string;
}

export interface AvaliacaoInscrito {
	idCriterio: number;
	nome: string;
	descricao: string | null;
	notaMaxima: number;
	peso: number;
	nota: number | null;
	qtdAvaliadores: number;
	ordem: number;
	avaliadores: AvaliadorNota[];
}

@Injectable()
export class InscricaoRepository {
	constructor(
		@InjectRepository(Inscricao)
		private readonly repo: Repository<Inscricao>,
		@InjectRepository(InscricaoPalavraChave)
		private readonly inscricaoPalavraChaveRepo: Repository<InscricaoPalavraChave>,
		@InjectRepository(CriterioAvaliacao)
		private readonly criterioRepo: Repository<CriterioAvaliacao>,
		@InjectRepository(NotaCriterio)
		private readonly notaCriterioRepo: Repository<NotaCriterio>,
		@InjectRepository(EtapaEdital)
		private readonly etapaEditalRepo: Repository<EtapaEdital>,
	) {}

	async obterEtapaPorOrdem(
		idEdital: number,
		ordem: number,
	): Promise<EtapaEdital | null> {
		return this.etapaEditalRepo.findOne({
			where: { idEdital, ordem },
		});
	}

	async obterEtapaHomologacao(
		idEdital: number,
	): Promise<EtapaEdital | null> {
		return this.etapaEditalRepo.findOne({
			where: { idEdital, tipo: TipoEtapa.HOMOLOGACAO },
			order: { ordem: 'ASC' },
		});
	}

	async obterPorCpfEdital(
		cpf: string,
		idEdital: number,
	): Promise<Inscricao | null> {
		return this.repo.findOne({
			where: { cpf, idEdital, ativa: true },
			relations: {
				linhaPesquisa: true,
				documentos: { tipoDocumentoEdital: true },
				inscricoesPalavraChave: { palavraChave: true },
			},
		});
	}

	async obterPorId(id: number): Promise<Inscricao | null> {
		return this.repo.findOne({
			where: { id },
			relations: {
				candidato: true,
				linhaPesquisa: true,
				documentos: { tipoDocumentoEdital: true },
				inscricoesPalavraChave: { palavraChave: true },
			},
		});
	}

	async obterPorIdSimples(id: number): Promise<Inscricao | null> {
		return this.repo.findOne({ where: { id } });
	}

	async obterDuplicata(
		cpf: string,
		idEdital: number,
	): Promise<Inscricao | null> {
		return this.repo.findOne({ where: { cpf, idEdital, ativa: true } });
	}

	async criar(dados: CreateInscricaoDto): Promise<Inscricao> {
		const inscricao = this.repo.create({
			cpf: dados.cpf,
			idEdital: dados.idEdital,
			idLinhaPesquisa: dados.idLinhaPesquisa ?? undefined,
			etapa: dados.etapa ?? 1,
			ativa: true,
			dadosComplementares: dados.dadosComplementares ?? null,
			deficiente: dados.deficiente ?? null,
			indigena: dados.indigena ?? null,
			pretoPardo: dados.pretoPardo ?? null,
			areaConcentracao: dados.areaConcentracao ?? null,
			projetoPesquisa: dados.projetoPesquisa ?? null,
			idEtapaAtual: dados.idEtapaAtual ?? null,
		});
		const inscricaoSalva = await this.repo.save(inscricao);

		if (dados.idsPalavrasChave?.length) {
			await this.sincronizarPalavrasChave(
				inscricaoSalva.id,
				dados.idsPalavrasChave,
			);
		}

		return (await this.obterPorId(inscricaoSalva.id)) ?? inscricaoSalva;
	}

	async atualizar(
		inscricao: Inscricao,
		dados: UpdateInscricaoDto,
	): Promise<Inscricao> {
		const { idsPalavrasChave, ...dadosSemPalavrasChave } = dados;
		Object.assign(inscricao, dadosSemPalavrasChave);
		const inscricaoSalva = await this.repo.save(inscricao);

		if (idsPalavrasChave !== undefined) {
			await this.sincronizarPalavrasChave(inscricaoSalva.id, idsPalavrasChave);
		}

		return (await this.obterPorId(inscricaoSalva.id)) ?? inscricaoSalva;
	}

	private async sincronizarPalavrasChave(
		idInscricao: number,
		idsPalavrasChave: number[],
	): Promise<void> {
		await this.inscricaoPalavraChaveRepo.delete({ idInscricao });

		if (idsPalavrasChave.length > 0) {
			const registros = idsPalavrasChave.map((idPalavraChave) =>
				this.inscricaoPalavraChaveRepo.create({ idInscricao, idPalavraChave }),
			);
			await this.inscricaoPalavraChaveRepo.save(registros);
		}
	}

	async obterMaisRecentePorCpf(cpf: string): Promise<Inscricao | null> {
		return this.repo.findOne({
			where: { cpf },
			order: { id: 'DESC' },
		});
	}

	async desativar(id: number): Promise<void> {
		await this.repo.update({ id }, { ativa: false });
	}

	async obterInscricoesPorDia(
		idEdital?: number,
	): Promise<{ data: string; quantidade: number }[]> {
		const qb = this.repo
			.createQueryBuilder('i')
			.select('DATE(i."createdAt")', 'data')
			.addSelect('COUNT(*)', 'quantidade')
			.where('i.ativa = true')
			.groupBy('DATE(i."createdAt")')
			.orderBy('DATE(i."createdAt")', 'ASC');

		if (idEdital) {
			qb.andWhere('i.id_edital = :idEdital', { idEdital });
		}

		const rows = await qb.getRawMany<{ data: string; quantidade: string }>();
		return rows.map((r) => ({ data: r.data, quantidade: Number(r.quantidade) }));
	}

	async obterInscritosPorLinhaPesquisa(
		idEdital?: number,
	): Promise<{ linhaPesquisa: string; quantidade: number }[]> {
		const qb = this.repo
			.createQueryBuilder('i')
			.leftJoin('i.linhaPesquisa', 'lp')
			.select("COALESCE(lp.nome, 'Sem linha')", 'linhaPesquisa')
			.addSelect('COUNT(*)', 'quantidade')
			.where('i.ativa = true')
			.groupBy('lp.nome')
			.orderBy('lp.nome', 'ASC', 'NULLS LAST');

		if (idEdital) {
			qb.andWhere('i.id_edital = :idEdital', { idEdital });
		}

		const rows = await qb.getRawMany<{
			linhaPesquisa: string;
			quantidade: string;
		}>();
		return rows.map((r) => ({
			linhaPesquisa: r.linhaPesquisa,
			quantidade: Number(r.quantidade),
		}));
	}

	async obterListaInscritos(idEdital?: number): Promise<
		{
			idInscricao: number;
			nome: string;
			cpf: string;
			linhaPesquisa: string;
			siglaLinhaPesquisa: string;
			anteprojeto: string;
			palavrasChave: string[];
			dataInscricao: string;
			deferida: boolean | null;
			avaliacoes: AvaliacaoInscrito[];
		}[]
	> {
		const qb = this.repo
			.createQueryBuilder('i')
			.leftJoin('i.candidato', 'c')
			.leftJoin('i.linhaPesquisa', 'lp')
			.leftJoin('i.inscricoesPalavraChave', 'ipc')
			.leftJoin('ipc.palavraChave', 'pc')
			.select('i.cpf', 'cpf')
			.addSelect('MIN(i.id)', 'idInscricao')
			.addSelect("COALESCE(c.nome, '')", 'nome')
			.addSelect("COALESCE(lp.nome, '')", 'linhaPesquisa')
			.addSelect("COALESCE(lp.sigla, '')", 'siglaLinhaPesquisa')
			.addSelect("COALESCE(i.projeto_pesquisa, '')", 'anteprojeto')
			.addSelect(
				"COALESCE(STRING_AGG(pc.palavra, ',' ORDER BY pc.palavra), '')",
				'palavrasChave',
			)
			.addSelect('MIN(i."createdAt")', 'dataInscricao')
			.addSelect('MAX(i.deferida::int)::boolean', 'deferida')
			.where('i.ativa = true')
			.groupBy('i.cpf')
			.addGroupBy('c.nome')
			.addGroupBy('lp.nome')
			.addGroupBy('lp.sigla')
			.addGroupBy('i.projeto_pesquisa')
			.orderBy('c.nome', 'ASC', 'NULLS LAST');

		if (idEdital) {
			qb.andWhere('i.id_edital = :idEdital', { idEdital });
		}

		const [rows, criteriosPai] = await Promise.all([
			qb.getRawMany<{
				idInscricao: number;
				nome: string;
				cpf: string;
				linhaPesquisa: string;
				siglaLinhaPesquisa: string;
				anteprojeto: string;
				palavrasChave: string;
				dataInscricao: string;
				deferida: boolean | null;
			}>(),
			idEdital
				? this.criterioRepo.find({
						where: { idEdital, idCriterioPai: IsNull() },
						order: { ordem: 'ASC' },
					})
				: Promise.resolve([]),
		]);

		const idsInscricao = rows.map((r) => Number(r.idInscricao));
		const notasPorInscricao = await this.obterNotasCriteriosPai(
			idsInscricao,
			criteriosPai.map((c) => c.id),
		);

		return rows.map((r) => {
			const idInscricao = Number(r.idInscricao);
			const notas = notasPorInscricao.get(idInscricao) ?? new Map();
			return {
				...r,
				idInscricao,
				palavrasChave: r.palavrasChave ? r.palavrasChave.split(',') : [],
				avaliacoes: criteriosPai.map((c) => {
					const dados = notas.get(c.id);
					return {
						idCriterio: c.id,
						nome: c.nome,
						descricao: c.descricao ?? null,
						notaMaxima: Number(c.notaMaxima),
						peso: Number(c.peso),
						nota: dados ? dados.nota : null,
						qtdAvaliadores: dados?.qtdAvaliadores ?? 0,
						ordem: c.ordem,
						avaliadores: dados?.avaliadores ?? [],
					};
				}),
			};
		});
	}

	/**
	 * Média, quantidade e lista de docentes com nota por inscrição × critério pai.
	 */
	private async obterNotasCriteriosPai(
		idsInscricao: number[],
		idsCriterio: number[],
	): Promise<
		Map<
			number,
			Map<
				number,
				{
					nota: number;
					qtdAvaliadores: number;
					avaliadores: AvaliadorNota[];
				}
			>
		>
	> {
		const resultado = new Map<
			number,
			Map<
				number,
				{
					nota: number;
					qtdAvaliadores: number;
					avaliadores: AvaliadorNota[];
				}
			>
		>();
		if (idsInscricao.length === 0 || idsCriterio.length === 0) {
			return resultado;
		}

		const rows = await this.notaCriterioRepo
			.createQueryBuilder('nc')
			.innerJoin('nc.docente', 'd')
			.select('nc.idInscricao', 'idInscricao')
			.addSelect('nc.idCriterioAvaliacao', 'idCriterio')
			.addSelect('nc.codigoDocente', 'codigoDocente')
			.addSelect('d.nome', 'nomeDocente')
			.addSelect('nc.nota', 'nota')
			.where('nc.idInscricao IN (:...idsInscricao)', { idsInscricao })
			.andWhere('nc.idCriterioAvaliacao IN (:...idsCriterio)', {
				idsCriterio,
			})
			.andWhere('nc.nota IS NOT NULL')
			.orderBy('d.nome', 'ASC')
			.getRawMany<{
				idInscricao: number;
				idCriterio: number;
				codigoDocente: string;
				nomeDocente: string;
				nota: string;
			}>();

		for (const row of rows) {
			const idInscricao = Number(row.idInscricao);
			const idCriterio = Number(row.idCriterio);
			if (!resultado.has(idInscricao)) {
				resultado.set(idInscricao, new Map());
			}
			const porCriterio = resultado.get(idInscricao)!;
			if (!porCriterio.has(idCriterio)) {
				porCriterio.set(idCriterio, {
					nota: 0,
					qtdAvaliadores: 0,
					avaliadores: [],
				});
			}
			const atual = porCriterio.get(idCriterio)!;
			const nota = Number(row.nota);
			atual.nota =
				(atual.nota * atual.qtdAvaliadores + nota) /
				(atual.qtdAvaliadores + 1);
			atual.qtdAvaliadores += 1;
			if (
				!atual.avaliadores.some(
					(a) => a.codigoDocente === row.codigoDocente,
				)
			) {
				atual.avaliadores.push({
					codigoDocente: row.codigoDocente,
					nome: row.nomeDocente,
				});
			}
		}

		return resultado;
	}
}
