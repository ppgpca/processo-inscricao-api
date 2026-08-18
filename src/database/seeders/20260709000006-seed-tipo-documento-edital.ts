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
		recurso: false,
		padraoNome: 'identificacao',
	},
	{
		nome: 'CPF',
		descricao: null,
		obrigatorio: false,
		ordem: 2,
		ativo: true,
		recurso: false,
		padraoNome: 'cpf',
	},
	{
		nome: 'Diploma de curso superior',
		descricao: null,
		obrigatorio: true,
		ordem: 3,
		ativo: true,
		recurso: false,
		padraoNome: 'diploma',
	},
	{
		nome: 'Histórico escolar do curso de graduação',
		descricao: null,
		obrigatorio: true,
		ordem: 4,
		ativo: true,
		recurso: false,
		padraoNome: 'historico',
	},
	{
		nome: 'Anteprojeto de pesquisa',
		descricao: null,
		obrigatorio: true,
		ordem: 5,
		ativo: true,
		recurso: false,
		padraoNome: 'anteprojeto',
	},
	{
		nome: 'Currículo com documentos comprobatórios',
		descricao: null,
		obrigatorio: true,
		ordem: 6,
		ativo: true,
		recurso: false,
		padraoNome: 'curriculo',
	},
	{
		nome: 'Recurso inscrição',
		descricao: 'Documento com o texto do recurso da etapa de inscrições',
		obrigatorio: false,
		ordem: 7,
		ativo: true,
		recurso: true,
		padraoNome: 'recurso_inscricao',
	},
	{
		nome: 'Recurso anteprojeto',
		descricao: 'Documento com o texto do recurso da etapa de anteprojetos',
		obrigatorio: false,
		ordem: 8,
		ativo: true,
		recurso: true,
		padraoNome: 'recurso_anteprojeto',
	},
	{
		nome: 'Recurso entrevista',
		descricao: 'Documento com o texto do recurso da etapa de entrevista',
		obrigatorio: false,
		ordem: 9,
		ativo: true,
		recurso: true,
		padraoNome: 'recurso_entrevista',
	},
	{
		nome: 'Recurso currículo',
		descricao: 'Documento com o texto do recurso da etapa de currículo',
		obrigatorio: false,
		ordem: 10,
		ativo: true,
		recurso: true,
		padraoNome: 'recurso_curriculo',
	},
	{
		nome: 'Recurso resultado parcial',
		descricao: 'Documento com o texto do recurso do resultado parcial',
		obrigatorio: false,
		ordem: 11,
		ativo: true,
		recurso: true,
		padraoNome: 'recurso_resultado_parcial',
	},
];

export class SeedTipoDocumentoEdital20260709000006 implements Seeder {
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
