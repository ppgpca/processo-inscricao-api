import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	InternalServerErrorException,
	Post,
	Request,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		try {
			const resultado = await this.authService.fazerLogin(
				dto.userId,
				dto.senha,
			);
			return { message: 'Login realizado com sucesso', ...resultado };
		} catch (error) {
			const msg = (error as Error).message;
			if (
				msg === 'Usuário não encontrado' ||
				msg === 'Credenciais inválidas' ||
				msg === 'Senha incorreta'
			) {
				throw new UnauthorizedException(
					'ID do usuário ou senha incorretos',
				);
			}
			if (msg === 'Senha é obrigatória') {
				throw new UnauthorizedException('Senha é obrigatória');
			}
			throw new InternalServerErrorException('Erro interno do servidor');
		}
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Body() dto: RefreshTokenDto) {
		try {
			const token = await this.authService.renovarToken(dto.token);
			return { message: 'Token renovado com sucesso', token };
		} catch {
			throw new UnauthorizedException('Token inválido ou expirado');
		}
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	async getMe(@Request() req: { user: { id: string } }) {
		try {
			const usuario = await this.authService.buscarDadosUsuario(
				req.user.id,
			);
			return {
				message: 'Dados do usuário recuperados com sucesso',
				usuario,
			};
		} catch {
			throw new InternalServerErrorException('Erro interno do servidor');
		}
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	logout() {
		return { message: 'Logout realizado com sucesso' };
	}

	@Post('validate')
	@HttpCode(HttpStatus.OK)
	validate(@Body() dto: ValidateTokenDto) {
		try {
			const payload = this.authService.validarToken(
				dto.token,
			) as unknown as {
				userId: string;
				nome: string;
				exp: number;
			};
			return {
				message: 'Token válido',
				payload: {
					userId: payload.userId,
					nome: payload.nome,
					exp: payload.exp,
				},
			};
		} catch {
			throw new UnauthorizedException('Token inválido ou expirado');
		}
	}
}
