import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscricao } from '../database/entities/inscricao.entity';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';

@Injectable()
export class InscricaoRepository {
	constructor(
		@InjectRepository(Inscricao)
		private readonly repo: Repository<Inscricao>,
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
		return this.repo.save(inscricao);
	}

	async atualizar(
		inscricao: Inscricao,
		dados: UpdateInscricaoDto,
	): Promise<Inscricao> {
		Object.assign(inscricao, dados);
		return this.repo.save(inscricao);
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
			cpf: string;
			linhaPesquisa: string;
			anteprojeto: string;
		}[]
	> {
		const qb = this.repo
			.createQueryBuilder('i')
			.leftJoin('i.linhaPesquisa', 'lp')
			.select('i.cpf', 'cpf')
			.addSelect("COALESCE(lp.nome, '')", 'linhaPesquisa')
			.addSelect("COALESCE(i.projeto_pesquisa, '')", 'anteprojeto')
			.where('i.ativa = true')
			.orderBy('lp.nome', 'ASC', 'NULLS LAST');

		if (idEdital) {
			qb.andWhere('i.id_edital = :idEdital', { idEdital });
		}

		return qb.getRawMany<{
			cpf: string;
			linhaPesquisa: string;
			anteprojeto: string;
		}>();
	}
}
