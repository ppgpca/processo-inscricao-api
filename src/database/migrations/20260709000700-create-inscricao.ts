import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

const SEQUENCE_START = 202620001;

export class CreateInscricao20260709000700 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE public.inscricao (
        id                  SERIAL NOT NULL,
        cpf                 VARCHAR NOT NULL
          REFERENCES public.candidato (cpf)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        id_edital           INTEGER NOT NULL
          REFERENCES public.edital (id)
          ON UPDATE CASCADE ON DELETE RESTRICT,
        status              VARCHAR NOT NULL DEFAULT 'rascunho',
        id_linha_pesquisa   INTEGER
          REFERENCES public.linha_pesquisa (id)
          ON UPDATE CASCADE ON DELETE SET NULL,
        ativa               BOOLEAN NOT NULL DEFAULT TRUE,
        area_concentracao   VARCHAR,
        projeto_pesquisa    TEXT,
        dados_complementares JSONB,
        deferida            BOOLEAN DEFAULT NULL,
        nota_final          DECIMAL,
        posicao_ranking     INTEGER,
        deficiente          BOOLEAN,
        indigena            BOOLEAN,
        preto_pardo         BOOLEAN,
        etapa               INTEGER,
        id_etapa_atual      INTEGER
          REFERENCES public.etapa_edital (id)
          ON UPDATE CASCADE ON DELETE SET NULL,
        "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT inscricao_pkey PRIMARY KEY (id)
      )
    `);

		await queryRunner.query(
			`ALTER SEQUENCE inscricao_id_seq RESTART WITH ${SEQUENCE_START}`,
		);

		await ensureUpdatedAtTrigger(
			queryRunner,
			'inscricao',
			'update_inscricao_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_inscricao_updated_at ON public.inscricao;
    `);

		await queryRunner.query(`DROP TABLE IF EXISTS public.inscricao`);
	}
}
