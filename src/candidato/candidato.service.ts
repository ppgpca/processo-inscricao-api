import { Injectable, NotFoundException } from '@nestjs/common';
import { Candidato } from '../database/entities/candidato.entity';
import { CandidatoRepository } from './candidato.repository';
import { CreateCandidatoDto } from './dto/create-candidato.dto';
import { UpdateCandidatoDto } from './dto/update-candidato.dto';

@Injectable()
export class CandidatoService {
  constructor(private readonly candidatoRepository: CandidatoRepository) {}

  async obterPorCpf(cpf: string): Promise<Candidato> {
    const candidato = await this.candidatoRepository.obterPorCpf(cpf);
    if (!candidato) {
      throw new NotFoundException(`Candidato com CPF ${cpf} não encontrado.`);
    }
    return candidato;
  }

  async criar(dto: CreateCandidatoDto): Promise<Candidato> {
    return this.candidatoRepository.criar(dto);
  }

  async atualizar(cpf: string, dto: UpdateCandidatoDto): Promise<Candidato> {
    const candidato = await this.candidatoRepository.atualizar(cpf, dto);
    if (!candidato) {
      throw new NotFoundException(`Candidato com CPF ${cpf} não encontrado.`);
    }
    return candidato;
  }

  async upsert(dto: CreateCandidatoDto): Promise<Candidato> {
    const existing = await this.candidatoRepository.obterPorCpf(dto.cpf);
    if (existing) {
      return this.atualizar(dto.cpf, dto);
    }
    return this.criar(dto);
  }
}
