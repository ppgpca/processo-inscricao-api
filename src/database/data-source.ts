import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DBHOST || 'localhost',
	port: parseInt(process.env.DBPORT ?? '5432'),
	username: process.env.DBUSER || 'postgres',
	password: process.env.DBPASS || 'postgres',
	database: process.env.DBNAME || 'processo_inscricao',
	schema: 'public',
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/*{.ts,.js}'],
	synchronize: false,
	logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
