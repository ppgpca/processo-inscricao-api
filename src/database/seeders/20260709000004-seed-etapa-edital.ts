import { DataSource } from 'typeorm';
import { EtapaEdital, TipoEtapa } from '../entities/etapa-edital.entity';
import { Seeder } from './seeder.interface';

const NUMERO_EDITAL = 'XXX/PPG PCA CH/UFFS/2026';

/**
 * Etapas do processo seletivo baseadas no calendário do edital:
 *
 * Inscrições:        01/09 → 15/10
 * Homologação:       16/10 → 21/10
 * Análise currículo: 22/10 → 11/11
 * Anteprojeto:       12/11 → 25/11
 * Entrevistas:       26/11 → 03/12
 * Resultado parcial: 04/12 → 10/12
 * Recursos:          11/12 → 13/12
 * Resultado final:   14/12 em diante
 */
const ETAPAS: Omit<EtapaEdital, 'id' | 'idEdital' | 'edital' | 'createdAt' | 'updatedAt'>[] = [
	{
		tipo: TipoEtapa.INSCRICAO,
		nome: 'Inscrições',
		ordem: 1,
		dataInicio: new Date('2026-09-01T00:00:00'),
		dataFim: new Date('2026-10-15T23:59:59'),
	},
	{
		tipo: TipoEtapa.HOMOLOGACAO,
		nome: 'Homologação das inscrições',
		ordem: 2,
		dataInicio: new Date('2026-10-16T00:00:00'),
		dataFim: new Date('2026-10-21T23:59:59'),
	},
	{
		tipo: TipoEtapa.ANTEPROJETO,
		nome: 'Avaliação de anteprojeto',
		ordem: 3,
		dataInicio: new Date('2026-11-12T00:00:00'),
		dataFim: new Date('2026-11-25T23:59:59'),
	},
	{
		tipo: TipoEtapa.ENTREVISTA,
		nome: 'Entrevistas',
		ordem: 4,
		dataInicio: new Date('2026-11-26T00:00:00'),
		dataFim: new Date('2026-12-03T23:59:59'),
	},
	{
		tipo: TipoEtapa.ANALISE_CURRICULO,
		nome: 'Análise de currículo',
		ordem: 5,
		dataInicio: new Date('2026-10-22T00:00:00'),
		dataFim: new Date('2026-11-11T23:59:59'),
	},
	{
		tipo: TipoEtapa.RESULTADO_PARCIAL,
		nome: 'Resultado parcial',
		ordem: 6,
		dataInicio: new Date('2026-12-04T00:00:00'),
		dataFim: new Date('2026-12-10T23:59:59'),
	},
	{
		tipo: TipoEtapa.RECURSO,
		nome: 'Período de recursos',
		ordem: 7,
		dataInicio: new Date('2026-12-11T00:00:00'),
		dataFim: new Date('2026-12-13T23:59:59'),
	},
	{
		tipo: TipoEtapa.RESULTADO_FINAL,
		nome: 'Resultado final',
		ordem: 8,
		dataInicio: new Date('2026-12-14T00:00:00'),
		dataFim: null,
	},
];

export class SeedEtapaEdital20260709000004 implements Seeder {
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

		const repo = dataSource.getRepository(EtapaEdital);

		await repo.insert(
			ETAPAS.map((etapa) => ({ ...etapa, idEdital: edital.id })),
		);
	}

	async down(dataSource: DataSource): Promise<void> {
		const editalRepo = dataSource.getRepository('edital');
		const edital = await editalRepo
			.createQueryBuilder()
			.select('id')
			.where('numero = :numero', { numero: NUMERO_EDITAL })
			.getRawOne<{ id: number }>();

		if (!edital) return;

		await dataSource
			.getRepository(EtapaEdital)
			.createQueryBuilder()
			.delete()
			.where('id_edital = :idEdital', { idEdital: edital.id })
			.execute();
	}
}
