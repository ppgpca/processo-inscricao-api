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
	UseGuards,
} from '@nestjs/common';
import { Grupos } from '../common/decorators/permissoes.decorator';
import { Permissoes } from '../common/enums/permissoes.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissaoGuard } from '../common/guards/permissao.guard';
import { AtribuirAvaliadoresDto } from './dto/atribuir-avaliadores.dto';
import { DistribuicaoService } from './distribuicao.service';

@Controller('distribuicao')
@UseGuards(JwtAuthGuard, PermissaoGuard)
@Grupos(Permissoes.GRUPOS.ADMIN, Permissoes.GRUPOS.COORDENADOR)
export class DistribuicaoController {
	constructor(private readonly distribuicaoService: DistribuicaoService) {}

	@Get(':idEdital/:etapaSigla/candidatos')
	listarCandidatos(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('etapaSigla') etapaSigla: string,
	) {
		return this.distribuicaoService.listarCandidatos(idEdital, etapaSigla);
	}

	@Get(':idEdital/:etapaSigla/docentes')
	listarDocentes(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('etapaSigla') etapaSigla: string,
	) {
		return this.distribuicaoService.listarDocentes(idEdital, etapaSigla);
	}

	@Put(':idEdital/:etapaSigla/atribuicoes')
	@HttpCode(HttpStatus.OK)
	atribuir(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('etapaSigla') etapaSigla: string,
		@Body() dto: AtribuirAvaliadoresDto,
	) {
		return this.distribuicaoService.atribuir(idEdital, etapaSigla, dto.itens);
	}

	@Post(':idEdital/anteprojeto/auto')
	@HttpCode(HttpStatus.OK)
	proporDistribuicaoAnteprojeto(
		@Param('idEdital', ParseIntPipe) idEdital: number,
	) {
		return this.distribuicaoService.proporDistribuicaoAnteprojeto(idEdital);
	}
}
