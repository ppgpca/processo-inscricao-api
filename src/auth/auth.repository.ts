import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../database/entities/usuario.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async buscarUsuarioPorId(userId: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({
      where: { id: userId },
      relations: { usuarioGrupos: { grupo: true } },
    });
  }

  async buscarUsuarioPorIdSimples(userId: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { id: userId } });
  }
}
