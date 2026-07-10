import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateDocenteLinhaPesquisa20260709000900
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.docente_linha_pesquisa (
        codigo_docente   VARCHAR NOT NULL
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        id_linha_pesquisa INTEGER NOT NULL
          REFERENCES public.linha_pesquisa (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT docente_linha_pesquisa_pkey PRIMARY KEY (codigo_docente, id_linha_pesquisa)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'docente_linha_pesquisa',
			'update_docente_linha_pesquisa_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_docente_linha_pesquisa_updated_at ON public.docente_linha_pesquisa;
    `);

		await queryRunner.query(
			`DROP TABLE IF EXISTS public.docente_linha_pesquisa`,
		);
	}
}
