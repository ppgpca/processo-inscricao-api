import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EtapaEdital } from '../database/entities/etapa-edital.entity';
import { CreateEtapaEditalDto } from './dto/create-etapa-edital.dto';
import { UpdateEtapaEditalDto } from './dto/update-etapa-edital.dto';

@Injectable()
export class EtapaEditalRepository {
	constructor(
		@InjectRepository(EtapaEdital)
		private readonly repo: Repository<EtapaEdital>,
	) {}

	async obterPorEdital(idEdital: number): Promise<EtapaEdital[]> {
		return this.repo.find({
			where: { idEdital },
			order: { ordem: 'ASC' },
		});
	}

	async obterPorId(id: number): Promise<EtapaEdital | null> {
		return this.repo.findOne({ where: { id } });
	}

	async criar(
		idEdital: number,
		dto: CreateEtapaEditalDto,
	): Promise<EtapaEdital> {
		const etapa = this.repo.create({
			idEdital,
			nome: dto.nome,
			descricao: dto.descricao,
			ordem: dto.ordem,
			dataInicio: new Date(dto.dataInicio),
			dataFim: dto.dataFim ? new Date(dto.dataFim) : null,
			recurso: dto.recurso ?? false,
		});
		return this.repo.save(etapa);
	}

	async atualizar(
		etapa: EtapaEdital,
		dto: UpdateEtapaEditalDto,
	): Promise<EtapaEdital> {
		if (dto.nome !== undefined) etapa.nome = dto.nome;
		if (dto.descricao !== undefined) etapa.descricao = dto.descricao;
		if (dto.ordem !== undefined) etapa.ordem = dto.ordem;
		if (dto.dataInicio !== undefined)
			etapa.dataInicio = new Date(dto.dataInicio);
		if (dto.dataFim !== undefined)
			etapa.dataFim = dto.dataFim ? new Date(dto.dataFim) : null;
		if (dto.recurso !== undefined) etapa.recurso = dto.recurso;
		return this.repo.save(etapa);
	}

	async remover(id: number): Promise<void> {
		await this.repo.delete({ id });
	}
}
