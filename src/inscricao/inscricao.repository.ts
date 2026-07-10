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
}
