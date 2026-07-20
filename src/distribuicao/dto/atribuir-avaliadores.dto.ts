import { Type } from 'class-transformer';
import {
	ArrayUnique,
	IsArray,
	IsInt,
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
}

export class AtribuirAvaliadoresDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AtribuicaoItemDto)
	itens: AtribuicaoItemDto[];
}
