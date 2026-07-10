import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateDocumento20260709001100 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.documento (
        id_inscricao           INTEGER NOT NULL
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        id_tipo_documento_edital INTEGER NOT NULL
          REFERENCES public.tipo_documento_edital (id)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        versao                 INTEGER NOT NULL,
        atual                  BOOLEAN NOT NULL,
        nome_arquivo_original  VARCHAR NOT NULL,
        nome_arquivo           VARCHAR,
        caminho_armazenamento  VARCHAR NOT NULL,
        mime_type              VARCHAR NOT NULL,
        tamanho_bytes          INTEGER NOT NULL,
        enviado_em             TIMESTAMPTZ NOT NULL,
        "createdAt"            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT documento_pkey PRIMARY KEY (id_inscricao, id_tipo_documento_edital, versao)
      )
    `);

    await ensureUpdatedAtTrigger(
      queryRunner,
      'documento',
      'update_documento_updated_at',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_documento_updated_at ON public.documento;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS public.documento`);
  }
}
