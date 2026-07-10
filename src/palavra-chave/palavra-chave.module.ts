import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalavraChave } from '../database/entities/palavra-chave.entity';
import { PalavraChaveController } from './palavra-chave.controller';
import { PalavraChaveRepository } from './palavra-chave.repository';
import { PalavraChaveService } from './palavra-chave.service';

@Module({
	imports: [TypeOrmModule.forFeature([PalavraChave])],
	controllers: [PalavraChaveController],
	providers: [PalavraChaveService, PalavraChaveRepository],
	exports: [PalavraChaveService],
})
export class PalavraChaveModule {}
