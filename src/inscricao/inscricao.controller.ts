import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { InscricaoService } from './inscricao.service';

@Controller('inscricoes')
export class InscricaoController {
	constructor(private readonly inscricaoService: InscricaoService) {}

	@Get('dashboard')
	@UseGuards(JwtAuthGuard)
	obterDadosDashboard(@Query('idEdital') idEdital?: string) {
		return this.inscricaoService.obterDadosDashboard(
			idEdital ? Number(idEdital) : undefined,
		);
	}

	@Get('buscar')
	obterPorCpfEdital(
		@Query('cpf') cpf: string,
		@Query('idEdital', ParseIntPipe) idEdital: number,
	) {
		return this.inscricaoService.obterPorCpfEdital(cpf, idEdital);
	}

	@Get('mais-recente')
	obterMaisRecentePorCpf(@Query('cpf') cpf: string) {
		return this.inscricaoService.obterMaisRecentePorCpf(cpf);
	}

	@Get(':id')
	obterPorId(@Param('id', ParseIntPipe) id: number) {
		return this.inscricaoService.obterPorId(id);
	}

	@Post()
	criar(@Body() dto: CreateInscricaoDto) {
		return this.inscricaoService.criar(dto);
	}

	@Put(':id/desativar')
	@HttpCode(HttpStatus.OK)
	desativar(@Param('id', ParseIntPipe) id: number) {
		return this.inscricaoService.desativar(id);
	}

	@Put(':id')
	atualizar(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateInscricaoDto,
	) {
		return this.inscricaoService.atualizar(id, dto);
	}
}
