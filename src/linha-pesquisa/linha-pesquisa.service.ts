import { Injectable, NotFoundException } from '@nestjs/common';
import { LinhaPesquisa } from '../database/entities/linha-pesquisa.entity';
import { LinhaPesquisaRepository } from './linha-pesquisa.repository';

@Injectable()
export class LinhaPesquisaService {
	constructor(
		private readonly linhaPesquisaRepository: LinhaPesquisaRepository,
	) {}

	async obterAtivas(): Promise<LinhaPesquisa[]> {
		return this.linhaPesquisaRepository.obterAtivas();
	}

	async obterPorId(id: number): Promise<LinhaPesquisa> {
		const linha = await this.linhaPesquisaRepository.obterPorId(id);
		if (!linha) {
			throw new NotFoundException(
				`Linha de pesquisa ${id} não encontrada.`,
			);
		}
		return linha;
	}
}
