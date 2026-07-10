import { DataSource, DeepPartial } from 'typeorm';
import { DocentePalavraChave } from '../entities/docente-palavra-chave.entity';
import { PalavraChave } from '../entities/palavra-chave.entity';
import { Seeder } from './seeder.interface';

const vinculos: Record<string, string[]> = {
	braulio: ['Simulação', 'Sistemas'],
	'claunir.pavan': ['Redes', 'Sistemas', 'Telecomunicação'],
	duarte: ['Bancos de Dados', 'Inteligência Artificial', 'Machine Learning'],
	felipegrando: ['Inteligência Artificial', 'Machine Learning'],
	'fernando.bevilacqua': ['Inteligência Artificial', 'Machine Learning'],
	gschreiner: ['Bancos de Dados', 'Big Data', 'Inteligência Artificial'],
	gian: ['Inteligência Artificial', 'Machine Learning'],
	'graziela.tonin': ['Engenharia de Software', 'Sistemas'],
	'guilherme.dalbianco': [
		'Bancos de Dados',
		'Inteligência Artificial',
		'Machine Learning',
	],
	lcaimi: ['Circuitos Digitais', 'Hardware', 'Sistemas', 'Sistemas Digitais'],
	'marco.spohn': ['Redes', 'Telecomunicação'],
	'samuel.feitosa': ['Sistemas', 'Teoria da Computação', 'Teste de Software'],
	'jose.grzybowski': ['Sistemas'],
	'tiago.zonta': ['Inteligência Artificial', 'Machine Learning'],
};

export class SeedDocentePalavraChave20260709000015 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		const todasPalavras = await dataSource
			.getRepository(PalavraChave)
			.find();

		const mapaId = new Map(
			todasPalavras.map((pk) => [pk.palavra, pk.id]),
		);

		const registros: DeepPartial<DocentePalavraChave>[] = [];

		for (const [codigoDocente, palavras] of Object.entries(vinculos)) {
			for (const palavra of palavras) {
				const idPalavraChave = mapaId.get(palavra);

				if (!idPalavraChave) {
					throw new Error(
						`Palavra-chave não encontrada: "${palavra}" (docente: ${codigoDocente})`,
					);
				}

				registros.push({ codigoDocente, idPalavraChave });
			}
		}

		await dataSource.manager.save(DocentePalavraChave, registros);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(DocentePalavraChave)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
