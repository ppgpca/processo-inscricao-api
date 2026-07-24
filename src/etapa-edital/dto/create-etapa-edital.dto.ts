import {
	IsBoolean,
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
	nome: string;

	@IsString()
	@IsNotEmpty()
	descricao: string;

	@IsInt()
	@Min(1)
	ordem: number;

	@IsDateString()
	dataInicio: string;

	@IsDateString()
	@IsOptional()
	dataFim?: string | null;

	@IsBoolean()
	@IsOptional()
	recurso?: boolean;
}
