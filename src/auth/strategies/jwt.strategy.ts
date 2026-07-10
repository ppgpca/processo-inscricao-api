import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '../auth.repository';

interface JwtPayload {
	userId: string;
	email: string;
	nome: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authRepository: AuthRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || 'sua-chave-secreta-padrao',
			algorithms: ['HS256'],
		});
	}

	async validate(payload: JwtPayload) {
		const usuario = await this.authRepository.buscarUsuarioPorId(
			payload.userId,
		);

		if (!usuario) {
			throw new UnauthorizedException('Token inválido ou expirado');
		}

		return usuario;
	}
}
