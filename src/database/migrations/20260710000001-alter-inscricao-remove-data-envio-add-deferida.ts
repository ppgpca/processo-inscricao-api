import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterInscricaoRemoveDataEnvioAddDeferida20260710000001
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE public.inscricao DROP COLUMN IF EXISTS data_envio`,
		);

		await queryRunner.query(
			`ALTER TABLE public.inscricao ADD COLUMN deferida BOOLEAN DEFAULT NULL`,
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE public.inscricao DROP COLUMN IF EXISTS deferida`,
		);

		await queryRunner.query(
			`ALTER TABLE public.inscricao ADD COLUMN data_envio TIMESTAMPTZ`,
		);
	}
}
