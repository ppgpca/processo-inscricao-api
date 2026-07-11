import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class RefactorSchemaRemoveAuditColumns20260711000001
	implements MigrationInterface
{
	async up(queryRunner: QueryRunner): Promise<void> {
		// 1. nota_criterio: remove FK para distribuicao_avaliacao (necessário antes de dropar a tabela)
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        DROP CONSTRAINT IF EXISTS fk_nota_criterio_to_distribuicao_avaliacao
    `);

		// 2. distribuicao_avaliacao: remove trigger e dropa tabela
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_distribuicao_avaliacao_updated_at
        ON public.distribuicao_avaliacao
    `);
		await queryRunner.query(`
      DROP TABLE IF EXISTS public.distribuicao_avaliacao
    `);

		// 3. edital: remove status, createdAt, updatedAt e trigger
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_edital_updated_at ON public.edital
    `);
		await queryRunner.query(`
      ALTER TABLE public.edital
        DROP COLUMN IF EXISTS status,
        DROP COLUMN IF EXISTS "createdAt",
        DROP COLUMN IF EXISTS "updatedAt"
    `);

		// 4. inscricao: remove status, deferida, createdAt, updatedAt, trigger;
		//    torna id_linha_pesquisa NOT NULL
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_inscricao_updated_at ON public.inscricao
    `);
		await queryRunner.query(`
      ALTER TABLE public.inscricao
        DROP COLUMN IF EXISTS status,
        DROP COLUMN IF EXISTS deferida,
        DROP COLUMN IF EXISTS "createdAt",
        DROP COLUMN IF EXISTS "updatedAt"
    `);
		await queryRunner.query(`
      ALTER TABLE public.inscricao
        ALTER COLUMN id_linha_pesquisa SET NOT NULL
    `);

		// 5. criterio_avaliacao: remove createdAt, updatedAt, trigger;
		//    adiciona id_criterio_pai (self-referencing)
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_criterio_avaliacao_updated_at
        ON public.criterio_avaliacao
    `);
		await queryRunner.query(`
      ALTER TABLE public.criterio_avaliacao
        DROP COLUMN IF EXISTS "createdAt",
        DROP COLUMN IF EXISTS "updatedAt"
    `);
		await queryRunner.query(`
      ALTER TABLE public.criterio_avaliacao
        ADD COLUMN IF NOT EXISTS id_criterio_pai INTEGER
          REFERENCES public.criterio_avaliacao (id)
          ON UPDATE CASCADE ON DELETE RESTRICT
    `);

		// 6. alocacao_orientador: remove createdAt, updatedAt, trigger;
		//    adiciona data_alocacao NOT NULL
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_alocacao_orientador_updated_at
        ON public.alocacao_orientador
    `);
		await queryRunner.query(`
      ALTER TABLE public.alocacao_orientador
        DROP COLUMN IF EXISTS "createdAt",
        DROP COLUMN IF EXISTS "updatedAt"
    `);
		await queryRunner.query(`
      ALTER TABLE public.alocacao_orientador
        ADD COLUMN IF NOT EXISTS data_alocacao TIMESTAMPTZ NOT NULL
          DEFAULT CURRENT_TIMESTAMP
    `);

		// 7. docente: remove createdAt, updatedAt e trigger
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_docente_updated_at ON public.docente
    `);
		await queryRunner.query(`
      ALTER TABLE public.docente
        DROP COLUMN IF EXISTS "createdAt",
        DROP COLUMN IF EXISTS "updatedAt"
    `);

		// 8. nota_criterio: remove createdAt, updatedAt, trigger;
		//    adiciona comentario; adiciona FKs individuais para inscricao e docente
		await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_nota_criterio_updated_at ON public.nota_criterio
    `);
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        DROP COLUMN IF EXISTS "createdAt",
        DROP COLUMN IF EXISTS "updatedAt"
    `);
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        ADD COLUMN IF NOT EXISTS comentario TEXT
    `);
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        ADD CONSTRAINT fk_nota_criterio_to_inscricao
          FOREIGN KEY (id_inscricao)
          REFERENCES public.inscricao (id)
          ON UPDATE CASCADE ON DELETE CASCADE
    `);
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        ADD CONSTRAINT fk_nota_criterio_to_docente
          FOREIGN KEY (codigo_docente)
          REFERENCES public.docente (codigo)
          ON UPDATE CASCADE ON DELETE RESTRICT
    `);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		// Reverter nota_criterio
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        DROP CONSTRAINT IF EXISTS fk_nota_criterio_to_inscricao,
        DROP CONSTRAINT IF EXISTS fk_nota_criterio_to_docente
    `);
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        DROP COLUMN IF EXISTS comentario,
        ADD COLUMN "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
		await ensureUpdatedAtTrigger(
			queryRunner,
			'nota_criterio',
			'update_nota_criterio_updated_at',
		);

		// Reverter docente
		await queryRunner.query(`
      ALTER TABLE public.docente
        ADD COLUMN "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
		await ensureUpdatedAtTrigger(
			queryRunner,
			'docente',
			'update_docente_updated_at',
		);

		// Reverter alocacao_orientador
		await queryRunner.query(`
      ALTER TABLE public.alocacao_orientador
        DROP COLUMN IF EXISTS data_alocacao,
        ADD COLUMN "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
		await ensureUpdatedAtTrigger(
			queryRunner,
			'alocacao_orientador',
			'update_alocacao_orientador_updated_at',
		);

		// Reverter criterio_avaliacao
		await queryRunner.query(`
      ALTER TABLE public.criterio_avaliacao
        DROP COLUMN IF EXISTS id_criterio_pai,
        ADD COLUMN "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
		await ensureUpdatedAtTrigger(
			queryRunner,
			'criterio_avaliacao',
			'update_criterio_avaliacao_updated_at',
		);

		// Reverter inscricao
		await queryRunner.query(`
      ALTER TABLE public.inscricao
        ALTER COLUMN id_linha_pesquisa DROP NOT NULL
    `);
		await queryRunner.query(`
      ALTER TABLE public.inscricao
        ADD COLUMN status VARCHAR NOT NULL DEFAULT 'rascunho',
        ADD COLUMN deferida BOOLEAN DEFAULT NULL,
        ADD COLUMN "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
		await ensureUpdatedAtTrigger(
			queryRunner,
			'inscricao',
			'update_inscricao_updated_at',
		);

		// Reverter edital
		await queryRunner.query(`
      ALTER TABLE public.edital
        ADD COLUMN status VARCHAR NOT NULL DEFAULT 'rascunho',
        ADD COLUMN "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
		await ensureUpdatedAtTrigger(
			queryRunner,
			'edital',
			'update_edital_updated_at',
		);

		// Recriar distribuicao_avaliacao
		await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.distribuicao_avaliacao (
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
        CONSTRAINT distribuicao_avaliacao_pkey
          PRIMARY KEY (id_inscricao, codigo_docente)
      )
    `);
		await ensureUpdatedAtTrigger(
			queryRunner,
			'distribuicao_avaliacao',
			'update_distribuicao_avaliacao_updated_at',
		);

		// Restaurar FK de nota_criterio para distribuicao_avaliacao
		await queryRunner.query(`
      ALTER TABLE public.nota_criterio
        ADD CONSTRAINT fk_nota_criterio_to_distribuicao_avaliacao
          FOREIGN KEY (id_inscricao, codigo_docente)
          REFERENCES public.distribuicao_avaliacao (id_inscricao, codigo_docente)
          ON UPDATE CASCADE ON DELETE CASCADE
    `);
	}
}
