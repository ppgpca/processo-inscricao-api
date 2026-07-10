import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateDocentePalavraChave20260709002300
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.docente_palavra_chave (
        codigo_docente   VARCHAR NOT NULL
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE CASCADE,
        id_palavra_chave INTEGER NOT NULL
          REFERENCES public.palavra_chave (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT docente_palavra_chave_pkey PRIMARY KEY (codigo_docente, id_palavra_chave)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'docente_palavra_chave',
			'update_docente_palavra_chave_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_docente_palavra_chave_updated_at ON public.docente_palavra_chave;
    `);

		await queryRunner.query(
			`DROP TABLE IF EXISTS public.docente_palavra_chave`,
		);
	}
}
