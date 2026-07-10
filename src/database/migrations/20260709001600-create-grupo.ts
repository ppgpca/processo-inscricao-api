import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateGrupo20260709001600 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.grupo (
        id          SERIAL NOT NULL,
        nome        VARCHAR NOT NULL,
        descricao   VARCHAR,
        sistema     INTEGER NOT NULL DEFAULT 2,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT grupo_pkey PRIMARY KEY (id)
      )
    `);

    await ensureUpdatedAtTrigger(
      queryRunner,
      'grupo',
      'update_grupo_updated_at',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_grupo_updated_at ON public.grupo;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS public.grupo`);
  }
}
