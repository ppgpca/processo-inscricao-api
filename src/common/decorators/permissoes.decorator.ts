import { SetMetadata } from '@nestjs/common';

export const PERMISSOES_KEY = 'permissoes';

export const Permissoes = (...ids: number[]) => SetMetadata(PERMISSOES_KEY, ids);

export const Grupos = (...ids: number[]) => SetMetadata('grupos', ids);
