import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreatePreferenciaOrientador20260709001300
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.preferencia_orientador (
        id_inscricao   INTEGER NOT NULL
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        codigo_docente VARCHAR NOT NULL
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        ordem          INTEGER NOT NULL,
        "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT preferencia_orientador_pkey PRIMARY KEY (id_inscricao, codigo_docente)
      )
    `);

		await queryRunner.query(`
      CREATE UNIQUE INDEX uq_preferencia_orientador_id_inscricao_codigo_docente
        ON public.preferencia_orientador (id_inscricao ASC, codigo_docente ASC)
    `);

		await queryRunner.query(`
      CREATE UNIQUE INDEX uq_preferencia_orientador_id_inscricao_ordem
        ON public.preferencia_orientador (id_inscricao ASC, ordem ASC)
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'preferencia_orientador',
			'update_preferencia_orientador_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_preferencia_orientador_updated_at ON public.preferencia_orientador;
    `);

		await queryRunner.query(`
      DROP INDEX IF EXISTS public.uq_preferencia_orientador_id_inscricao_ordem
    `);
		await queryRunner.query(`
      DROP INDEX IF EXISTS public.uq_preferencia_orientador_id_inscricao_codigo_docente
    `);
		await queryRunner.query(
			`DROP TABLE IF EXISTS public.preferencia_orientador`,
		);
	}
}
