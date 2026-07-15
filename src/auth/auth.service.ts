import {
	Injectable,
	Logger,
	OnModuleInit,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import passport from 'passport';
import { Usuario } from '../database/entities/usuario.entity';
import { AuthRepository } from './auth.repository';
import { PermissoesService } from './permissoes.service';
import { LocalStrategy } from './strategies/local.strategy';

interface JwtPayload {
	userId: string;
	email: string | null;
	nome: string | null;
}

interface LdapUser {
	id: string;
	nome: string;
	email: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly jwtService: JwtService,
		private readonly authRepository: AuthRepository,
		private readonly permissoesService: PermissoesService,
		private readonly localStrategy: LocalStrategy,
	) {}

	onModuleInit(): void {
		if (!this.isLdapEnabled()) {
			this.logger.warn(
				'LDAP desabilitado: o login será realizado via usuário e senha local.',
			);
		}
	}

	gerarToken(usuario: Usuario): string {
		const payload: JwtPayload = {
			userId: usuario.id,
			email: usuario.email,
			nome: usuario.nome,
		};

		return this.jwtService.sign(payload, {
			expiresIn: '7d',
		});
	}

	validarToken(token: string): JwtPayload {
		try {
			return this.jwtService.verify<JwtPayload>(token);
		} catch {
			throw new UnauthorizedException('Token inválido');
		}
	}

	private autenticarLdap(userId: string, senha: string): Promise<LdapUser> {
		return new Promise((resolve, reject) => {
			const fakeReq = { body: { username: userId, password: senha } };
			(
				passport.authenticate(
					'ldapauth',
					{ session: false },
					(
						err: Error | null,
						user: { uid: string; cn: string; mail: string } | false,
					) => {
						if (err) return reject(err);
						if (!user)
							return reject(new Error('Credenciais inválidas'));
						resolve({
							id: user.uid,
							nome: user.cn,
							email: user.mail,
						});
					},
				) as (req: unknown) => void
			)(fakeReq);
		});
	}

	private isLdapEnabled(): boolean {
		const enabled = process.env.LDAP_ENABLED;
		return enabled === undefined || enabled === 'true' || enabled === '1';
	}

	async fazerLogin(
		userId: string,
		senha?: string,
	): Promise<{ token: string; usuario: object }> {
		const ldapEnabled = this.isLdapEnabled();

		if (ldapEnabled) {
			if (!senha) throw new Error('Senha é obrigatória');

			const dadosLdap = await this.autenticarLdap(userId, senha);
			const usuario = await this.authRepository.buscarUsuarioPorId(
				dadosLdap.id,
			);

			if (!usuario) throw new Error('Usuário não encontrado');

			return {
				token: this.gerarToken(usuario),
				usuario: {
					id: usuario.id,
					nome: usuario.nome,
					email: usuario.email,
					grupos: (usuario.usuarioGrupos ?? []).map((ug) => ({
						id: ug.grupo.id,
						nome: ug.grupo.nome,
						descricao: ug.grupo.descricao,
					})),
				},
			};
		} else {
			if (!senha) throw new Error('Senha é obrigatória');

			const usuario = await this.localStrategy.validate(userId, senha);

			return {
				token: this.gerarToken(usuario),
				usuario: {
					id: usuario.id,
					nome: usuario.nome,
					email: usuario.email,
					grupos: (usuario.usuarioGrupos ?? []).map((ug) => ({
						id: ug.grupo.id,
						nome: ug.grupo.nome,
						descricao: ug.grupo.descricao,
					})),
				},
			};
		}
	}

	async renovarToken(token: string): Promise<string> {
		const payload = this.validarToken(token);
		const usuario = await this.authRepository.buscarUsuarioPorIdSimples(
			payload.userId,
		);

		if (!usuario) throw new Error('Usuário não encontrado');

		return this.gerarToken(usuario);
	}

	async buscarDadosUsuario(userId: string): Promise<object> {
		const usuario = await this.authRepository.buscarUsuarioPorId(userId);

		if (!usuario) throw new Error('Usuário não encontrado');

		const permissoes =
			await this.permissoesService.buscarPermissoesDoUsuario(userId);
		const temConsultaTodos =
			await this.permissoesService.verificarConsultaTodos(userId);

		return {
			id: usuario.id,
			nome: usuario.nome,
			email: usuario.email,
			grupos: (usuario.usuarioGrupos ?? []).map((ug) => ug.grupo),
			permissoes,
			temConsultaTodos,
		};
	}
}
