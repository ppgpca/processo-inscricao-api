import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsString()
	@IsNotEmpty()
	senha: string;
}
