import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateCategoriaPermissao20260709001700
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.categoria_permissao (
        codigo      VARCHAR NOT NULL,
        descricao   VARCHAR NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT categoria_permissao_pkey PRIMARY KEY (codigo)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'categoria_permissao',
			'update_categoria_permissao_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_categoria_permissao_updated_at ON public.categoria_permissao;
    `);

		await queryRunner.query(
			`DROP TABLE IF EXISTS public.categoria_permissao`,
		);
	}
}
