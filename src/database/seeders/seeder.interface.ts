import { DataSource } from 'typeorm';

export interface Seeder {
  up(dataSource: DataSource): Promise<void>;
  down(dataSource: DataSource): Promise<void>;
}
