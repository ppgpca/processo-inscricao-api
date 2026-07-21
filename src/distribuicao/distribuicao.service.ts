import { BadRequestException, Injectable } from '@nestjs/common';
import { distribuirAnteprojetos } from './algorithms/distribuir-anteprojeto.algorithm';
import { AtribuicaoItemDto } from './dto/atribuir-avaliadores.dto';
import { DistribuicaoRepository } from './distribuicao.repository';
import {
	AtribuicaoItem,
	CandidatoDistribuicao,
	DocenteDistribuicao,
	ETAPAS_DISTRIBUICAO,
	EtapaDistribuicaoSigla,
	ResultadoAtribuicao,
} from './distribuicao.types';

@Injectable()
export class DistribuicaoService {
	constructor(private readonly distribuicaoRepository: DistribuicaoRepository) {}

	async listarCandidatos(
		idEdital: number,
		siglaEtapa: string,
	): Promise<CandidatoDistribuicao[]> {
		const { idCriterioPai, idsSubCriterios } =
			await this.resolverCriterios(idEdital, siglaEtapa);
		return this.distribuicaoRepository.obterCandidatos(
			idEdital,
			idCriterioPai,
			idsSubCriterios,
		);
	}

	async listarDocentes(
		idEdital: number,
		siglaEtapa: string,
	): Promise<DocenteDistribuicao[]> {
		const { idCriterioPai } = await this.resolverCriterios(idEdital, siglaEtapa);
		return this.distribuicaoRepository.obterDocentes(idEdital, idCriterioPai);
	}

	async atribuir(
		idEdital: number,
		siglaEtapa: string,
		itens: AtribuicaoItemDto[],
	): Promise<ResultadoAtribuicao> {
		const { idCriterioPai, idsSubCriterios } =
			await this.resolverCriterios(idEdital, siglaEtapa);

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
		siglaEtapa: string,
	): Promise<{ idCriterioPai: number; idsSubCriterios: number[] }> {
		const sigla = this.validarEtapa(siglaEtapa);
		const criterioPai = await this.distribuicaoRepository.obterCriterioPaiPorEtapa(
			idEdital,
			sigla,
		);
		if (!criterioPai) {
			throw new BadRequestException(
				`Edital ${idEdital} não possui critério de avaliação cadastrado para a etapa ${sigla}.`,
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

	private validarEtapa(siglaEtapa: string): EtapaDistribuicaoSigla {
		if (
			!ETAPAS_DISTRIBUICAO.includes(siglaEtapa as EtapaDistribuicaoSigla)
		) {
			throw new BadRequestException(
				`Etapa inválida: ${siglaEtapa}. Valores aceitos: ${ETAPAS_DISTRIBUICAO.join(', ')}.`,
			);
		}
		return siglaEtapa as EtapaDistribuicaoSigla;
	}
}
