import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class DecisaoRecursoDto {
	@IsBoolean()
	deferido: boolean;

	@IsString()
	@IsNotEmpty()
	comentario: string;
}
