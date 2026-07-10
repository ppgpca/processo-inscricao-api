import { Controller, Get } from '@nestjs/common';
import { PalavraChaveService } from './palavra-chave.service';

@Controller('palavras-chave')
export class PalavraChaveController {
	constructor(private readonly palavraChaveService: PalavraChaveService) {}

	@Get()
	obterTodas() {
		return this.palavraChaveService.obterTodas();
	}
}
