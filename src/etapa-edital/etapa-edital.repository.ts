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
			sigla: dto.sigla,
			nome: dto.nome,
			ordem: dto.ordem,
			dataInicio: new Date(dto.dataInicio),
			dataFim: dto.dataFim ? new Date(dto.dataFim) : null,
		});
		return this.repo.save(etapa);
	}

	async atualizar(
		etapa: EtapaEdital,
		dto: UpdateEtapaEditalDto,
	): Promise<EtapaEdital> {
		if (dto.sigla !== undefined) etapa.sigla = dto.sigla;
		if (dto.nome !== undefined) etapa.nome = dto.nome;
		if (dto.ordem !== undefined) etapa.ordem = dto.ordem;
		if (dto.dataInicio !== undefined)
			etapa.dataInicio = new Date(dto.dataInicio);
		if (dto.dataFim !== undefined)
			etapa.dataFim = dto.dataFim ? new Date(dto.dataFim) : null;
		return this.repo.save(etapa);
	}

	async remover(id: number): Promise<void> {
		await this.repo.delete({ id });
	}
}
