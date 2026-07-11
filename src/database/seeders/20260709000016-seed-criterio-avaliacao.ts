import { DataSource } from 'typeorm';
import { CriterioAvaliacao } from '../entities/criterio-avaliacao.entity';
import { Seeder } from './seeder.interface';

const NUMERO_EDITAL = 'XXX/PPG PCA CH/UFFS/2026';

const criterios = [
	{
		nome: 'Anteprojeto',
		descricao: 'Avaliação do anteprojeto de pesquisa submetido pelo candidato.',
		notaMaxima: 10,
		peso: 0.3,
		ordem: 1,
	},
	{
		nome: 'Entrevista',
		descricao: 'Avaliação do desempenho do candidato na entrevista.',
		notaMaxima: 10,
		peso: 0.4,
		ordem: 2,
	},
	{
		nome: 'Currículo',
		descricao: 'Avaliação do currículo e dos documentos comprobatórios do candidato.',
		notaMaxima: 10,
		peso: 0.3,
		ordem: 3,
	},
];

export class SeedCriterioAvaliacao20260709000016 implements Seeder {
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

		await dataSource
			.getRepository(CriterioAvaliacao)
			.insert(criterios.map((c) => ({ ...c, idEdital: edital.id })));
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(CriterioAvaliacao)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
