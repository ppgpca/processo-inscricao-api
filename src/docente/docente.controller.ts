import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	ParseIntPipe,
	Put,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SalvarNotasDto } from './dto/salvar-notas.dto';
import { DocenteService } from './docente.service';

@Controller('docentes')
@UseGuards(JwtAuthGuard)
export class DocenteController {
	constructor(private readonly docenteService: DocenteService) {}

	@Get('me/editais')
	obterEditaisComoAvaliador(@Request() req: { user: { id: string } }) {
		return this.docenteService.obterEditaisComoAvaliador(req.user.id);
	}

	@Get('me/criterios')
	obterCriteriosPorEdital(
		@Query('idEdital', ParseIntPipe) idEdital: number,
	) {
		return this.docenteService.obterCriteriosPorEdital(idEdital);
	}

	@Put('me/notas')
	@HttpCode(HttpStatus.OK)
	salvarNotas(
		@Request() req: { user: { id: string } },
		@Body() dto: SalvarNotasDto,
	) {
		return this.docenteService.salvarNotas(
			req.user.id,
			dto.notas,
			dto.codigoDocente,
		);
	}

	@Get('me/subcriterios')
	obterSubCriteriosPorPai(
		@Query('idCriterioPai', ParseIntPipe) idCriterioPai: number,
	) {
		return this.docenteService.obterSubCriteriosPorPai(idCriterioPai);
	}

	@Get('me/candidatos')
	obterCandidatosParaAvaliar(
		@Request() req: { user: { id: string } },
		@Query('idCriterio', ParseIntPipe) idCriterio: number,
	) {
		return this.docenteService.obterCandidatosParaAvaliar(
			req.user.id,
			idCriterio,
		);
	}

	@Get('me/notas')
	obterNotasPorInscricaoECriterio(
		@Request() req: { user: { id: string } },
		@Query('idInscricao', ParseIntPipe) idInscricao: number,
		@Query('idCriterio', ParseIntPipe) idCriterio: number,
		@Query('codigoDocente') codigoDocente?: string,
	) {
		return this.docenteService.obterNotasPorInscricaoECriterio(
			req.user.id,
			idInscricao,
			idCriterio,
			codigoDocente,
		);
	}
}
