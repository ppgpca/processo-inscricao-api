import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreatePermissao20260709001800 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.permissoes (
        id                        SERIAL NOT NULL,
        nome                      VARCHAR NOT NULL,
        descricao                 VARCHAR,
        codigo_categoria_permissao VARCHAR NOT NULL
          REFERENCES public.categoria_permissao (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        "createdAt"               TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"               TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT permissoes_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'permissoes',
			'update_permissoes_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_permissoes_updated_at ON public.permissoes;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.permissoes`);
	}
}
