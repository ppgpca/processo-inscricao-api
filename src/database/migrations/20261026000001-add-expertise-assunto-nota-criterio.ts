import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpertiseAssuntoNotaCriterio20261026000001
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			ALTER TABLE public.nota_criterio
				ADD COLUMN expertise_assunto SMALLINT NULL
		`);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			ALTER TABLE public.nota_criterio
				DROP COLUMN IF EXISTS expertise_assunto
		`);
	}
}
