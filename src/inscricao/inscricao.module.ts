import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioAvaliacao } from '../database/entities/criterio-avaliacao.entity';
import { EtapaEdital } from '../database/entities/etapa-edital.entity';
import { Inscricao } from '../database/entities/inscricao.entity';
import { InscricaoPalavraChave } from '../database/entities/inscricao-palavra-chave.entity';
import { NotaCriterio } from '../database/entities/nota-criterio.entity';
import { InscricaoController } from './inscricao.controller';
import { InscricaoRepository } from './inscricao.repository';
import { InscricaoService } from './inscricao.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Inscricao,
			InscricaoPalavraChave,
			CriterioAvaliacao,
			NotaCriterio,
			EtapaEdital,
		]),
	],
	controllers: [InscricaoController],
	providers: [InscricaoService, InscricaoRepository],
	exports: [InscricaoService, InscricaoRepository],
})
export class InscricaoModule {}
