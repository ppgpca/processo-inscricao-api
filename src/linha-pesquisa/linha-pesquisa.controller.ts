import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LinhaPesquisaService } from './linha-pesquisa.service';

@Controller('linhas-pesquisa')
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
