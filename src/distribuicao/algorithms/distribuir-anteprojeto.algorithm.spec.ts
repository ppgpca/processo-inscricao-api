import {
	DocenteParaDistribuir,
	InscricaoParaDistribuir,
	distribuirAnteprojetos,
} from './distribuir-anteprojeto.algorithm';

function docente(
	codigo: string,
	opts: Partial<Omit<DocenteParaDistribuir, 'codigo'>> = {},
): DocenteParaDistribuir {
	return {
		codigo,
		idsPalavraChave: opts.idsPalavraChave ?? new Set(),
		idsLinhaPesquisa: opts.idsLinhaPesquisa ?? new Set(),
		cargaAtual: opts.cargaAtual ?? 0,
	};
}

function inscricao(
	idInscricao: number,
	opts: Partial<Omit<InscricaoParaDistribuir, 'idInscricao'>> = {},
): InscricaoParaDistribuir {
	return {
		idInscricao,
		idLinhaPesquisa: opts.idLinhaPesquisa ?? 1,
		idsPalavraChave: opts.idsPalavraChave ?? new Set(),
		codigosJaAtribuidos: opts.codigosJaAtribuidos ?? [],
	};
}

const semAleatoriedade = () => 0;

describe('distribuirAnteprojetos', () => {
	it('prefere docente com palavra-chave em comum e carga < 2 (regra 1.1)', () => {
		const docentes = [
			docente('D1', { idsPalavraChave: new Set([10]) }),
			docente('D2', { idsLinhaPesquisa: new Set([1]) }),
		];
		const inscricoes = [inscricao(1, { idsPalavraChave: new Set([10]) })];

		const [resultado] = distribuirAnteprojetos(
			inscricoes,
			docentes,
			semAleatoriedade,
		);

		expect(resultado.codigosDocentesFinal).toContain('D1');
	});

	it('ignora docente com match de palavra-chave mas já com 2 projetos (regra 1.2)', () => {
		const docentes = [
			docente('D1', { idsPalavraChave: new Set([10]), cargaAtual: 2 }),
			docente('D2', { idsLinhaPesquisa: new Set([1]) }),
			docente('D3', { idsLinhaPesquisa: new Set([1]) }),
		];
		const inscricoes = [
			inscricao(1, { idsPalavraChave: new Set([10]), idLinhaPesquisa: 1 }),
		];

		const [resultado] = distribuirAnteprojetos(
			inscricoes,
			docentes,
			semAleatoriedade,
		);

		expect(resultado.codigosDocentesFinal).not.toContain('D1');
	});

	it('cai para mesma linha de pesquisa quando não há match de palavra-chave disponível (regra 1.3)', () => {
		const docentes = [
			docente('D1', { idsLinhaPesquisa: new Set([1]) }),
			docente('D2', { idsLinhaPesquisa: new Set([2]) }),
		];
		const inscricoes = [inscricao(1, { idLinhaPesquisa: 1 })];

		const [resultado] = distribuirAnteprojetos(
			inscricoes,
			docentes,
			semAleatoriedade,
		);

		expect(resultado.codigosDocentesFinal).toEqual(
			expect.arrayContaining(['D1']),
		);
	});

	it('cai para outra linha de pesquisa quando não há keyword nem linha igual (regra 1.4)', () => {
		const docentes = [docente('D1', { idsLinhaPesquisa: new Set([2]) })];
		const inscricoes = [inscricao(1, { idLinhaPesquisa: 1 })];

		const resultado = distribuirAnteprojetos(
			inscricoes,
			docentes,
			semAleatoriedade,
		);

		expect(resultado[0].codigosDocentesFinal).toContain('D1');
	});

	it('incrementa o cap quando ninguém satisfaz a capacidade inicial, até distribuir tudo (regra 1.5)', () => {
		const docentes = [
			docente('D1', { idsLinhaPesquisa: new Set([1]) }),
			docente('D2', { idsLinhaPesquisa: new Set([1]) }),
		];
		const inscricoes = Array.from({ length: 5 }, (_, i) =>
			inscricao(i + 1, { idLinhaPesquisa: 1 }),
		);

		const resultado = distribuirAnteprojetos(
			inscricoes,
			docentes,
			semAleatoriedade,
		);

		expect(resultado.every((r) => r.completo)).toBe(true);
		const cargaFinalD1 = resultado.filter((r) =>
			r.codigosDocentesFinal.includes('D1'),
		).length;
		const cargaFinalD2 = resultado.filter((r) =>
			r.codigosDocentesFinal.includes('D2'),
		).length;
		expect(cargaFinalD1 + cargaFinalD2).toBe(10);
	});

	it('usa o RNG injetado de forma determinística', () => {
		const docentes = [
			docente('D1', { idsLinhaPesquisa: new Set([1]) }),
			docente('D2', { idsLinhaPesquisa: new Set([1]) }),
		];
		const inscricoes = [inscricao(1, { idLinhaPesquisa: 1 })];

		const resultado = distribuirAnteprojetos(inscricoes, docentes, () => 0);

		expect(resultado[0].codigosDocentesFinal[0]).toBe('D1');
	});

	it('não lança exceção quando o pool de docentes é insuficiente', () => {
		const docentes = [docente('D1')];
		const inscricoes = [inscricao(1)];

		const resultado = distribuirAnteprojetos(
			inscricoes,
			docentes,
			semAleatoriedade,
		);

		expect(resultado[0].codigosDocentesFinal).toEqual(['D1']);
		expect(resultado[0].completo).toBe(false);
	});

	it('completa apenas a vaga faltante quando já há 1 docente pré-atribuído', () => {
		const docentes = [
			docente('D1', { idsLinhaPesquisa: new Set([1]) }),
			docente('D2', { idsLinhaPesquisa: new Set([1]) }),
		];
		const inscricoes = [
			inscricao(1, { idLinhaPesquisa: 1, codigosJaAtribuidos: ['D1'] }),
		];

		const [resultado] = distribuirAnteprojetos(
			inscricoes,
			docentes,
			semAleatoriedade,
		);

		expect(resultado.codigosDocentesFinal).toEqual(
			expect.arrayContaining(['D1', 'D2']),
		);
		expect(resultado.novos).toEqual(['D2']);
		expect(resultado.completo).toBe(true);
	});
});
