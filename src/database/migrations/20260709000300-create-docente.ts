import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateDocente20260709000300 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.docente (
        codigo       VARCHAR NOT NULL,
        nome         VARCHAR NOT NULL,
        email        VARCHAR NOT NULL,
        usuario_ldap VARCHAR,
        senha        VARCHAR,
        externo      BOOLEAN NOT NULL,
        instituicao  VARCHAR,
        ativo        BOOLEAN NOT NULL,
        "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT docente_pkey PRIMARY KEY (codigo),
        CONSTRAINT docente_email_key UNIQUE (email)
      )
    `);

    await ensureUpdatedAtTrigger(
      queryRunner,
      'docente',
      'update_docente_updated_at',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_docente_updated_at ON public.docente;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS public.docente`);
  }
}
