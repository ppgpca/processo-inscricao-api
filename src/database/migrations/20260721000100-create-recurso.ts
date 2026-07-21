import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateRecurso20260721000100 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.recurso (
        id                    SERIAL NOT NULL,
        texto                 VARCHAR,
        id_criterio_avaliacao INTEGER NOT NULL
          REFERENCES public.criterio_avaliacao (id)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        id_etapa_edital       INTEGER NOT NULL
          REFERENCES public.etapa_edital (id)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        id_inscricao          INTEGER NOT NULL
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        deferido              BOOLEAN,
        "createdAt"           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT recurso_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'recurso',
			'update_recurso_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_recurso_updated_at ON public.recurso;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.recurso`);
	}
}
