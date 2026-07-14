import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';
import { TipoEtapa } from '../../database/entities/etapa-edital.entity';

export class CreateEtapaEditalDto {
	@IsEnum(TipoEtapa)
	tipo: TipoEtapa;

	@IsString()
	@IsNotEmpty()
	nome: string;

	@IsInt()
	@Min(1)
	ordem: number;

	@IsDateString()
	@IsOptional()
	dataInicio?: string | null;

	@IsDateString()
	@IsOptional()
	dataFim?: string | null;
}
