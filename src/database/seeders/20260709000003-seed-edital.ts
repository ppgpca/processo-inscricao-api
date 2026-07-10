import { DataSource } from 'typeorm';
import { Edital } from '../entities/edital.entity';
import { Seeder } from './seeder.interface';

export class SeedEdital20260709000003 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(Edital).insert([
			{
				numero: 'XXX/PPG PCA CH/UFFS/2026',
				titulo: 'Processo Seletivo de Aluno Regular do Programa de Pós-Graduação Profissional em Computação Aplicada (PPGPCA) — Mestrado, ingresso 2027.1',
				descricao:
					'Processo seletivo para aluno regular do curso de Mestrado Profissional em Computação Aplicada, campus Chapecó/UFFS, com ingresso em 2027.1, conforme Portaria nº 4344/GR/UFFS/2025 e Resolução 71/CONSUNI CPPGEC/UFFS/2025',
				ano: 2026,
				dataInicioInscricao: new Date('2026-09-01T00:00:00'),
				dataFimInscricao: new Date('2026-10-15T23:59:59'),
				dataInicioAvaliacao: new Date('2026-10-22T00:00:00'),
				dataFimAvaliacao: new Date('2026-12-03T00:00:00'),
				dataDivulgacaoResultado: new Date('2026-12-11T00:00:00'),
				dataInicioPreferenciaOrientador: null,
				dataFimPreferenciaOrientador: null,
				vagasTotal: 15,
				status: 'rascunho',
				urlEditalPdf:
					'https://www.uffs.edu.br/uffs/profissional-em-computacao-aplicada/apresentacao',
				ativo: true,
			},
		]);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(Edital).delete({});
	}
}
