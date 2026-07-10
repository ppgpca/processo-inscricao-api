import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidato } from '../database/entities/candidato.entity';
import { CreateCandidatoDto } from './dto/create-candidato.dto';
import { UpdateCandidatoDto } from './dto/update-candidato.dto';

@Injectable()
export class CandidatoRepository {
  constructor(
    @InjectRepository(Candidato)
    private readonly repo: Repository<Candidato>,
  ) {}

  async obterPorCpf(cpf: string): Promise<Candidato | null> {
    return this.repo.findOne({ where: { cpf } });
  }

  async criar(dados: CreateCandidatoDto): Promise<Candidato> {
    const candidato = this.repo.create({
      cpf: dados.cpf,
      nome: dados.nome,
      dataNascimento: dados.dataNascimento,
      rg: dados.rg ?? null,
      telefone: dados.telefone ?? null,
      celular: dados.celular ?? null,
      email: dados.email,
      email2: dados.email2 ?? null,
      enderecoRua: dados.enderecoRua ?? null,
      enderecoNum: dados.enderecoNum ?? null,
      enderecoBairro: dados.enderecoBairro ?? null,
      enderecoCidade: dados.enderecoCidade ?? null,
      enderecoEstado: dados.enderecoEstado ?? null,
      enderecoCep: dados.enderecoCep ?? null,
    });
    return this.repo.save(candidato);
  }

  async atualizar(cpf: string, dados: UpdateCandidatoDto): Promise<Candidato | null> {
    const candidato = await this.repo.findOne({ where: { cpf } });
    if (!candidato) return null;
    Object.assign(candidato, dados);
    return this.repo.save(candidato);
  }
}
