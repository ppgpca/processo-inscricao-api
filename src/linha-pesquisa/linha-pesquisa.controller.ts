import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LinhaPesquisaService } from './linha-pesquisa.service';

@Controller('linhas-pesquisa')
@UseGuards(JwtAuthGuard)
export class LinhaPesquisaController {
  constructor(private readonly linhaPesquisaService: LinhaPesquisaService) {}

  @Get()
  obterAtivas() {
    return this.linhaPesquisaService.obterAtivas();
  }

  @Get(':id')
  obterPorId(@Param('id', ParseIntPipe) id: number) {
    return this.linhaPesquisaService.obterPorId(id);
  }
}
