import { DataSource, DeepPartial } from 'typeorm';
import { Docente } from '../entities/docente.entity';
import { DocenteEdital } from '../entities/docente-edital.entity';
import { Edital } from '../entities/edital.entity';
import { Seeder } from './seeder.interface';

export class SeedDocenteEdital20260709000014 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		const [edital] = await dataSource.getRepository(Edital).find({
			order: { id: 'DESC' },
			take: 1,
		});

		if (!edital) {
			throw new Error(
				'Nenhum edital encontrado para vincular os docentes.',
			);
		}

		const docentes = await dataSource.getRepository(Docente).find();

		const vinculos: DeepPartial<DocenteEdital>[] = docentes.map(
			(docente) => ({
				codigoDocente: docente.codigo,
				idEdital: edital.id,
				avaliador: true,
				orientador: true,
				vagasOrientacao: null,
			}),
		);

		await dataSource.manager.save(DocenteEdital, vinculos);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(DocenteEdital)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
