import { DataSource, DeepPartial } from 'typeorm';
import { UsuarioGrupo } from '../entities/usuario-grupo.entity';
import { Seeder } from './seeder.interface';

const docentesIds = [
	'braulio',
	'claunir.pavan',
	'duarte',
	'felipegrando',
	'gschreiner',
	'gian',
	'guilherme.dalbianco',
	'lcaimi',
	'marco.spohn',
	'samuel.feitosa',
	'jose.grzybowski',
];

export class SeedUsuarioGrupo20260709000012 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		const docenteGrupo: DeepPartial<UsuarioGrupo>[] = docentesIds.map(
			(id) => ({
				idGrupo: 2,
				idUsuario: id,
			}),
		);

		const adminGrupo: DeepPartial<UsuarioGrupo>[] = [
			{ idGrupo: 1, idUsuario: 'gian' },
		];

		await dataSource.manager.save(UsuarioGrupo, [
			...adminGrupo,
			...docenteGrupo,
		]);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(UsuarioGrupo).delete({});
	}
}
