import { BadRequestException, Injectable } from '@nestjs/common';
import { distribuirAnteprojetos } from './algorithms/distribuir-anteprojeto.algorithm';
import { AtribuicaoItemDto } from './dto/atribuir-avaliadores.dto';
import { DistribuicaoRepository } from './distribuicao.repository';
import {
	AtribuicaoItem,
	CandidatoDistribuicao,
	DocenteDistribuicao,
	ETAPAS_DISTRIBUICAO,
	EtapaDistribuicaoNome,
	ResultadoAtribuicao,
} from './distribuicao.types';

@Injectable()
export class DistribuicaoService {
	constructor(private readonly distribuicaoRepository: DistribuicaoRepository) {}

	async listarCandidatos(
		idEdital: number,
		nomeEtapa: string,
	): Promise<CandidatoDistribuicao[]> {
		const { idCriterioPai, idsSubCriterios } =
			await this.resolverCriterios(idEdital, nomeEtapa);
		return this.distribuicaoRepository.obterCandidatos(
			idEdital,
			idCriterioPai,
			idsSubCriterios,
		);
	}

	async listarDocentes(
		idEdital: number,
		nomeEtapa: string,
	): Promise<DocenteDistribuicao[]> {
		const { idCriterioPai } = await this.resolverCriterios(idEdital, nomeEtapa);
		return this.distribuicaoRepository.obterDocentes(idEdital, idCriterioPai);
	}

	async atribuir(
		idEdital: number,
		nomeEtapa: string,
		itens: AtribuicaoItemDto[],
	): Promise<ResultadoAtribuicao> {
		const { idCriterioPai, idsSubCriterios } =
			await this.resolverCriterios(idEdital, nomeEtapa);

		const resultado: ResultadoAtribuicao = { sucesso: [], falhas: [] };
		for (const item of itens) {
			const resposta = await this.distribuicaoRepository.substituirAtribuicoes(
				item.idInscricao,
				idCriterioPai,
				idsSubCriterios,
				item.codigosDocentes,
				item.dataBanca,
			);
			if (resposta.ok) {
				resultado.sucesso.push({ idInscricao: item.idInscricao });
			} else {
				resultado.falhas.push({
					idInscricao: item.idInscricao,
					motivo: resposta.motivo,
				});
			}
		}
		return resultado;
	}

	/**
	 * Calcula a distribuição automática sem gravar.
	 * O cliente deve enviar o resultado via `atribuir` ao sincronizar.
	 */
	async proporDistribuicaoAnteprojeto(
		idEdital: number,
	): Promise<AtribuicaoItem[]> {
		const { idCriterioPai, idsSubCriterios } = await this.resolverCriterios(
			idEdital,
			'ANTEPROJETO',
		);

		const [inscricoes, docentes] = await Promise.all([
			this.distribuicaoRepository.obterInscricoesParaAlgoritmo(
				idEdital,
				idCriterioPai,
				idsSubCriterios,
			),
			this.distribuicaoRepository.obterDocentesParaAlgoritmo(
				idEdital,
				idCriterioPai,
			),
		]);

		return distribuirAnteprojetos(inscricoes, docentes)
			.filter((item) => item.novos.length > 0)
			.map((item) => ({
				idInscricao: item.idInscricao,
				codigosDocentes: item.codigosDocentesFinal,
			}));
	}

	private async resolverCriterios(
		idEdital: number,
		nomeEtapa: string,
	): Promise<{ idCriterioPai: number; idsSubCriterios: number[] }> {
		const nome = this.validarEtapa(nomeEtapa);
		const criterioPai = await this.distribuicaoRepository.obterCriterioPaiPorEtapa(
			idEdital,
			nome,
		);
		if (!criterioPai) {
			throw new BadRequestException(
				`Edital ${idEdital} não possui critério de avaliação cadastrado para a etapa ${nome}.`,
			);
		}
		const subCriterios = await this.distribuicaoRepository.obterSubCriterios(
			criterioPai.id,
		);
		return {
			idCriterioPai: criterioPai.id,
			idsSubCriterios: subCriterios.map((c) => c.id),
		};
	}

	private validarEtapa(nomeEtapa: string): EtapaDistribuicaoNome {
		if (
			!ETAPAS_DISTRIBUICAO.includes(nomeEtapa as EtapaDistribuicaoNome)
		) {
			throw new BadRequestException(
				`Etapa inválida: ${nomeEtapa}. Valores aceitos: ${ETAPAS_DISTRIBUICAO.join(', ')}.`,
			);
		}
		return nomeEtapa as EtapaDistribuicaoNome;
	}
}
