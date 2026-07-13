import {
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { PermissoesService } from '../auth/permissoes.service';
import { Permissoes } from '../common/enums/permissoes.enum';
import { DocenteRepository } from './docente.repository';

@Injectable()
export class DocenteService {
	constructor(
		private readonly docenteRepository: DocenteRepository,
		private readonly permissoesService: PermissoesService,
	) {}

	async obterEditaisComoAvaliador(codigoDocente: string) {
		return this.docenteRepository.obterEditaisComoAvaliador(codigoDocente);
	}

	async obterCriteriosPorEdital(idEdital: number) {
		return this.docenteRepository.obterCriteriosPorEdital(idEdital);
	}

	async salvarNotas(
		codigoDocenteLogado: string,
		notas: { idInscricao: number; idCriterioAvaliacao: number; nota: number }[],
		codigoDocenteAlvo?: string,
	): Promise<void> {
		const codigoDocente = await this.resolverCodigoDocenteParaSalvar(
			codigoDocenteLogado,
			codigoDocenteAlvo,
		);
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

	async obterNotasPorInscricaoECriterio(
		codigoDocenteLogado: string,
		idInscricao: number,
		idCriterio: number,
		codigoDocenteAlvo?: string,
	) {
		const codigoDocente = await this.resolverCodigoDocenteParaSalvar(
			codigoDocenteLogado,
			codigoDocenteAlvo,
		);
		const notas =
			await this.docenteRepository.obterNotasPorInscricaoECriterio(
				codigoDocente,
				idInscricao,
				idCriterio,
			);
		return notas.map((nc) => ({
			idCriterioAvaliacao: nc.idCriterioAvaliacao,
			nota: nc.nota !== null ? Number(nc.nota) : null,
			comentario: nc.comentario,
		}));
	}

	private async resolverCodigoDocenteParaSalvar(
		codigoDocenteLogado: string,
		codigoDocenteAlvo?: string,
	): Promise<string> {
		if (!codigoDocenteAlvo || codigoDocenteAlvo === codigoDocenteLogado) {
			return codigoDocenteLogado;
		}

		const grupos = await this.permissoesService.buscarGruposDoUsuario(
			codigoDocenteLogado,
		);
		const autorizado = grupos.some(
			(g) =>
				g.id === Permissoes.GRUPOS.ADMIN ||
				g.id === Permissoes.GRUPOS.COORDENADOR,
		);
		if (!autorizado) {
			throw new ForbiddenException(
				'Apenas admin ou coordenador pode alterar notas de outro avaliador.',
			);
		}
		return codigoDocenteAlvo;
	}
}
