import { Type } from 'class-transformer';
import {
	IsArray,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	ValidateNested,
} from 'class-validator';

export class SalvarNotaItemDto {
	@IsInt()
	idInscricao: number;

	@IsInt()
	idCriterioAvaliacao: number;

	@IsNumber()
	@Min(0)
	nota: number;

	@IsOptional()
	@IsString()
	@MaxLength(5000)
	comentario?: string | null;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(5)
	expertiseAssunto?: number | null;
}

export class SalvarNotasDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SalvarNotaItemDto)
	notas: SalvarNotaItemDto[];

	/** Permite admin/coordenador salvar em nome de outro avaliador. */
	@IsOptional()
	@IsString()
	codigoDocente?: string;
}
