import { DataSource } from 'typeorm';
import { CategoriaPermissao } from '../entities/categoria-permissao.entity';
import { Seeder } from './seeder.interface';

export class SeedCategoriaPermissao20260709000008 implements Seeder {
  async up(dataSource: DataSource): Promise<void> {
    await dataSource.getRepository(CategoriaPermissao).insert([
      { codigo: 'EDITAL',         descricao: 'Tela de editais do processo de seleção.' },
      { codigo: 'INSCRICAO',      descricao: 'Tela de inscrições.' },
      { codigo: 'CANDIDATO',      descricao: 'Tela de candidatos.' },
      { codigo: 'DOCUMENTO',      descricao: 'Tela de documentos de inscrição.' },
      { codigo: 'LINHA-PESQUISA', descricao: 'Tela de linhas de pesquisa.' },
      { codigo: 'DOCENTE',        descricao: 'Tela de docentes orientadores.' },
    ]);
  }

  async down(dataSource: DataSource): Promise<void> {
    await dataSource.getRepository(CategoriaPermissao).delete({});
  }
}
