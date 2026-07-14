import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Inscricao } from '../database/entities/inscricao.entity';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { InscricaoRepository } from './inscricao.repository';

@Injectable()
export class InscricaoService {
	constructor(private readonly inscricaoRepository: InscricaoRepository) {}

	async obterPorCpfEdital(
		cpf: string,
		idEdital: number,
	): Promise<Inscricao | null> {
		return this.inscricaoRepository.obterPorCpfEdital(cpf, idEdital);
	}

	async obterMaisRecentePorCpf(cpf: string): Promise<Inscricao | null> {
		return this.inscricaoRepository.obterMaisRecentePorCpf(cpf);
	}

	async obterPorId(id: number): Promise<Inscricao> {
		const inscricao = await this.inscricaoRepository.obterPorId(id);
		if (!inscricao) {
			throw new NotFoundException(`Inscrição ${id} não encontrada.`);
		}
		return inscricao;
	}

	async criar(dto: CreateInscricaoDto): Promise<Inscricao> {
		const duplicata = await this.inscricaoRepository.obterDuplicata(
			dto.cpf,
			dto.idEdital,
		);
		if (duplicata) {
			throw new ConflictException(
				`Já existe uma inscrição ativa para o CPF ${dto.cpf} neste edital.`,
			);
		}
		return this.inscricaoRepository.criar(dto);
	}

	async atualizar(id: number, dto: UpdateInscricaoDto): Promise<Inscricao> {
		const inscricao = await this.inscricaoRepository.obterPorId(id);
		if (!inscricao) {
			throw new NotFoundException(`Inscrição ${id} não encontrada.`);
		}

		// Ao finalizar a inscrição (etapa 5), mover para a etapa de ordem 2 (homologação)
		if (dto.etapa === 5 && dto.idEtapaAtual === undefined) {
			const etapaHomologacao =
				await this.inscricaoRepository.obterEtapaPorOrdem(
					inscricao.idEdital,
					2,
				);
			if (etapaHomologacao) {
				dto = { ...dto, idEtapaAtual: etapaHomologacao.id };
			}
		}

		return this.inscricaoRepository.atualizar(inscricao, dto);
	}

	async desativar(id: number): Promise<void> {
		await this.inscricaoRepository.desativar(id);
	}

	async obterDadosDashboard(idEdital?: number) {
		const [inscricoesPorDia, inscritosPorLinhaPesquisa, inscritos] =
			await Promise.all([
				this.inscricaoRepository.obterInscricoesPorDia(idEdital),
				this.inscricaoRepository.obterInscritosPorLinhaPesquisa(idEdital),
				this.inscricaoRepository.obterListaInscritos(idEdital),
			]);

		return { inscricoesPorDia, inscritosPorLinhaPesquisa, inscritos };
	}
}
