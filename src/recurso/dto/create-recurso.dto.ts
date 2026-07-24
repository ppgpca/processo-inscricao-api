import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecursoDto {
	@IsString()
	@IsNotEmpty()
	cpf: string;

	@IsInt()
	idInscricao: number;

	@IsInt()
	idEtapaEdital: number;

	@IsString()
	@IsNotEmpty()
	texto: string;
}
