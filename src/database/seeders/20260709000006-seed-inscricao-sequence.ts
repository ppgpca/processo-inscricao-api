import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';

const SEQUENCE_START = 202620001;

export class SeedInscricaoSequence20260709000006 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.query(
			`ALTER SEQUENCE inscricao_id_seq RESTART WITH ${SEQUENCE_START}`,
		);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.query(
			`ALTER SEQUENCE inscricao_id_seq RESTART WITH 1`,
		);
	}
}
