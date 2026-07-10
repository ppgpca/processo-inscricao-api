import { Injectable } from '@nestjs/common';
import { Grupo } from '../database/entities/grupo.entity';
import { Permissao } from '../database/entities/permissao.entity';
import { PermissoesRepository } from './permissoes.repository';

export interface PermissaoConsolidada {
	id: number;
	codigo: string;
	descricao: string | null;
	grupos: Array<{ id: number; nome: string }>;
}

@Injectable()
export class PermissoesService {
	constructor(private readonly permissoesRepository: PermissoesRepository) {}

	async buscarPermissoesDoUsuario(
		userId: string,
	): Promise<PermissaoConsolidada[]> {
		const usuario =
			await this.permissoesRepository.buscarUsuarioComGruposEPermissoes(
				userId,
			);

		if (!usuario) {
			throw new Error('Usuário não encontrado');
		}

		const consolidadas = new Map<number, PermissaoConsolidada>();

		for (const ug of usuario.usuarioGrupos ?? []) {
			const grupo = ug.grupo;
			for (const gp of grupo?.grupoPermissoes ?? []) {
				const permissao = gp.permissao as Permissao;
				if (!consolidadas.has(permissao.id)) {
					consolidadas.set(permissao.id, {
						id: permissao.id,
						codigo: permissao.codigo,
						descricao: permissao.descricao,
						grupos: [],
					});
				}
				const entry = consolidadas.get(permissao.id)!;
				if (!entry.grupos.find((g) => g.id === grupo.id)) {
					entry.grupos.push({ id: grupo.id, nome: grupo.nome });
				}
			}
		}

		return Array.from(consolidadas.values());
	}

	async verificarConsultaTodos(userId: string): Promise<boolean> {
		const usuario =
			await this.permissoesRepository.buscarUsuarioComGrupos(userId);
		return (usuario?.usuarioGrupos?.length ?? 0) > 0;
	}

	async buscarGruposDoUsuario(userId: string): Promise<Grupo[]> {
		const usuario =
			await this.permissoesRepository.buscarUsuarioComGrupos(userId);

		if (!usuario) {
			throw new Error('Usuário não encontrado');
		}

		return (usuario.usuarioGrupos ?? []).map((ug) => ug.grupo);
	}

	async buscarTodasPermissoes(): Promise<Permissao[]> {
		return this.permissoesRepository.buscarTodasPermissoes();
	}

	async buscarTodosGrupos(): Promise<Grupo[]> {
		return this.permissoesRepository.buscarTodosGrupos();
	}
}
