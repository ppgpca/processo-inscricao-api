import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinhaPesquisa } from '../database/entities/linha-pesquisa.entity';
import { LinhaPesquisaController } from './linha-pesquisa.controller';
import { LinhaPesquisaRepository } from './linha-pesquisa.repository';
import { LinhaPesquisaService } from './linha-pesquisa.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinhaPesquisa])],
  controllers: [LinhaPesquisaController],
  providers: [LinhaPesquisaService, LinhaPesquisaRepository],
  exports: [LinhaPesquisaService],
})
export class LinhaPesquisaModule {}
