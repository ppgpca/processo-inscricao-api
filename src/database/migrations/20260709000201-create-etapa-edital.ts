import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateEtapaEdital20260709000201 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.etapa_edital (
        id           SERIAL NOT NULL,
        id_edital    INTEGER NOT NULL
          REFERENCES public.edital (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        sigla        VARCHAR NOT NULL,
        nome         VARCHAR NOT NULL,
        ordem        INTEGER NOT NULL,
        data_inicio  TIMESTAMPTZ NOT NULL,
        data_fim     TIMESTAMPTZ,
        "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT etapa_edital_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'etapa_edital',
			'update_etapa_edital_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_etapa_edital_updated_at ON public.etapa_edital;
    `);
		await queryRunner.query(`DROP TABLE IF EXISTS public.etapa_edital`);
	}
}
