import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EtapaEdital } from '../database/entities/etapa-edital.entity';
import { Inscricao } from '../database/entities/inscricao.entity';
import { Recurso } from '../database/entities/recurso.entity';
import { RecursoController } from './recurso.controller';
import { RecursoRepository } from './recurso.repository';
import { RecursoService } from './recurso.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Recurso, Inscricao, EtapaEdital]),
		AuthModule,
	],
	controllers: [RecursoController],
	providers: [RecursoService, RecursoRepository],
})
export class RecursoModule {}
