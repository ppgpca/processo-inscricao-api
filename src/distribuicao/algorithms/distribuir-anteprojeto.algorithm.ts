export interface DocenteParaDistribuir {
	codigo: string;
	idsPalavraChave: Set<number>;
	idsLinhaPesquisa: Set<number>;
	cargaAtual: number;
}

export interface InscricaoParaDistribuir {
	idInscricao: number;
	idLinhaPesquisa: number;
	idsPalavraChave: Set<number>;
	codigosJaAtribuidos: string[];
}

export interface ResultadoDistribuicaoItem {
	idInscricao: number;
	codigosDocentesFinal: string[];
	novos: string[];
	completo: boolean;
}

const QUANTIDADE_AVALIADORES = 2;
const CAPACIDADE_INICIAL = 2;

export function distribuirAnteprojetos(
	inscricoes: InscricaoParaDistribuir[],
	docentes: DocenteParaDistribuir[],
	random: () => number = Math.random,
): ResultadoDistribuicaoItem[] {
	const cargaPorDocente = new Map(
		docentes.map((d) => [d.codigo, d.cargaAtual]),
	);
	const porCodigo = new Map(docentes.map((d) => [d.codigo, d]));

	const ordenadas = [...inscricoes].sort(
		(a, b) => a.idInscricao - b.idInscricao,
	);

	return ordenadas.map((inscricao) => {
		const jaSelecionados = new Set(inscricao.codigosJaAtribuidos);
		const novos: string[] = [];
		const faltam = QUANTIDADE_AVALIADORES - jaSelecionados.size;

		for (let i = 0; i < faltam; i++) {
			const escolhido = selecionarDocente(
				inscricao,
				porCodigo,
				cargaPorDocente,
				jaSelecionados,
				random,
			);
			if (!escolhido) break;
			jaSelecionados.add(escolhido);
			novos.push(escolhido);
			cargaPorDocente.set(escolhido, (cargaPorDocente.get(escolhido) ?? 0) + 1);
		}

		return {
			idInscricao: inscricao.idInscricao,
			codigosDocentesFinal: [...jaSelecionados],
			novos,
			completo: jaSelecionados.size === QUANTIDADE_AVALIADORES,
		};
	});
}

function selecionarDocente(
	inscricao: InscricaoParaDistribuir,
	porCodigo: Map<string, DocenteParaDistribuir>,
	cargaPorDocente: Map<string, number>,
	jaSelecionados: Set<string>,
	random: () => number,
): string | null {
	const poolDisponivel = [...porCodigo.values()].filter(
		(d) => !jaSelecionados.has(d.codigo),
	);
	if (poolDisponivel.length === 0) return null;

	const maiorCarga = Math.max(
		...poolDisponivel.map((d) => cargaPorDocente.get(d.codigo) ?? 0),
	);
	const capMaximo = Math.max(CAPACIDADE_INICIAL, maiorCarga + 1);

	for (let cap = CAPACIDADE_INICIAL; cap <= capMaximo; cap++) {
		const elegiveis = poolDisponivel.filter(
			(d) => (cargaPorDocente.get(d.codigo) ?? 0) < cap,
		);
		if (elegiveis.length === 0) continue;

		// 1.1 + 1.2 — palavra-chave em comum, com carga < cap
		const porKeyword = elegiveis.filter((d) =>
			[...d.idsPalavraChave].some((id) => inscricao.idsPalavraChave.has(id)),
		);
		if (porKeyword.length > 0) return sortear(porKeyword, random);

		// 1.3 — mesma linha de pesquisa, com carga < cap
		const porLinha = elegiveis.filter((d) =>
			d.idsLinhaPesquisa.has(inscricao.idLinhaPesquisa),
		);
		if (porLinha.length > 0) return sortear(porLinha, random);

		// 1.4 — outra linha de pesquisa, com carga < cap
		return sortear(elegiveis, random);
	}

	return null;
}

function sortear(lista: DocenteParaDistribuir[], random: () => number): string {
	const indice = Math.min(lista.length - 1, Math.floor(random() * lista.length));
	return lista[indice].codigo;
}
