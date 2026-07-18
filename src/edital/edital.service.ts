import { Injectable, NotFoundException } from '@nestjs/common';
import { Edital } from '../database/entities/edital.entity';
import { EditalRepository } from './edital.repository';

@Injectable()
export class EditalService {
	constructor(private readonly editalRepository: EditalRepository) {}

	async obterTodos(): Promise<Edital[]> {
		return this.editalRepository.obterTodos();
	}

	/**
	 * Retorna null (HTTP 200 com corpo vazio) quando não há edital com
	 * inscrições abertas, evitando o log de erro 404 no console do navegador.
	 */
	async obterVigente(): Promise<Edital | null> {
		return this.editalRepository.obterVigente();
	}

	async obterProximo(): Promise<Edital | null> {
		return this.editalRepository.obterProximo();
	}

	async obterPorId(id: number): Promise<Edital> {
		const edital = await this.editalRepository.obterPorId(id);
		if (!edital) {
			throw new NotFoundException(`Edital ${id} não encontrado.`);
		}
		return edital;
	}

	async obterComDocumentos(id: number): Promise<Edital> {
		const edital = await this.editalRepository.obterComTiposDocumento(id);
		if (!edital) {
			throw new NotFoundException(`Edital ${id} não encontrado.`);
		}
		return edital;
	}
}
