import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureForeignKey } from './helpers/foreign-key';

export class AlterInscricaoAddEtapaAtual20260713000002
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.inscricao
      ADD COLUMN IF NOT EXISTS id_etapa_atual INTEGER DEFAULT NULL
    `);

		await ensureForeignKey(
			queryRunner,
			'fk_inscricao_to_etapa_edital',
			`
      ALTER TABLE public.inscricao
      ADD CONSTRAINT fk_inscricao_to_etapa_edital
      FOREIGN KEY (id_etapa_atual)
      REFERENCES public.etapa_edital (id)
      ON UPDATE CASCADE ON DELETE SET NULL
      `,
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.inscricao
      DROP CONSTRAINT IF EXISTS fk_inscricao_to_etapa_edital
    `);

		await queryRunner.query(`
      ALTER TABLE public.inscricao
      DROP COLUMN IF EXISTS id_etapa_atual
    `);
	}
}
