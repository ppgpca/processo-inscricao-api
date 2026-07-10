import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CandidatoModule } from './candidato/candidato.module';
import { dataSourceOptions } from './database/data-source';
import { DocumentoModule } from './documento/documento.module';
import { EditalModule } from './edital/edital.module';
import { InscricaoModule } from './inscricao/inscricao.module';
import { LinhaPesquisaModule } from './linha-pesquisa/linha-pesquisa.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    CandidatoModule,
    EditalModule,
    InscricaoModule,
    LinhaPesquisaModule,
    DocumentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
