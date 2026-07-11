import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAlocacaoOrientadorAddDataAlocacao20260711000002
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.alocacao_orientador
      ADD COLUMN data_alocacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);

		// Remove o DEFAULT após popular os dados existentes, tornando a coluna
		// exigida apenas em novos registros (sem valor padrão implícito)
		await queryRunner.query(`
      ALTER TABLE public.alocacao_orientador
      ALTER COLUMN data_alocacao DROP DEFAULT
    `);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.alocacao_orientador
      DROP COLUMN IF EXISTS data_alocacao
    `);
	}
}
