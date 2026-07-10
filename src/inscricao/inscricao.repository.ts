import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InscricaoPalavraChave } from '../database/entities/inscricao-palavra-chave.entity';
import { Inscricao } from '../database/entities/inscricao.entity';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';

@Injectable()
export class InscricaoRepository {
	constructor(
		@InjectRepository(Inscricao)
		private readonly repo: Repository<Inscricao>,
		@InjectRepository(InscricaoPalavraChave)
		private readonly inscricaoPalavraChaveRepo: Repository<InscricaoPalavraChave>,
	) {}

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
			status: 'rascunho',
			idLinhaPesquisa: dados.idLinhaPesquisa ?? null,
			etapa: dados.etapa ?? 1,
			ativa: true,
			dadosComplementares: dados.dadosComplementares ?? null,
			deficiente: dados.deficiente ?? null,
			indigena: dados.indigena ?? null,
			pretoPardo: dados.pretoPardo ?? null,
			areaConcentracao: dados.areaConcentracao ?? null,
			projetoPesquisa: dados.projetoPesquisa ?? null,
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
			order: { createdAt: 'DESC' },
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
			nome: string;
			cpf: string;
			linhaPesquisa: string;
			siglaLinhaPesquisa: string;
			anteprojeto: string;
			palavrasChave: string[];
			dataInscricao: string;
		}[]
	> {
		const qb = this.repo
			.createQueryBuilder('i')
			.leftJoin('i.candidato', 'c')
			.leftJoin('i.linhaPesquisa', 'lp')
			.leftJoin('i.inscricoesPalavraChave', 'ipc')
			.leftJoin('ipc.palavraChave', 'pc')
			.select('i.cpf', 'cpf')
			.addSelect("COALESCE(c.nome, '')", 'nome')
			.addSelect("COALESCE(lp.nome, '')", 'linhaPesquisa')
			.addSelect("COALESCE(lp.sigla, '')", 'siglaLinhaPesquisa')
			.addSelect("COALESCE(i.projeto_pesquisa, '')", 'anteprojeto')
			.addSelect(
				"COALESCE(STRING_AGG(pc.palavra, ',' ORDER BY pc.palavra), '')",
				'palavrasChave',
			)
			.addSelect('MIN(i."createdAt")', 'dataInscricao')
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

		const rows = await qb.getRawMany<{
			nome: string;
			cpf: string;
			linhaPesquisa: string;
			siglaLinhaPesquisa: string;
			anteprojeto: string;
			palavrasChave: string;
			dataInscricao: string;
		}>();

		return rows.map((r) => ({
			...r,
			palavrasChave: r.palavrasChave ? r.palavrasChave.split(',') : [],
		}));
	}
}
