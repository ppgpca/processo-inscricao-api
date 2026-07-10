import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateInscricaoPalavraChave20260709002200
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.inscricao_palavra_chave (
        id_inscricao     INTEGER NOT NULL
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        id_palavra_chave INTEGER NOT NULL
          REFERENCES public.palavra_chave (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT inscricao_palavra_chave_pkey PRIMARY KEY (id_inscricao, id_palavra_chave)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'inscricao_palavra_chave',
			'update_inscricao_palavra_chave_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_inscricao_palavra_chave_updated_at ON public.inscricao_palavra_chave;
    `);

		await queryRunner.query(
			`DROP TABLE IF EXISTS public.inscricao_palavra_chave`,
		);
	}
}
