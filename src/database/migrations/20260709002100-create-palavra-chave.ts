import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreatePalavraChave20260709002100 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.palavra_chave (
        id          SERIAL NOT NULL,
        palavra     VARCHAR NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT palavra_chave_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'palavra_chave',
			'update_palavra_chave_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_palavra_chave_updated_at ON public.palavra_chave;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.palavra_chave`);
	}
}
