import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateCriterioAvaliacao20260709000500 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.criterio_avaliacao (
        id          SERIAL NOT NULL,
        id_edital   INTEGER NOT NULL
          REFERENCES public.edital (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        nome        VARCHAR NOT NULL,
        descricao   TEXT,
        nota_maxima DECIMAL NOT NULL,
        peso        DECIMAL NOT NULL,
        ordem       INTEGER NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT criterio_avaliacao_pkey PRIMARY KEY (id)
      )
    `);

    await ensureUpdatedAtTrigger(
      queryRunner,
      'criterio_avaliacao',
      'update_criterio_avaliacao_updated_at',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_criterio_avaliacao_updated_at ON public.criterio_avaliacao;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS public.criterio_avaliacao`);
  }
}
