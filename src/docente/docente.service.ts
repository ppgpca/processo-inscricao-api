import { Injectable } from '@nestjs/common';
import { DocenteRepository } from './docente.repository';

@Injectable()
export class DocenteService {
	constructor(private readonly docenteRepository: DocenteRepository) {}

	async obterEditaisComoAvaliador(codigoDocente: string) {
		return this.docenteRepository.obterEditaisComoAvaliador(codigoDocente);
	}

	async obterCriteriosPorEdital(idEdital: number) {
		return this.docenteRepository.obterCriteriosPorEdital(idEdital);
	}

	async salvarNotas(
		codigoDocente: string,
		notas: { idInscricao: number; idCriterioAvaliacao: number; nota: number }[],
	): Promise<void> {
		return this.docenteRepository.salvarNotas(codigoDocente, notas);
	}

	async obterSubCriteriosPorPai(idCriterioPai: number) {
		return this.docenteRepository.obterSubCriteriosPorPai(idCriterioPai);
	}

	async obterCandidatosParaAvaliar(
		codigoDocente: string,
		idCriterio: number,
	) {
		const notas = await this.docenteRepository.obterCandidatosParaAvaliar(
			codigoDocente,
			idCriterio,
		);

		return notas.map((nc) => ({
			idInscricao: nc.idInscricao,
			cpf: nc.inscricao?.cpf ?? '',
			anteprojeto: nc.inscricao?.projetoPesquisa ?? '',
			palavrasChave:
				nc.inscricao?.inscricoesPalavraChave?.map(
					(ipk) => ipk.palavraChave?.palavra ?? '',
				) ?? [],
			nota: nc.nota,
			comentario: nc.comentario,
		}));
	}
}
