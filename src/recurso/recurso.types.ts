export const NOMES_RECURSO = [
	'RECURSO_INSCRICAO',
	'RECURSO_ANTEPROJETO',
	'RECURSO_ENTREVISTA',
	'RECURSO_RESULTADO_PARCIAL',
] as const;

export type NomeRecurso = (typeof NOMES_RECURSO)[number];

export interface SlotDocumentoRecursoConfig {
	padraoNome: string;
	label: string;
}

/** Mapeia o nome da etapa de recurso para os slots de documento (1 ou mais). */
export const SLOTS_DOCUMENTO_RECURSO: Record<
	string,
	SlotDocumentoRecursoConfig[]
> = {
	RECURSO_INSCRICAO: [
		{ padraoNome: 'recurso_inscricao', label: 'Documento do recurso' },
	],
	RECURSO_ANTEPROJETO: [
		{ padraoNome: 'recurso_anteprojeto', label: 'Documento do recurso' },
	],
	RECURSO_ENTREVISTA: [
		{ padraoNome: 'recurso_entrevista', label: 'Recurso entrevista' },
		{ padraoNome: 'recurso_curriculo', label: 'Recurso currículo' },
	],
	RECURSO_RESULTADO_PARCIAL: [
		{
			padraoNome: 'recurso_resultado_parcial',
			label: 'Documento do recurso',
		},
	],
	'Recurso inscrição': [
		{ padraoNome: 'recurso_inscricao', label: 'Documento do recurso' },
	],
	'Recurso anteprojeto': [
		{ padraoNome: 'recurso_anteprojeto', label: 'Documento do recurso' },
	],
	'Recurso entrevista/prova de títulos': [
		{ padraoNome: 'recurso_entrevista', label: 'Recurso entrevista' },
		{ padraoNome: 'recurso_curriculo', label: 'Recurso currículo' },
	],
	'Recurso  resultado parcial': [
		{
			padraoNome: 'recurso_resultado_parcial',
			label: 'Documento do recurso',
		},
	],
	'Recurso resultado parcial': [
		{
			padraoNome: 'recurso_resultado_parcial',
			label: 'Documento do recurso',
		},
	],
};

export function obterSlotsDocumentoRecurso(
	nomeEtapa: string,
): SlotDocumentoRecursoConfig[] {
	return SLOTS_DOCUMENTO_RECURSO[nomeEtapa] ?? [];
}

export type StatusEtapaRecurso = 'passada' | 'ativa' | 'futura';

export interface DocumentoRecursoResumo {
	idTipoDocumentoEdital: number;
	padraoNome: string;
	label: string;
	versao: number;
	nomeArquivoOriginal: string;
	nomeArquivo: string | null;
	mimeType: string;
	tamanhoBytes: number;
	enviadoEm: Date;
}

export interface SlotDocumentoRecurso {
	padraoNome: string;
	label: string;
	idTipoDocumentoEdital: number;
	documento: DocumentoRecursoResumo | null;
}

export interface RecursoResumo {
	id: number;
	texto: string;
	idEtapaEdital: number;
	idInscricao: number;
	deferido: boolean | null;
	comentario: string | null;
	createdAt: Date;
	updatedAt: Date;
	documentos: DocumentoRecursoResumo[];
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
	slotsDocumento: SlotDocumentoRecurso[];
}

export interface RecursoGestaoRow extends RecursoResumo {
	candidatoNome: string;
	candidatoCpf: string;
}
