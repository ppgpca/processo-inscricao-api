import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { distribuirAnteprojetos } from './algorithms/distribuir-anteprojeto.algorithm';
import { AtribuicaoItemDto } from './dto/atribuir-avaliadores.dto';
import { DistribuicaoRepository } from './distribuicao.repository';
import {
	AtribuicaoItem,
	CandidatoDistribuicao,
	DocenteDistribuicao,
	ETAPAS_DISTRIBUICAO,
	EtapaDistribuicaoNome,
	ResultadoAtribuicao,
} from './distribuicao.types';

@Injectable()
export class DistribuicaoService {
	constructor(
		private readonly distribuicaoRepository: DistribuicaoRepository,
	) {}

	async listarCandidatos(
		idEdital: number,
		nomeEtapa: string,
	): Promise<CandidatoDistribuicao[]> {
		const { idCriterioPai, idsSubCriterios } = await this.resolverCriterios(
			idEdital,
			nomeEtapa,
		);
		return this.distribuicaoRepository.obterCandidatos(
			idEdital,
			idCriterioPai,
			idsSubCriterios,
		);
	}

	async listarDocentes(
		idEdital: number,
		nomeEtapa: string,
	): Promise<DocenteDistribuicao[]> {
		const { idCriterioPai } = await this.resolverCriterios(
			idEdital,
			nomeEtapa,
		);
		return this.distribuicaoRepository.obterDocentes(
			idEdital,
			idCriterioPai,
		);
	}

