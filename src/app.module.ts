import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CandidatoModule } from './candidato/candidato.module';
import { dataSourceOptions } from './database/data-source';
import { DocenteModule } from './docente/docente.module';
import { DocumentoModule } from './documento/documento.module';
import { EditalModule } from './edital/edital.module';
import { InscricaoModule } from './inscricao/inscricao.module';
import { LinhaPesquisaModule } from './linha-pesquisa/linha-pesquisa.module';
import { PalavraChaveModule } from './palavra-chave/palavra-chave.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(dataSourceOptions),
		AuthModule,
		CandidatoModule,
		DocenteModule,
		EditalModule,
		InscricaoModule,
		LinhaPesquisaModule,
		DocumentoModule,
		PalavraChaveModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
