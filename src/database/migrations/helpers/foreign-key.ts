import { QueryRunner } from 'typeorm';

export async function ensureForeignKey(
  queryRunner: QueryRunner,
  constraintName: string,
  alterSql: string,
): Promise<void> {
  const rows: unknown[] = await queryRunner.query(
    `SELECT 1 FROM pg_constraint WHERE conname = $1`,
    [constraintName],
  );

  if (rows.length === 0) {
    await queryRunner.query(alterSql);
  }
}

export async function ensureIndex(
  queryRunner: QueryRunner,
  indexName: string,
  createSql: string,
): Promise<void> {
  const rows: unknown[] = await queryRunner.query(
    `SELECT 1 FROM pg_indexes WHERE indexname = $1`,
    [indexName],
  );

  if (rows.length === 0) {
    await queryRunner.query(createSql);
  }
}
