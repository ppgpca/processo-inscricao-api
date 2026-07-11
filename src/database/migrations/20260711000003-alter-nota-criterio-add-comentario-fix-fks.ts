import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureForeignKey } from './helpers/foreign-key';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class AlterNotaCriterioAddComentarioFixFks20260711000003
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		// Remove FK legada para distribuicao_avaliacao (tabela removida do modelo)
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
      DROP CONSTRAINT IF EXISTS fk_nota_criterio_to_distribuicao_avaliacao
    `);

		// Adiciona coluna comentario
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
      ADD COLUMN IF NOT EXISTS comentario TEXT DEFAULT NULL
    `);

		// Adiciona FK para inscricao
		await ensureForeignKey(
			queryRunner,
			'fk_nota_criterio_to_inscricao',
			`
      ALTER TABLE public.nota_criterio
      ADD CONSTRAINT fk_nota_criterio_to_inscricao
      FOREIGN KEY (id_inscricao)
      REFERENCES public.inscricao (id)
      ON UPDATE CASCADE ON DELETE CASCADE
      `,
		);

		// Adiciona FK para docente
		await ensureForeignKey(
			queryRunner,
			'fk_nota_criterio_to_docente',
			`
      ALTER TABLE public.nota_criterio
      ADD CONSTRAINT fk_nota_criterio_to_docente
      FOREIGN KEY (codigo_docente)
      REFERENCES public.docente (codigo)
      ON UPDATE CASCADE ON DELETE RESTRICT
      `,
		);

		// Garante trigger de updatedAt (criado na migration original, mas reaplica
		// por segurança caso o ambiente seja recriado parcialmente)
		await ensureUpdatedAtTrigger(
			queryRunner,
			'nota_criterio',
			'update_nota_criterio_updated_at',
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
      DROP CONSTRAINT IF EXISTS fk_nota_criterio_to_docente
    `);

		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
      DROP CONSTRAINT IF EXISTS fk_nota_criterio_to_inscricao
    `);

		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
      DROP COLUMN IF EXISTS comentario
    `);
	}
}
