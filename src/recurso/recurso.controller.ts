import {
	BadRequestException,
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
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Grupos } from '../common/decorators/permissoes.decorator';
import { Permissoes } from '../common/enums/permissoes.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissaoGuard } from '../common/guards/permissao.guard';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { DecisaoRecursoDto } from './dto/decisao-recurso.dto';
import { UploadDocumentoRecursoDto } from './dto/upload-documento-recurso.dto';
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

	@Post('documento')
	@UseInterceptors(
		FileInterceptor('arquivo', {
			storage: diskStorage({
				destination: './uploads',
				filename: (_req, file, cb) => {
					const ext = path.extname(file.originalname);
					const base = path
						.basename(file.originalname, ext)
						.replace(/\s+/g, '-');
					cb(null, `${Date.now()}-${base}${ext}`);
				},
			}),
		}),
	)
	uploadDocumento(
		@Body() dto: UploadDocumentoRecursoDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (!file) {
			throw new BadRequestException('Nenhum arquivo enviado.');
		}
		return this.recursoService.uploadDocumento(dto, file);
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
