export const ETAPAS_DISTRIBUICAO = [
	'ANTEPROJETO',
	'ENTREVISTA',
	'ANALISE_CURRICULO',
] as const;

export type EtapaDistribuicaoNome = (typeof ETAPAS_DISTRIBUICAO)[number];

/** Nome do critério pai em `criterio_avaliacao` para cada etapa de distribuição. */
export const NOME_CRITERIO_POR_ETAPA: Record<EtapaDistribuicaoNome, string> = {
	ANTEPROJETO: 'Anteprojeto',
	ENTREVISTA: 'Entrevista',
	ANALISE_CURRICULO: 'Currículo',
};

export interface DocenteAtribuido {
	codigoDocente: string;
	nome: string;
	temNotaLancada: boolean;
}

export interface CandidatoDistribuicao {
	idInscricao: number;
	cpf: string;
	nome: string;
	idLinhaPesquisa: number;
	linhaPesquisa: string;
	projetoPesquisa: string;
	palavrasChave: string[];
	docentesAtribuidos: DocenteAtribuido[];
	/** Início do slot da banca, quando houver. */
	dataBanca: string | null;
}

export interface DocenteDistribuicao {
	codigo: string;
	nome: string;
	palavrasChave: string[];
	linhasPesquisa: { id: number; nome: string }[];
	cargaAtual: number;
}

export interface AtribuicaoItem {
	idInscricao: number;
	codigosDocentes: string[];
	dataBanca?: string | null;
}

export interface ResultadoAtribuicao {
	sucesso: { idInscricao: number }[];
	falhas: { idInscricao: number; motivo: string }[];
}
