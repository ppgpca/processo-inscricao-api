import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidato } from '../database/entities/candidato.entity';
import { CandidatoController } from './candidato.controller';
import { CandidatoRepository } from './candidato.repository';
import { CandidatoService } from './candidato.service';

@Module({
	imports: [TypeOrmModule.forFeature([Candidato])],
	controllers: [CandidatoController],
	providers: [CandidatoService, CandidatoRepository],
	exports: [CandidatoService],
})
export class CandidatoModule {}
