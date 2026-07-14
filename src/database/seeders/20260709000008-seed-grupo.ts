import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';

export class SeedGrupo20260709000008 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.query(`
			INSERT INTO public.grupo (id, nome, descricao, sistema)
			VALUES
				(1, 'admin', 'Administrador do sistema.', 1),
				(2, 'coordenador', 'Coordenador do processo de seleção.', 1),
				(3, 'docente', 'Docente orientador do processo de seleção.', 1),
				(4, 'candidato', 'Candidato ao processo de seleção.', 1)
		`);
		await dataSource.query(`SELECT setval('grupo_id_seq', 4, true)`);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.query(`DELETE FROM public.grupo`);
		await dataSource.query(`SELECT setval('grupo_id_seq', 1, false)`);
	}
}
