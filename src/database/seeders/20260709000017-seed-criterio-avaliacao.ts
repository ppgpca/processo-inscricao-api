import { DataSource } from 'typeorm';
import { CriterioAvaliacao } from '../entities/criterio-avaliacao.entity';
import { Seeder } from './seeder.interface';

const NUMERO_EDITAL = 'XXX/PPG PCA CH/UFFS/2026';

export class SeedCriterioAvaliacao20260709000017 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		const editalRepo = dataSource.getRepository('edital');
		const edital = await editalRepo
			.createQueryBuilder()
			.select('id')
			.where('numero = :numero', { numero: NUMERO_EDITAL })
			.getRawOne<{ id: number }>();

		if (!edital) {
			throw new Error(
				`Edital "${NUMERO_EDITAL}" não encontrado. Execute o seeder de editais antes.`,
			);
		}

		const repo = dataSource.getRepository(CriterioAvaliacao);

		const anteprojeto = await repo.save({
			idEdital: edital.id,
			idCriterioPai: null,
			nome: 'Anteprojeto',
			descricao:
				'Avaliado, sem identificação do candidato, por dois professores do corpo docente do PPGPCA.',
			notaMaxima: 10,
			peso: 0.3,
			ordem: 1,
		});

		await repo.insert([
			{
				idEdital: edital.id,
				idCriterioPai: anteprojeto.id,
				nome: 'Sistematização',
				descricao: 'Organização do texto.',
				notaMaxima: 3,
				peso: 1,
				ordem: 1,
			},
			{
				idEdital: edital.id,
				idCriterioPai: anteprojeto.id,
				nome: 'Síntese',
				descricao:
					'Clareza, objetividade, precisão, coerência, criatividade e adequação do texto aos objetivos do projeto.',
				notaMaxima: 3,
				peso: 1,
				ordem: 2,
			},
			{
				idEdital: edital.id,
				idCriterioPai: anteprojeto.id,
				nome: 'Capacidade Argumentativa / Domínio do tema',
				descricao: 'Conhecimento específico.',
				notaMaxima: 3,
				peso: 1,
				ordem: 3,
			},
			{
				idEdital: edital.id,
				idCriterioPai: anteprojeto.id,
				nome: 'Qualidade da linguagem',
				descricao: 'Gramática e domínio do vocabulário técnico.',
				notaMaxima: 1,
				peso: 1,
				ordem: 4,
			},
		]);

		const entrevista = await repo.save({
			idEdital: edital.id,
			idCriterioPai: null,
			nome: 'Entrevista',
			descricao: 'Avaliação do desempenho do candidato na entrevista.',
			notaMaxima: 10,
			peso: 0.4,
			ordem: 2,
		});

		await repo.insert([
			{
				idEdital: edital.id,
				idCriterioPai: entrevista.id,
				nome: 'Motivação para participar do programa',
				descricao: 'Motivação para participar do programa.',
				notaMaxima: 1,
				peso: 1,
				ordem: 1,
			},
			{
				idEdital: edital.id,
				idCriterioPai: entrevista.id,
				nome: 'Clareza da comunicação, linguagem e capacidade de resposta',
				descricao:
					'Clareza da comunicação, linguagem e capacidade de resposta.',
				notaMaxima: 3,
				peso: 1,
				ordem: 2,
			},
			{
				idEdital: edital.id,
				idCriterioPai: entrevista.id,
				nome: 'Sustentação da proposta e conhecimento de temas correlatos',
				descricao:
					'Sustentação da proposta e conhecimento de temas correlatos.',
				notaMaxima: 3,
				peso: 1,
				ordem: 3,
			},
			{
				idEdital: edital.id,
				idCriterioPai: entrevista.id,
				nome: 'Perfil e disponibilidade do candidato para a vaga',
				descricao: 'Perfil e disponibilidade do candidato para a vaga.',
				notaMaxima: 3,
				peso: 1,
				ordem: 4,
			},
		]);

		await repo.insert([
			{
				idEdital: edital.id,
				idCriterioPai: null,
				nome: 'Currículo',
				descricao:
					'Avaliação do currículo e dos documentos comprobatórios do candidato.',
				notaMaxima: 10,
				peso: 0.3,
				ordem: 3,
			},
		]);
	}

	async down(dataSource: DataSource): Promise<void> {
		const repo = dataSource.getRepository(CriterioAvaliacao);

		// Remove sub-critérios antes dos critérios pai para respeitar a FK
		await repo
			.createQueryBuilder()
			.delete()
			.where('id_criterio_pai IS NOT NULL')
			.execute();

		await repo.createQueryBuilder().delete().execute();
	}
}
