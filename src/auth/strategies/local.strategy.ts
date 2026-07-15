import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { Usuario } from '../../database/entities/usuario.entity';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private readonly authRepository: AuthRepository) {
		super({ usernameField: 'userId', passwordField: 'senha' });
	}

	async validate(userId: string, senha: string): Promise<Usuario> {
		const usuario = await this.authRepository.buscarUsuarioPorId(userId);

		if (!usuario?.senha || !(await bcrypt.compare(senha, usuario.senha))) {
			throw new UnauthorizedException('Credenciais inválidas');
		}

		return usuario;
	}
}
