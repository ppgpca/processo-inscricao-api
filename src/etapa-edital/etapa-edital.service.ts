import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoEtapa } from '../database/entities/etapa-edital.entity';
import { CreateEtapaEditalDto } from './dto/create-etapa-edital.dto';
import { UpdateEtapaEditalDto } from './dto/update-etapa-edital.dto';
import { EtapaEditalRepository } from './etapa-edital.repository';

@Injectable()
export class EtapaEditalService {
	constructor(
		private readonly etapaEditalRepository: EtapaEditalRepository,
	) {}

	obterTipos(): { tipo: TipoEtapa; label: string }[] {
		const labels: Record<TipoEtapa, string> = {
			[TipoEtapa.INSCRICAO]: 'Inscrições',
			[TipoEtapa.HOMOLOGACAO]: 'Homologação das inscrições',
			[TipoEtapa.ANALISE_CURRICULO]: 'Análise de currículo',
			[TipoEtapa.ANTEPROJETO]: 'Entrega de anteprojeto',
			[TipoEtapa.ENTREVISTA]: 'Entrevista',
			[TipoEtapa.RESULTADO_PARCIAL]: 'Resultado parcial',
			[TipoEtapa.RECURSO]: 'Período de recursos',
			[TipoEtapa.RESULTADO_FINAL]: 'Resultado final',
		};
		return Object.values(TipoEtapa).map((tipo) => ({
			tipo,
			label: labels[tipo],
		}));
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
