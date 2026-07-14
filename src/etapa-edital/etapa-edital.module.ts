import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaEdital } from '../database/entities/etapa-edital.entity';
import {
	EtapaEditalController,
	TipoEtapaController,
} from './etapa-edital.controller';
import { EtapaEditalRepository } from './etapa-edital.repository';
import { EtapaEditalService } from './etapa-edital.service';

@Module({
	imports: [TypeOrmModule.forFeature([EtapaEdital])],
	controllers: [EtapaEditalController, TipoEtapaController],
	providers: [EtapaEditalService, EtapaEditalRepository],
	exports: [EtapaEditalService],
})
export class EtapaEditalModule {}
