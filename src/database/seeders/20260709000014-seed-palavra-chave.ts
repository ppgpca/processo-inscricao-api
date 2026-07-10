import { DataSource } from 'typeorm';
import { PalavraChave } from '../entities/palavra-chave.entity';
import { Seeder } from './seeder.interface';

const palavras = [
	'Bancos de Dados',
	'Big Data',
	'Circuitos Digitais',
	'Engenharia de Software',
	'Hardware',
	'Inteligência Artificial',
	'Machine Learning',
	'Redes',
	'Simulação',
	'Sistemas',
	'Sistemas Digitais',
	'Telecomunicação',
	'Teoria da Computação',
	'Teste de Software',
];

export class SeedPalavraChave20260709000014 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(PalavraChave)
			.insert(palavras.map((palavra) => ({ palavra })));
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(PalavraChave)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
