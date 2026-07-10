import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscricao } from '../database/entities/inscricao.entity';
import { InscricaoController } from './inscricao.controller';
import { InscricaoRepository } from './inscricao.repository';
import { InscricaoService } from './inscricao.service';

@Module({
	imports: [TypeOrmModule.forFeature([Inscricao])],
	controllers: [InscricaoController],
	providers: [InscricaoService, InscricaoRepository],
	exports: [InscricaoService, InscricaoRepository],
})
export class InscricaoModule {}
