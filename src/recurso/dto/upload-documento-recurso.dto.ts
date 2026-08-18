import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UploadDocumentoRecursoDto {
	@IsString()
	@IsNotEmpty()
	cpf: string;

	@Type(() => Number)
	@IsInt()
	idInscricao: number;

	@Type(() => Number)
	@IsInt()
	idEtapaEdital: number;

	@Type(() => Number)
	@IsInt()
	idTipoDocumentoEdital: number;
}
