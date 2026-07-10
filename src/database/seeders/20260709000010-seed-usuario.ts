import { DataSource, DeepPartial } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Seeder } from './seeder.interface';

const usuarios: DeepPartial<Usuario>[] = [
	{
		id: 'braulio',
		nome: 'Braulio Adriano de Mello',
		email: 'braulio@uffs.edu.br',
	},
	{
		id: 'claunir.pavan',
		nome: 'Claunir Pavan',
		email: 'claunir.pavan@uffs.edu.br',
	},
	{ id: 'duarte', nome: 'Denio Duarte', email: 'duarte@uffs.edu.br' },
	{ id: 'felipegrando', nome: 'Felipe Grando', email: 'grando@uffs.edu.br' },
	{
		id: 'gschreiner',
		nome: 'Geomar Schreiner',
		email: 'schreiner.geomar@uffs.edu.br',
	},
	{ id: 'gian', nome: 'Giancarlo Salton', email: 'gian@uffs.edu.br' },
	{
		id: 'guilherme.dalbianco',
		nome: 'Guilherme Dal Bianco',
		email: 'guilherme.dalbianco@uffs.edu.br',
	},
	{ id: 'lcaimi', nome: 'Luciano Lores Caimi', email: 'lcaimi@uffs.edu.br' },
	{
		id: 'marco.spohn',
		nome: 'Marco Aurelio Spohn',
		email: 'marco.spohn@uffs.edu.br',
	},
	{
		id: 'samuel.feitosa',
		nome: 'Samuel Feitosa',
		email: 'samuelfeitosa@uffs.edu.br',
	},
	{
		id: 'jose.grzybowski',
		nome: 'Jose Mario Vicensi Grzybowski',
		email: 'jose.grzybowski@uffs.edu.br',
	},
];

export class SeedUsuario20260709000010 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.manager.save(Usuario, usuarios);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(Usuario).delete({});
	}
}
