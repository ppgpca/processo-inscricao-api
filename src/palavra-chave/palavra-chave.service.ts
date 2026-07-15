import { Injectable } from '@nestjs/common';
import { PalavraChave } from '../database/entities/palavra-chave.entity';
import { PalavraChaveRepository } from './palavra-chave.repository';

@Injectable()
export class PalavraChaveService {
	constructor(
		private readonly palavraChaveRepository: PalavraChaveRepository,
	) {}

	async obterTodas(): Promise<PalavraChave[]> {
		return this.palavraChaveRepository.obterTodas();
	}
}
