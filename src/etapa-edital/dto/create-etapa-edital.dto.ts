import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateEtapaEditalDto {
	@IsString()
	@IsNotEmpty()
	sigla: string;

	@IsString()
	@IsNotEmpty()
	nome: string;

	@IsInt()
	@Min(1)
	ordem: number;

	@IsDateString()
	dataInicio: string;

	@IsDateString()
	@IsOptional()
	dataFim?: string | null;
}
