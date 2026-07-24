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
	Query,
	UseGuards,
} from '@nestjs/common';
import { Grupos } from '../common/decorators/permissoes.decorator';
import { Permissoes } from '../common/enums/permissoes.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissaoGuard } from '../common/guards/permissao.guard';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { DecisaoRecursoDto } from './dto/decisao-recurso.dto';
import { RecursoService } from './recurso.service';

@Controller('recursos')
export class RecursoController {
	constructor(private readonly recursoService: RecursoService) {}

	@Get('consulta')
	consultar(
		@Query('cpf') cpf: string,
		@Query('idInscricao', ParseIntPipe) idInscricao: number,
	) {
		return this.recursoService.consultar(cpf, idInscricao);
	}

	@Post()
	criar(@Body() dto: CreateRecursoDto) {
		return this.recursoService.criar(dto);
	}

	@Get('gestao/:idEdital/:etapaNome')
	@UseGuards(JwtAuthGuard, PermissaoGuard)
	@Grupos(Permissoes.GRUPOS.ADMIN, Permissoes.GRUPOS.COORDENADOR)
	listarParaGestao(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('etapaNome') etapaNome: string,
	) {
		return this.recursoService.listarPorEtapa(idEdital, etapaNome);
	}

	@Put(':id/decisao')
	@UseGuards(JwtAuthGuard, PermissaoGuard)
	@Grupos(Permissoes.GRUPOS.ADMIN, Permissoes.GRUPOS.COORDENADOR)
	decidir(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: DecisaoRecursoDto,
	) {
		return this.recursoService.decidir(id, dto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissaoGuard)
	@Grupos(Permissoes.GRUPOS.ADMIN, Permissoes.GRUPOS.COORDENADOR)
	@HttpCode(HttpStatus.NO_CONTENT)
	remover(@Param('id', ParseIntPipe) id: number) {
		return this.recursoService.remover(id);
	}
}
