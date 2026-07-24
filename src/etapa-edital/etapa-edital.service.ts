import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEtapaEditalDto } from './dto/create-etapa-edital.dto';
import { UpdateEtapaEditalDto } from './dto/update-etapa-edital.dto';
import { EtapaEditalRepository } from './etapa-edital.repository';

const NOMES: { nome: string; label: string }[] = [
	{ nome: 'INSCRICAO', label: 'Inscrições' },
	{ nome: 'RECURSO_INSCRICAO', label: 'Recurso da etapa de inscrições' },
	{ nome: 'HOMOLOGACAO', label: 'Homologação das inscrições' },
	{ nome: 'ANALISE_CURRICULO', label: 'Análise de currículo' },
	{ nome: 'ANTEPROJETO', label: 'Avaliação de anteprojeto' },
	{ nome: 'RECURSO_ANTEPROJETO', label: 'Recurso da etapa de anteprojetos' },
	{ nome: 'ENTREVISTA', label: 'Entrevistas' },
	{ nome: 'RECURSO_ENTREVISTA', label: 'Recurso da etapa de entrevista e prova de títulos' },
	{ nome: 'RESULTADO_PARCIAL', label: 'Resultado parcial' },
	{ nome: 'RECURSO_RESULTADO_PARCIAL', label: 'Recurso do resultado parcial' },
	{ nome: 'RESULTADO_FINAL', label: 'Resultado final' },
];

@Injectable()
export class EtapaEditalService {
	constructor(
		private readonly etapaEditalRepository: EtapaEditalRepository,
	) {}

	obterNomes(): { nome: string; label: string }[] {
		return NOMES;
	}

	async obterPorEdital(idEdital: number) {
		return this.etapaEditalRepository.obterPorEdital(idEdital);
	}

	async criar(idEdital: number, dto: CreateEtapaEditalDto) {
		return this.etapaEditalRepository.criar(idEdital, dto);
	}

	async atualizar(idEdital: number, id: number, dto: UpdateEtapaEditalDto) {
		const etapa = await this.etapaEditalRepository.obterPorId(id);
		if (!etapa || etapa.idEdital !== idEdital) {
			throw new NotFoundException(
				`Etapa ${id} não encontrada para o edital ${idEdital}.`,
			);
		}
		return this.etapaEditalRepository.atualizar(etapa, dto);
	}

	async remover(idEdital: number, id: number): Promise<void> {
		const etapa = await this.etapaEditalRepository.obterPorId(id);
		if (!etapa || etapa.idEdital !== idEdital) {
			throw new NotFoundException(
				`Etapa ${id} não encontrada para o edital ${idEdital}.`,
			);
		}
		await this.etapaEditalRepository.remover(id);
	}
}
