import { DataSource } from 'typeorm';
import { Grupo } from '../entities/grupo.entity';
import { Seeder } from './seeder.interface';

export class SeedGrupo20260709000007 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(Grupo).insert([
			{
				id: 1,
				nome: 'admin',
				descricao: 'Administrador do sistema.',
				sistema: 2,
			},
			{
				id: 2,
				nome: 'docente',
				descricao: 'Docente orientador do processo de seleção.',
				sistema: 2,
			},
			{
				id: 3,
				nome: 'candidato',
				descricao: 'Candidato ao processo de seleção.',
				sistema: 2,
			},
		]);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(Grupo).delete({});
	}
}
