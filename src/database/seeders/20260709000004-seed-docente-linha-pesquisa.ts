import { DataSource, DeepPartial } from 'typeorm';
import { DocenteLinhaPesquisa } from '../entities/docente-linha-pesquisa.entity';
import { Seeder } from './seeder.interface';

const vinculos: DeepPartial<DocenteLinhaPesquisa>[] = [
	{ codigoDocente: 'braulio', idLinhaPesquisa: 2 },
	{ codigoDocente: 'claunir.pavan', idLinhaPesquisa: 2 },
	{ codigoDocente: 'duarte', idLinhaPesquisa: 1 },
	{ codigoDocente: 'felipegrando', idLinhaPesquisa: 1 },
	{ codigoDocente: 'fernando.bevilacqua', idLinhaPesquisa: 1 },
	{ codigoDocente: 'gschreiner', idLinhaPesquisa: 1 },
	{ codigoDocente: 'gian', idLinhaPesquisa: 1 },
	{ codigoDocente: 'graziela.tonin', idLinhaPesquisa: 2 },
	{ codigoDocente: 'guilherme.dalbianco', idLinhaPesquisa: 1 },
	{ codigoDocente: 'lcaimi', idLinhaPesquisa: 2 },
	{ codigoDocente: 'marco.spohn', idLinhaPesquisa: 2 },
	{ codigoDocente: 'samuel.feitosa', idLinhaPesquisa: 2 },
	{ codigoDocente: 'jose.grzybowski', idLinhaPesquisa: 2 },
	{ codigoDocente: 'tiago.zonta', idLinhaPesquisa: 1 },
];

export class SeedDocenteLinhaPesquisa20260709000004 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.manager.save(DocenteLinhaPesquisa, vinculos);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(DocenteLinhaPesquisa)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
