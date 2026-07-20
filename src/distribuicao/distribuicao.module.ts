import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CriterioAvaliacao } from '../database/entities/criterio-avaliacao.entity';
import { DocenteEdital } from '../database/entities/docente-edital.entity';
import { Inscricao } from '../database/entities/inscricao.entity';
import { NotaCriterio } from '../database/entities/nota-criterio.entity';
import { DistribuicaoController } from './distribuicao.controller';
import { DistribuicaoRepository } from './distribuicao.repository';
import { DistribuicaoService } from './distribuicao.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Inscricao,
			DocenteEdital,
			CriterioAvaliacao,
			NotaCriterio,
		]),
		AuthModule,
	],
	controllers: [DistribuicaoController],
	providers: [DistribuicaoService, DistribuicaoRepository],
})
export class DistribuicaoModule {}
