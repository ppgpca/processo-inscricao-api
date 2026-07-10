import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateTipoDocumentoEdital20260709000600
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.tipo_documento_edital (
        id          SERIAL NOT NULL,
        id_edital   INTEGER NOT NULL
          REFERENCES public.edital (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        nome        VARCHAR NOT NULL,
        descricao   TEXT,
        obrigatorio BOOLEAN NOT NULL,
        ordem       INTEGER NOT NULL,
        ativo       BOOLEAN NOT NULL,
        padrao_nome VARCHAR NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT tipo_documento_edital_pkey PRIMARY KEY (id)
      )
    `);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'tipo_documento_edital',
			'update_tipo_documento_edital_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_tipo_documento_edital_updated_at ON public.tipo_documento_edital;
    `);

		await queryRunner.query(
			`DROP TABLE IF EXISTS public.tipo_documento_edital`,
		);
	}
}
