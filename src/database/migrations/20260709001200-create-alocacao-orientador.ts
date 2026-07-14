import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateAlocacaoOrientador20260709001200
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.alocacao_orientador (
        id_inscricao   INTEGER NOT NULL UNIQUE
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        codigo_docente VARCHAR NOT NULL
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        data_alocacao  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT alocacao_orientador_pkey PRIMARY KEY (id_inscricao, codigo_docente)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'alocacao_orientador',
			'update_alocacao_orientador_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_alocacao_orientador_updated_at ON public.alocacao_orientador;
    `);

		await queryRunner.query(
			`DROP TABLE IF EXISTS public.alocacao_orientador`,
		);
	}
}
