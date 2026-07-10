import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateGrupoPermissao20260709002000 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.grupo_permissao (
        id_grupo    INTEGER NOT NULL
          REFERENCES public.grupo (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        id_permissao INTEGER NOT NULL
          REFERENCES public.permissao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT grupo_permissao_pkey PRIMARY KEY (id_grupo, id_permissao)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'grupo_permissao',
			'update_grupo_permissao_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_grupo_permissao_updated_at ON public.grupo_permissao;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.grupo_permissao`);
	}
}
