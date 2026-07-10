import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PalavraChave } from '../database/entities/palavra-chave.entity';

@Injectable()
export class PalavraChaveRepository {
	constructor(
		@InjectRepository(PalavraChave)
		private readonly repo: Repository<PalavraChave>,
	) {}

	async obterTodas(): Promise<PalavraChave[]> {
		return this.repo.find({ order: { palavra: 'ASC' } });
	}
}
