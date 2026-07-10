import { DataSource, DeepPartial } from 'typeorm';
import { GrupoPermissao } from '../entities/grupo-permissao.entity';
import { Seeder } from './seeder.interface';

export class SeedGrupoPermissao20260709000011 implements Seeder {
  async up(dataSource: DataSource): Promise<void> {
    // Admin (grupo 1): todas as permissões (1–30)
    const adminPermissoes: DeepPartial<GrupoPermissao>[] = Array.from(
      { length: 30 },
      (_, i) => ({ idGrupo: 1, idPermissao: i + 1 }),
    );

    // Docente (grupo 2): leitura de editais, todas as inscrições,
    // todos os candidatos, todos os documentos, linhas de pesquisa e docentes.
    const docentePermissoesIds = [
      1, 2,       // EDITAL: visualizar, visualizar todos
      7,          // INSCRICAO: visualizar todas
      12,         // CANDIDATO: visualizar todos
      17,         // DOCUMENTO: visualizar todos
      21, 22,     // LINHA_PESQUISA: visualizar, visualizar todas
      26, 27, 29, // DOCENTE: visualizar, visualizar todos, editar
    ];
    const docentePermissoes: DeepPartial<GrupoPermissao>[] = docentePermissoesIds.map(
      (id) => ({ idGrupo: 2, idPermissao: id }),
    );

    // Candidato (grupo 3): gerenciar a própria inscrição e documentos.
    const candidatoPermissoesIds = [
      1,          // EDITAL: visualizar
      6, 8, 9,    // INSCRICAO: visualizar, criar, editar
      11, 13, 14, // CANDIDATO: visualizar, criar, editar
      16, 18, 19, // DOCUMENTO: visualizar, criar, editar
      21,         // LINHA_PESQUISA: visualizar
    ];
    const candidatoPermissoes: DeepPartial<GrupoPermissao>[] = candidatoPermissoesIds.map(
      (id) => ({ idGrupo: 3, idPermissao: id }),
    );

    await dataSource.manager.save(GrupoPermissao, [
      ...adminPermissoes,
      ...docentePermissoes,
      ...candidatoPermissoes,
    ]);
  }

  async down(dataSource: DataSource): Promise<void> {
    await dataSource.getRepository(GrupoPermissao).delete({});
  }
}
