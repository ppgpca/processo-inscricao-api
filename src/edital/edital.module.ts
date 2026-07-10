import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edital } from '../database/entities/edital.entity';
import { EditalController } from './edital.controller';
import { EditalRepository } from './edital.repository';
import { EditalService } from './edital.service';

@Module({
  imports: [TypeOrmModule.forFeature([Edital])],
  controllers: [EditalController],
  providers: [EditalService, EditalRepository],
  exports: [EditalService],
})
export class EditalModule {}
