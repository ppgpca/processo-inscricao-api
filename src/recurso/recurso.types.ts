export const NOMES_RECURSO = [
	'RECURSO_INSCRICAO',
	'RECURSO_ANTEPROJETO',
	'RECURSO_ENTREVISTA',
	'RECURSO_RESULTADO_PARCIAL',
] as const;

export type NomeRecurso = (typeof NOMES_RECURSO)[number];

export type StatusEtapaRecurso = 'passada' | 'ativa' | 'futura';

export interface RecursoResumo {
	id: number;
	texto: string;
	idEtapaEdital: number;
	idInscricao: number;
	deferido: boolean | null;
	comentario: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface EtapaRecursoConsulta {
	etapa: {
		id: number;
		nome: string;
		descricao: string;
		ordem: number;
		dataInicio: Date;
		dataFim: Date | null;
	};
	status: StatusEtapaRecurso;
	recurso: RecursoResumo | null;
}

export interface RecursoGestaoRow extends RecursoResumo {
	candidatoNome: string;
	candidatoCpf: string;
}
