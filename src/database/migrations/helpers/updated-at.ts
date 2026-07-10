import { QueryRunner } from 'typeorm';

export async function ensureUpdatedAtFunction(
  queryRunner: QueryRunner,
): Promise<void> {
  await queryRunner.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'update_updated_at_column' AND n.nspname = 'public'
      ) THEN
        CREATE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
          NEW."updatedAt" = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $func$ language 'plpgsql';
      END IF;
    END $$;
  `);
}

export async function ensureUpdatedAtTrigger(
  queryRunner: QueryRunner,
  tableName: string,
  triggerName: string,
): Promise<void> {
  await queryRunner.query(`
    DROP TRIGGER IF EXISTS ${triggerName} ON public.${tableName};
    CREATE TRIGGER ${triggerName}
    BEFORE UPDATE ON public.${tableName}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}
