import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureIndex } from './helpers/foreign-key';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateDistribuicaoAvaliacao20260709001000
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.distribuicao_avaliacao (
        id_inscricao   INTEGER NOT NULL
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        codigo_docente VARCHAR NOT NULL
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        nota_final     DECIMAL,
        avaliado       BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT distribuicao_avaliacao_pkey PRIMARY KEY (id_inscricao, codigo_docente)
      )
    `);

		await ensureIndex(
			queryRunner,
			'uq_distribuicao_avaliacao_id_inscricao_codigo_docente',
			`CREATE UNIQUE INDEX "uq_distribuicao_avaliacao_id_inscricao_codigo_docente"
      ON public.distribuicao_avaliacao (id_inscricao ASC, codigo_docente ASC)`,
		);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'distribuicao_avaliacao',
			'update_distribuicao_avaliacao_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_distribuicao_avaliacao_updated_at ON public.distribuicao_avaliacao;
    `);

		await queryRunner.query(
			`DROP TABLE IF EXISTS public.distribuicao_avaliacao`,
		);
	}
}
