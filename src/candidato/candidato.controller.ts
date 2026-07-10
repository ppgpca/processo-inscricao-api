import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CandidatoService } from './candidato.service';
import { CreateCandidatoDto } from './dto/create-candidato.dto';
import { UpdateCandidatoDto } from './dto/update-candidato.dto';

@Controller('candidatos')
export class CandidatoController {
  constructor(private readonly candidatoService: CandidatoService) {}

  @Get(':cpf')
  obterPorCpf(@Param('cpf') cpf: string) {
    return this.candidatoService.obterPorCpf(cpf);
  }

  @Post('upsert')
  upsert(@Body() dto: CreateCandidatoDto) {
    return this.candidatoService.upsert(dto);
  }

  @Post()
  criar(@Body() dto: CreateCandidatoDto) {
    return this.candidatoService.criar(dto);
  }

  @Put(':cpf')
  atualizar(@Param('cpf') cpf: string, @Body() dto: UpdateCandidatoDto) {
    return this.candidatoService.atualizar(cpf, dto);
  }
}
