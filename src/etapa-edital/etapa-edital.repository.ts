import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
	EtapaEdital,
} from '../database/entities/etapa-edital.entity';
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

	async criar(idEdital: number, dto: CreateEtapaEditalDto): Promise<EtapaEdital> {
		const etapa = this.repo.create({
			idEdital,
			tipo: dto.tipo,
			nome: dto.nome,
			ordem: dto.ordem,
			dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : null,
			dataFim: dto.dataFim ? new Date(dto.dataFim) : null,
		});
		return this.repo.save(etapa);
	}

	async atualizar(
		etapa: EtapaEdital,
		dto: UpdateEtapaEditalDto,
	): Promise<EtapaEdital> {
		if (dto.tipo !== undefined) etapa.tipo = dto.tipo;
		if (dto.nome !== undefined) etapa.nome = dto.nome;
		if (dto.ordem !== undefined) etapa.ordem = dto.ordem;
		if (dto.dataInicio !== undefined)
			etapa.dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : null;
		if (dto.dataFim !== undefined)
			etapa.dataFim = dto.dataFim ? new Date(dto.dataFim) : null;
		return this.repo.save(etapa);
	}

	async remover(id: number): Promise<void> {
		await this.repo.delete({ id });
	}
}