	async atribuir(
		idEdital: number,
		nomeEtapa: string,
		itens: AtribuicaoItemDto[],
	): Promise<ResultadoAtribuicao> {
		const { idCriterioPai, idsSubCriterios } = await this.resolverCriterios(
			idEdital,
			nomeEtapa,
		);

		const resultado: ResultadoAtribuicao = { sucesso: [], falhas: [] };
		for (const item of itens) {
			const resposta =
				await this.distribuicaoRepository.substituirAtribuicoes(
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

	async obterNotasAnteprojetoDocente(
		idEdital: number,
		idInscricao: number,
		codigoDocente: string,
	) {
		return this.distribuicaoRepository.obterNotasAnteprojetoDocente(
			idEdital,
			idInscricao,
			codigoDocente,
		);
	}

	async gerarRelatorioAnteprojetoXlsx(idEdital: number): Promise<Buffer> {
		const rows =
			await this.distribuicaoRepository.obterRelatorioAnteprojeto(
				idEdital,
			);

		const mascararCpf = (cpf: string): string => {
			const digits = cpf.replace(/\D/g, '');
			if (digits.length !== 11) return cpf;
			return `***.${digits.slice(3, 6)}.${digits.slice(6, 8)}*-**`;
		};

		const concorrencia = (row: Record<string, unknown>): string => {
			const tipos: string[] = [];
			if (row['deficiente']) tipos.push('PcD');
			if (row['indigena']) tipos.push('Indígena');
			if (row['preto_pardo']) tipos.push('Preta ou parda');
			return tipos.length > 0 ? tipos.join(', ') : 'Ampla concorrência';
		};

		const toNum = (v: unknown): number | null => {
			if (v === null || v === undefined) return null;
			const n = Number(v);
			return Number.isNaN(n) ? null : n;
		};

		const colapsarEspacos = (v: unknown): string => {
			if (v === null || v === undefined) return '';
			if (
				typeof v !== 'string' &&
				typeof v !== 'number' &&
				typeof v !== 'boolean'
			)
				return '';
			return `${v}`.replace(/\s+/g, ' ').trim();
		};

		const media = (...vals: (number | null)[]): number | null => {
			const nums = vals.filter((v): v is number => v !== null);
			if (nums.length === 0) return null;
			return (
				Math.round(
					(nums.reduce((a, b) => a + b, 0) / nums.length) * 100,
				) / 100
			);
		};

		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet('Anteprojeto');

		sheet.columns = [
			{ header: 'ID Inscrição', key: 'id', width: 14 },
			{ header: 'CPF', key: 'cpf', width: 16 },
			{ header: 'Concorrência', key: 'concorrencia', width: 24 },
			{ header: 'Título do Projeto', key: 'projeto_pesquisa', width: 40 },
			{ header: 'Linha de Pesquisa', key: 'linha_pesquisa', width: 30 },
			{ header: 'Palavras-chave', key: 'palavras', width: 36 },
			{ header: 'Avaliador 1', key: 'av1_nome', width: 30 },
			{
				header: 'Av1 Sistematização',
				key: 'av1_sistematizacao',
				width: 20,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av1 Síntese',
				key: 'av1_sintese',
				width: 14,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av1 Capacidade',
				key: 'av1_capacidade',
				width: 16,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av1 Linguagem',
				key: 'av1_linguagem',
				width: 16,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av1 Nota',
				key: 'av1_nota',
				width: 12,
				style: { numFmt: '0.00' },
			},
			{ header: 'Av1 Comentário', key: 'av1_comentario', width: 40 },
			{ header: 'Avaliador 2', key: 'av2_nome', width: 30 },
			{
				header: 'Av2 Sistematização',
				key: 'av2_sistematizacao',
				width: 20,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av2 Síntese',
				key: 'av2_sintese',
				width: 14,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av2 Capacidade',
				key: 'av2_capacidade',
				width: 16,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av2 Linguagem',
				key: 'av2_linguagem',
				width: 16,
				style: { numFmt: '0.00' },
			},
			{
				header: 'Av2 Nota',
				key: 'av2_nota',
				width: 12,
				style: { numFmt: '0.00' },
			},
			{ header: 'Av2 Comentário', key: 'av2_comentario', width: 40 },
			{
				header: 'Média',
				key: 'media',
				width: 12,
				style: { numFmt: '0.00' },
			},
		];

		// Cabeçalho em negrito e autoFilter
		const headerRow = sheet.getRow(1);
		headerRow.font = { bold: true };
		headerRow.alignment = { vertical: 'middle' };
		sheet.autoFilter = {
			from: { row: 1, column: 1 },
			to: { row: 1, column: sheet.columns.length },
		};
		sheet.views = [{ state: 'frozen', ySplit: 1 }];

		for (const row of rows) {
			const av1Nota = toNum(row['av1_nota']);
			const av2Nota = toNum(row['av2_nota']);
			const mediaVal = media(av1Nota, av2Nota);

			const addedRow = sheet.addRow({
				id: row['id'],
				cpf: mascararCpf((row['cpf'] as string | null) ?? ''),
				concorrencia: concorrencia(row),
				projeto_pesquisa:
					colapsarEspacos(row['projeto_pesquisa']) || 'Não informado',
				linha_pesquisa:
					colapsarEspacos(row['linha_pesquisa']) || 'Não informado',
				palavras: colapsarEspacos(row['palavras']) || 'Nenhuma',
				av1_nome: row['av1_nome'] ?? null,
				av1_sistematizacao: toNum(row['av1_sistematizacao']),
				av1_sintese: toNum(row['av1_sintese']),
				av1_capacidade: toNum(row['av1_capacidade']),
				av1_linguagem: toNum(row['av1_linguagem']),
				av1_nota: av1Nota,
				av1_comentario: colapsarEspacos(row['av1_comentario']),
				av2_nome: row['av2_nome'] ?? null,
				av2_sistematizacao: toNum(row['av2_sistematizacao']),
				av2_sintese: toNum(row['av2_sintese']),
				av2_capacidade: toNum(row['av2_capacidade']),
				av2_linguagem: toNum(row['av2_linguagem']),
				av2_nota: av2Nota,
				av2_comentario: colapsarEspacos(row['av2_comentario']),
				media: mediaVal,
			});

			// wrapText nas colunas de comentário
			const colComentario1 = addedRow.getCell('av1_comentario');
			const colComentario2 = addedRow.getCell('av2_comentario');
			colComentario1.alignment = { wrapText: true, vertical: 'top' };
			colComentario2.alignment = { wrapText: true, vertical: 'top' };
		}

		const buffer = await workbook.xlsx.writeBuffer();
		return Buffer.from(buffer);
	}

	private async resolverCriterios(
		idEdital: number,
		nomeEtapa: string,
	): Promise<{ idCriterioPai: number; idsSubCriterios: number[] }> {
		const nome = this.validarEtapa(nomeEtapa);
		const criterioPai =
			await this.distribuicaoRepository.obterCriterioPaiPorEtapa(
				idEdital,
				nome,
			);
		if (!criterioPai) {
			throw new BadRequestException(
				`Edital ${idEdital} não possui critério de avaliação cadastrado para a etapa ${nome}.`,
			);
		}
		const subCriterios =
			await this.distribuicaoRepository.obterSubCriterios(criterioPai.id);
		return {
			idCriterioPai: criterioPai.id,
			idsSubCriterios: subCriterios.map((c) => c.id),
		};
	}

	private validarEtapa(nomeEtapa: string): EtapaDistribuicaoNome {
		if (!ETAPAS_DISTRIBUICAO.includes(nomeEtapa as EtapaDistribuicaoNome)) {
			throw new BadRequestException(
				`Etapa inválida: ${nomeEtapa}. Valores aceitos: ${ETAPAS_DISTRIBUICAO.join(', ')}.`,
			);
		}
		return nomeEtapa as EtapaDistribuicaoNome;
	}
}
