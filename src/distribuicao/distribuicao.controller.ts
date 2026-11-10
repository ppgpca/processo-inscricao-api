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
	Res,
	UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
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

	@Get(':idEdital/anteprojeto/:idInscricao/notas')
	obterNotasAnteprojetoDocente(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('idInscricao', ParseIntPipe) idInscricao: number,
		@Query('codigoDocente') codigoDocente: string,
	) {
		return this.distribuicaoService.obterNotasAnteprojetoDocente(
			idEdital,
			idInscricao,
			codigoDocente,
		);
	}

	@Get(':idEdital/anteprojeto/relatorio')
	async gerarRelatorioAnteprojeto(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Res() res: Response,
	) {
		const buffer =
			await this.distribuicaoService.gerarRelatorioAnteprojetoXlsx(
				idEdital,
			);
		const encodedName = encodeURIComponent(
			`relatorio-anteprojeto-edital-${idEdital}.xlsx`,
		);
		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		);
		res.setHeader(
			'Content-Disposition',
			`attachment; filename*=UTF-8''${encodedName}`,
		);
		res.send(buffer);
	}

	@Get(':idEdital/:etapaNome/candidatos')
	listarCandidatos(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('etapaNome') etapaNome: string,
	) {
		return this.distribuicaoService.listarCandidatos(idEdital, etapaNome);
	}

	@Get(':idEdital/:etapaNome/docentes')
	listarDocentes(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('etapaNome') etapaNome: string,
	) {
		return this.distribuicaoService.listarDocentes(idEdital, etapaNome);
	}

	@Put(':idEdital/:etapaNome/atribuicoes')
	@HttpCode(HttpStatus.OK)
	atribuir(
		@Param('idEdital', ParseIntPipe) idEdital: number,
		@Param('etapaNome') etapaNome: string,
		@Body() dto: AtribuirAvaliadoresDto,
	) {
		return this.distribuicaoService.atribuir(
			idEdital,
			etapaNome,
			dto.itens,
		);
	}

	@Post(':idEdital/anteprojeto/auto')
	@HttpCode(HttpStatus.OK)
	proporDistribuicaoAnteprojeto(
		@Param('idEdital', ParseIntPipe) idEdital: number,
	) {
		return this.distribuicaoService.proporDistribuicaoAnteprojeto(idEdital);
	}
}
