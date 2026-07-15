import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEtapaEditalDto } from './dto/create-etapa-edital.dto';
import { UpdateEtapaEditalDto } from './dto/update-etapa-edital.dto';
import { EtapaEditalRepository } from './etapa-edital.repository';

const SIGLAS: { sigla: string; label: string }[] = [
	{ sigla: 'INSCRICAO', label: 'Inscrições' },
	{ sigla: 'HOMOLOGACAO', label: 'Homologação das inscrições' },
	{ sigla: 'ANALISE_CURRICULO', label: 'Análise de currículo' },
	{ sigla: 'ANTEPROJETO', label: 'Entrega de anteprojeto' },
	{ sigla: 'ENTREVISTA', label: 'Entrevista' },
	{ sigla: 'RESULTADO_PARCIAL', label: 'Resultado parcial' },
	{ sigla: 'RECURSO', label: 'Período de recursos' },
	{ sigla: 'RESULTADO_FINAL', label: 'Resultado final' },
];

@Injectable()
export class EtapaEditalService {
	constructor(
		private readonly etapaEditalRepository: EtapaEditalRepository,
	) {}

	obterSiglas(): { sigla: string; label: string }[] {
		return SIGLAS;
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
