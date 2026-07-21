import { Type } from 'class-transformer';
import {
	ArrayUnique,
	IsArray,
	IsDateString,
	IsInt,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

export class AtribuicaoItemDto {
	@IsInt()
	idInscricao: number;

	@IsArray()
	@ArrayUnique()
	@IsString({ each: true })
	codigosDocentes: string[];

	/** Início do slot da banca (entrevista). */
	@IsOptional()
	@IsDateString()
	dataBanca?: string | null;
}

export class AtribuirAvaliadoresDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AtribuicaoItemDto)
	itens: AtribuicaoItemDto[];
}
