import { DataSource } from 'typeorm';
import { TipoDocumentoEdital } from '../entities/tipo-documento-edital.entity';
import { Seeder } from './seeder.interface';

const NUMERO_EDITAL = 'XXX/PPG PCA CH/UFFS/2026';

const tiposDocumento = [
	{
		nome: 'Documento de identificação',
		descricao: null,
		obrigatorio: true,
		ordem: 1,
		ativo: true,
		padraoNome: 'identificacao',
	},
	{
		nome: 'CPF',
		descricao: null,
		obrigatorio: false,
		ordem: 2,
		ativo: true,
		padraoNome: 'cpf',
	},
	{
		nome: 'Diploma de curso superior',
		descricao: null,
		obrigatorio: true,
		ordem: 3,
		ativo: true,
		padraoNome: 'diploma',
	},
	{
		nome: 'Histórico escolar do curso de graduação',
		descricao: null,
		obrigatorio: true,
		ordem: 4,
		ativo: true,
		padraoNome: 'historico',
	},
	{
		nome: 'Anteprojeto de pesquisa',
		descricao: null,
		obrigatorio: true,
		ordem: 5,
		ativo: true,
		padraoNome: 'anteprojeto',
	},
	{
		nome: 'Currículo com documentos comprobatórios',
		descricao: null,
		obrigatorio: true,
		ordem: 6,
		ativo: true,
		padraoNome: 'curriculo',
	},
];

export class SeedTipoDocumentoEdital20260709000005 implements Seeder {
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
			.getRepository(TipoDocumentoEdital)
			.insert(tiposDocumento.map((t) => ({ ...t, idEdital: edital.id })));
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(TipoDocumentoEdital)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
