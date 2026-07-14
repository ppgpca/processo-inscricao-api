import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateInscricaoDto {
	@IsString()
	@IsNotEmpty()
	cpf: string;

	@IsInt()
	idEdital: number;

	@IsInt()
	@IsOptional()
	idLinhaPesquisa?: number | null;

	@IsInt()
	@IsOptional()
	etapa?: number | null;

	@IsInt()
	@IsOptional()
	idEtapaAtual?: number | null;

	@IsObject()
	@IsOptional()
	dadosComplementares?: Record<string, unknown> | null;

	@IsBoolean()
	@IsOptional()
	deficiente?: boolean | null;

	@IsBoolean()
	@IsOptional()
	indigena?: boolean | null;

	@IsBoolean()
	@IsOptional()
	pretoPardo?: boolean | null;

	@IsString()
	@IsOptional()
	areaConcentracao?: string | null;

	@IsString()
	@IsOptional()
	projetoPesquisa?: string | null;

	@IsArray()
	@IsInt({ each: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	@IsOptional()
	idsPalavrasChave?: number[];
}
