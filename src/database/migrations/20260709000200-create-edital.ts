import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateEdital20260709000200 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.edital (
        id                                SERIAL NOT NULL,
        numero                            VARCHAR NOT NULL,
        titulo                            VARCHAR NOT NULL,
        descricao                         TEXT,
        ano                               INTEGER NOT NULL,
        data_inicio_inscricao             TIMESTAMPTZ NOT NULL,
        data_fim_inscricao                TIMESTAMPTZ NOT NULL,
        data_inicio_avaliacao             TIMESTAMPTZ,
        data_fim_avaliacao                TIMESTAMPTZ,
        data_divulgacao_resultado         TIMESTAMPTZ,
        data_inicio_preferencia_orientador TIMESTAMPTZ,
        data_fim_preferencia_orientador   TIMESTAMPTZ,
        vagas_total                       INTEGER NOT NULL,
        status                            VARCHAR NOT NULL DEFAULT 'rascunho',
        url_edital_pdf                    VARCHAR,
        ativo                             BOOLEAN NOT NULL,
        "createdAt"                       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"                       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
