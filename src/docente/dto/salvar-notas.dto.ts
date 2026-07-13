import { Type } from 'class-transformer';
import {
	IsArray,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
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
