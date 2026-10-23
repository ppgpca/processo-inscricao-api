import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CriterioAvaliacao } from '../database/entities/criterio-avaliacao.entity';
import { DocenteEdital } from '../database/entities/docente-edital.entity';
import { NotaCriterio } from '../database/entities/nota-criterio.entity';
import { DocumentoModule } from '../documento/documento.module';
import { DocenteController } from './docente.controller';
import { DocenteRepository } from './docente.repository';
import { DocenteService } from './docente.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			DocenteEdital,
			CriterioAvaliacao,
			NotaCriterio,
		]),
		AuthModule,
		DocumentoModule,
	],
	controllers: [DocenteController],
	providers: [DocenteService, DocenteRepository],
})
export class DocenteModule {}
