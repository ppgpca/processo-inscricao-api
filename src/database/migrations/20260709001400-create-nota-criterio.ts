import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureForeignKey } from './helpers/foreign-key';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateNotaCriterio20260709001400 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.nota_criterio (
        id_criterio_avaliacao INTEGER NOT NULL
          REFERENCES public.criterio_avaliacao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        id_inscricao          INTEGER NOT NULL
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        codigo_docente        VARCHAR NOT NULL
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        nota                  DECIMAL,
        comentario            TEXT,
        "createdAt"           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT nota_criterio_pkey PRIMARY KEY (id_criterio_avaliacao, id_inscricao, codigo_docente)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'nota_criterio',
			'update_nota_criterio_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_nota_criterio_updated_at ON public.nota_criterio;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.nota_criterio`);
	}
}
