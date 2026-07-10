import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinhaPesquisa } from '../database/entities/linha-pesquisa.entity';

@Injectable()
export class LinhaPesquisaRepository {
  constructor(
    @InjectRepository(LinhaPesquisa)
    private readonly repo: Repository<LinhaPesquisa>,
  ) {}

  async obterAtivas(): Promise<LinhaPesquisa[]> {
    return this.repo.find({ where: { ativa: true }, order: { nome: 'ASC' } });
  }

  async obterPorId(id: number): Promise<LinhaPesquisa | null> {
    return this.repo.findOne({ where: { id } });
  }
}
