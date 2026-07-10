import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from '../database/entities/grupo.entity';
import { Permissao } from '../database/entities/permissao.entity';
import { Usuario } from '../database/entities/usuario.entity';

@Injectable()
export class PermissoesRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(Permissao)
    private readonly permissaoRepo: Repository<Permissao>,
  ) {}

  async buscarUsuarioComGruposEPermissoes(userId: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({
      where: { id: userId },
      relations: {
        usuarioGrupos: {
          grupo: {
            grupoPermissoes: {
              permissao: true,
            },
          },
        },
      },
    });
  }

  async buscarUsuarioComGrupos(userId: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({
      where: { id: userId },
      relations: { usuarioGrupos: { grupo: true } },
    });
  }

  async buscarTodasPermissoes(): Promise<Permissao[]> {
    return this.permissaoRepo.find({ order: { codigo: 'ASC' } });
  }

  async buscarTodosGrupos(): Promise<Grupo[]> {
    return this.grupoRepo.find({ order: { nome: 'ASC' } });
  }
}
