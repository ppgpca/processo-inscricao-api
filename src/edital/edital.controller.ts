import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EditalService } from './edital.service';

@Controller('editais')
@UseGuards(JwtAuthGuard)
export class EditalController {
  constructor(private readonly editalService: EditalService) {}

  @Get('vigente')
  obterVigente() {
    return this.editalService.obterVigente();
  }

  @Get('proximo')
  obterProximo() {
    return this.editalService.obterProximo();
  }

  @Get(':id/documentos')
  obterComDocumentos(@Param('id', ParseIntPipe) id: number) {
    return this.editalService.obterComDocumentos(id);
  }

  @Get(':id')
  obterPorId(@Param('id', ParseIntPipe) id: number) {
    return this.editalService.obterPorId(id);
  }

  @Get()
  obterTodos() {
    return this.editalService.obterTodos();
  }
}
