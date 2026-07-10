import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  ensureUpdatedAtFunction,
  ensureUpdatedAtTrigger,
} from './helpers/updated-at';

export class CreateCandidato20260709000100 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.candidato (
        cpf          VARCHAR NOT NULL,
        nome         VARCHAR NOT NULL,
        data_nascimento DATE NOT NULL,
        rg           VARCHAR,
        telefone     VARCHAR,
        celular      VARCHAR,
        email        VARCHAR NOT NULL,
        email2       VARCHAR,
        endereco_rua    TEXT,
        endereco_num    VARCHAR,
        endereco_bairro VARCHAR,
        endereco_cidade VARCHAR,
        endereco_estado VARCHAR,
        endereco_cep    VARCHAR,
        "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT candidato_pkey PRIMARY KEY (cpf)
      )
    `);

    await ensureUpdatedAtFunction(queryRunner);
    await ensureUpdatedAtTrigger(
      queryRunner,
      'candidato',
      'update_candidato_updated_at',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_candidato_updated_at ON public.candidato;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS public.candidato`);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
  }
}
