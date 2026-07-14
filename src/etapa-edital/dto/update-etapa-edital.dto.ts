import { PartialType } from '@nestjs/mapped-types';
import { CreateEtapaEditalDto } from './create-etapa-edital.dto';

export class UpdateEtapaEditalDto extends PartialType(CreateEtapaEditalDto) {}
