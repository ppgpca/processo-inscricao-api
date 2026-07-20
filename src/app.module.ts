import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CandidatoModule } from './candidato/candidato.module';
import { dataSourceOptions } from './database/data-source';
import { DistribuicaoModule } from './distribuicao/distribuicao.module';
import { DocenteModule } from './docente/docente.module';
import { DocumentoModule } from './documento/documento.module';
import { EditalModule } from './edital/edital.module';
import { EtapaEditalModule } from './etapa-edital/etapa-edital.module';
import { InscricaoModule } from './inscricao/inscricao.module';
import { LinhaPesquisaModule } from './linha-pesquisa/linha-pesquisa.module';
import { PalavraChaveModule } from './palavra-chave/palavra-chave.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(dataSourceOptions),
		AuthModule,
		CandidatoModule,
		DistribuicaoModule,
		DocenteModule,
		EditalModule,
		EtapaEditalModule,
		InscricaoModule,
		LinhaPesquisaModule,
		DocumentoModule,
		PalavraChaveModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
