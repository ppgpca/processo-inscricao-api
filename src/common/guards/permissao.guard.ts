import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissoesService } from '../../auth/permissoes.service';
import { PERMISSOES_KEY } from '../decorators/permissoes.decorator';

@Injectable()
export class PermissaoGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly permissoesService: PermissoesService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const permissoesIds = this.reflector.getAllAndOverride<number[]>(
			PERMISSOES_KEY,
			[context.getHandler(), context.getClass()],
		);

		const gruposIds = this.reflector.getAllAndOverride<number[]>('grupos', [
			context.getHandler(),
			context.getClass(),
		]);

		if (!permissoesIds && !gruposIds) return true;

		const request = context.switchToHttp().getRequest();
		const usuario = request.user as { id: string } | undefined;

		if (!usuario) {
			throw new UnauthorizedException('Usuário não autenticado');
		}

		if (gruposIds?.length) {
			const grupos = await this.permissoesService.buscarGruposDoUsuario(
				usuario.id,
			);
			const autorizado = grupos.some((g) => gruposIds.includes(g.id));
			if (autorizado) return true;
			throw new ForbiddenException('Permissão negada');
		}

		if (permissoesIds?.length) {
			const permissoes =
				await this.permissoesService.buscarPermissoesDoUsuario(
					usuario.id,
				);
			const autorizado = permissoesIds.some((id) =>
				permissoes.some((p) => p.id === id),
			);
			if (autorizado) return true;
			throw new ForbiddenException(
				`Permissão negada: usuário não possui as permissões necessárias (${permissoesIds.join(' ou ')})`,
			);
		}

		throw new ForbiddenException('Acesso negado');
	}
}
