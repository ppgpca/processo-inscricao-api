import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFinalizadaInscricao20261019000001
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.inscricao
        ADD COLUMN finalizada BOOLEAN NOT NULL DEFAULT FALSE
    `);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.inscricao
        DROP COLUMN IF EXISTS finalizada
    `);
	}
}
