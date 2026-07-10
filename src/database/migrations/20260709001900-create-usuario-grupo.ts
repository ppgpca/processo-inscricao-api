import { MigrationInterface, QueryRunner } from 'typeorm';
import { ensureUpdatedAtTrigger } from './helpers/updated-at';

export class CreateUsuarioGrupo20260709001900 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.usuario_grupo (
        id_grupo    INTEGER NOT NULL
          REFERENCES public.grupo (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        id_usuario  VARCHAR NOT NULL
          REFERENCES public.usuario (id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT usuario_grupo_pkey PRIMARY KEY (id_grupo, id_usuario)
      )
    `);

    await ensureUpdatedAtTrigger(
      queryRunner,
      'usuario_grupo',
      'update_usuario_grupo_updated_at',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_usuario_grupo_updated_at ON public.usuario_grupo;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS public.usuario_grupo`);
  }
}
