import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCandidatoDto {
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsDateString()
  dataNascimento: string;

  @IsString()
  @IsOptional()
  rg?: string | null;

  @IsString()
  @IsOptional()
  telefone?: string | null;

  @IsString()
  @IsOptional()
  celular?: string | null;

  @IsEmail()
  email: string;

  @IsEmail()
  @IsOptional()
  email2?: string | null;

  @IsString()
  @IsOptional()
  enderecoRua?: string | null;

  @IsString()
  @IsOptional()
  enderecoNum?: string | null;

  @IsString()
  @IsOptional()
  enderecoBairro?: string | null;

  @IsString()
  @IsOptional()
  enderecoCidade?: string | null;

  @IsString()
  @IsOptional()
  enderecoEstado?: string | null;

  @IsString()
  @IsOptional()
  enderecoCep?: string | null;
}
