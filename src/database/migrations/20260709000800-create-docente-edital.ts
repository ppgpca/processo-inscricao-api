import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateDocenteEdital20260709000800 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.docente_edital (
        codigo_docente   VARCHAR NOT NULL
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        id_edital        INTEGER NOT NULL
          REFERENCES public.edital (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        avaliador        BOOLEAN NOT NULL,
        orientador       BOOLEAN NOT NULL,
        vagas_orientacao INTEGER,
        "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT docente_edital_pkey PRIMARY KEY (codigo_docente, id_edital)
      )
    `);

    await ensureUpdatedAtTrigger(
      queryRunner,
      'docente_edital',
      'update_docente_edital_updated_at',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_docente_edital_updated_at ON public.docente_edital;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS public.docente_edital`);
  }
}
