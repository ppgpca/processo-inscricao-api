import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateUsuario20260709001500 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.usuario (
        id          VARCHAR NOT NULL,
        nome        VARCHAR NOT NULL,
        email       VARCHAR NOT NULL,
        senha       VARCHAR,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT usuario_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'usuario',
			'update_usuario_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_usuario_updated_at ON public.usuario;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.usuario`);
	}
}
