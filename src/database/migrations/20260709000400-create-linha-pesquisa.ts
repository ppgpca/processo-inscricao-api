import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateLinhaPesquisa20260709000400 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.linha_pesquisa (
        id          INTEGER NOT NULL,
        nome        VARCHAR NOT NULL,
        ativa       BOOLEAN,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT linha_pesquisa_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'linha_pesquisa',
			'update_linha_pesquisa_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_linha_pesquisa_updated_at ON public.linha_pesquisa;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.linha_pesquisa`);
	}
}
