import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateEtapaEditalDto } from './dto/create-etapa-edital.dto';
import { UpdateEtapaEditalDto } from './dto/update-etapa-edital.dto';
import { EtapaEditalService } from './etapa-edital.service';

@Controller('editais/:idEdital/etapas')
export class EtapaEditalController {
	constructor(private readonly etapaEditalService: EtapaEditalService) {}

	@Get()
	obterPorEdital(@Param('idEdital', ParseIntPipe) idEdital: number) {
		return this.etapaEditalService.obterPorEdital(idEdital);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	criar(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Body() dto: CreateEtapaEditalDto,
	) {
		return this.etapaEditalService.criar(idEdital, dto);
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	atualizar(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateEtapaEditalDto,
	) {
		return this.etapaEditalService.atualizar(idEdital, id, dto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	remover(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.etapaEditalService.remover(idEdital, id);
	}
}

@Controller('etapas')
export class EtapaEditalSiglasController {
	constructor(private readonly etapaEditalService: EtapaEditalService) {}

	@Get('siglas')
	obterSiglas() {
		return this.etapaEditalService.obterSiglas();
	}
}
