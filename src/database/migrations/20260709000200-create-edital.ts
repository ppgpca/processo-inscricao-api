import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateEdital20260709000200 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.edital (
        id           SERIAL NOT NULL,
        numero       VARCHAR NOT NULL,
        titulo       VARCHAR NOT NULL,
        descricao    TEXT,
        ano          INTEGER NOT NULL,
        vagas_total  INTEGER NOT NULL,
        url_edital_pdf VARCHAR,
        ativo        BOOLEAN NOT NULL,
        "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT edital_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'edital',
			'update_edital_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_edital_updated_at ON public.edital;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.edital`);
	}
}
