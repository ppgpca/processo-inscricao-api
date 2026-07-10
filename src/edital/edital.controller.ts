import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EditalService } from './edital.service';

@Controller('editais')
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
