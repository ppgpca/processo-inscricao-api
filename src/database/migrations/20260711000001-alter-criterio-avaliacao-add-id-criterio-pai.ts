import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCriterioAvaliacaoAddIdCriterioPai20260711000001
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.criterio_avaliacao
      ADD COLUMN id_criterio_pai INTEGER DEFAULT NULL
        REFERENCES public.criterio_avaliacao (id)
        ON UPDATE CASCADE ON DELETE SET NULL
    `);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.criterio_avaliacao
      DROP COLUMN IF EXISTS id_criterio_pai
    `);
	}
}
