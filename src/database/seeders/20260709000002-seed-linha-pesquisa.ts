import { DataSource } from 'typeorm';
import { LinhaPesquisa } from '../entities/linha-pesquisa.entity';
import { Seeder } from './seeder.interface';

export class SeedLinhaPesquisa20260709000002 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(LinhaPesquisa).insert([
			{
				id: 1,
				nome: 'Inteligência Artificial e Ciência de Dados',
				ativa: true,
			},
			{ id: 2, nome: 'Sistemas Computacionais Aplicados', ativa: true },
		]);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(LinhaPesquisa)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
