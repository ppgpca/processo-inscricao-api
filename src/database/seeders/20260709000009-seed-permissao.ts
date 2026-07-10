import { DataSource } from 'typeorm';
import { Permissao } from '../entities/permissao.entity';
import { Seeder } from './seeder.interface';

export class SeedPermissao20260709000009 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(Permissao).insert([
			// EDITAL (1–5)
			{
				id: 1,
				codigo: 'VISUALIZAR_EDITAL',
				descricao: 'Visualizar edital',
				codigoCategoriaPermissao: 'EDITAL',
			},
			{
				id: 2,
				codigo: 'VISUALIZAR_TODOS_EDITAIS',
				descricao: 'Visualizar todos os editais',
				codigoCategoriaPermissao: 'EDITAL',
			},
			{
				id: 3,
				codigo: 'CRIAR_EDITAL',
				descricao: 'Criar edital',
				codigoCategoriaPermissao: 'EDITAL',
			},
			{
				id: 4,
				codigo: 'EDITAR_EDITAL',
				descricao: 'Editar edital',
				codigoCategoriaPermissao: 'EDITAL',
			},
			{
				id: 5,
				codigo: 'DELETAR_EDITAL',
				descricao: 'Deletar edital',
				codigoCategoriaPermissao: 'EDITAL',
			},

			// INSCRICAO (6–10)
			{
				id: 6,
				codigo: 'VISUALIZAR_INSCRICAO',
				descricao: 'Visualizar inscrição',
				codigoCategoriaPermissao: 'INSCRICAO',
			},
			{
				id: 7,
				codigo: 'VISUALIZAR_TODAS_INSCRICOES',
				descricao: 'Visualizar todas as inscrições',
				codigoCategoriaPermissao: 'INSCRICAO',
			},
			{
				id: 8,
				codigo: 'CRIAR_INSCRICAO',
				descricao: 'Criar inscrição',
				codigoCategoriaPermissao: 'INSCRICAO',
			},
			{
				id: 9,
				codigo: 'EDITAR_INSCRICAO',
				descricao: 'Editar inscrição',
				codigoCategoriaPermissao: 'INSCRICAO',
			},
			{
				id: 10,
				codigo: 'DELETAR_INSCRICAO',
				descricao: 'Deletar inscrição',
				codigoCategoriaPermissao: 'INSCRICAO',
			},

			// CANDIDATO (11–15)
			{
				id: 11,
				codigo: 'VISUALIZAR_CANDIDATO',
				descricao: 'Visualizar candidato',
				codigoCategoriaPermissao: 'CANDIDATO',
			},
			{
				id: 12,
				codigo: 'VISUALIZAR_TODOS_CANDIDATOS',
				descricao: 'Visualizar todos os candidatos',
				codigoCategoriaPermissao: 'CANDIDATO',
			},
			{
				id: 13,
				codigo: 'CRIAR_CANDIDATO',
				descricao: 'Criar candidato',
				codigoCategoriaPermissao: 'CANDIDATO',
			},
			{
				id: 14,
				codigo: 'EDITAR_CANDIDATO',
				descricao: 'Editar candidato',
				codigoCategoriaPermissao: 'CANDIDATO',
			},
			{
				id: 15,
				codigo: 'DELETAR_CANDIDATO',
				descricao: 'Deletar candidato',
				codigoCategoriaPermissao: 'CANDIDATO',
			},

			// DOCUMENTO (16–20)
			{
				id: 16,
				codigo: 'VISUALIZAR_DOCUMENTO',
				descricao: 'Visualizar documento',
				codigoCategoriaPermissao: 'DOCUMENTO',
			},
			{
				id: 17,
				codigo: 'VISUALIZAR_TODOS_DOCUMENTOS',
				descricao: 'Visualizar todos os documentos',
				codigoCategoriaPermissao: 'DOCUMENTO',
			},
			{
				id: 18,
				codigo: 'CRIAR_DOCUMENTO',
				descricao: 'Criar documento',
				codigoCategoriaPermissao: 'DOCUMENTO',
			},
			{
				id: 19,
				codigo: 'EDITAR_DOCUMENTO',
				descricao: 'Editar documento',
				codigoCategoriaPermissao: 'DOCUMENTO',
			},
			{
				id: 20,
				codigo: 'DELETAR_DOCUMENTO',
				descricao: 'Deletar documento',
				codigoCategoriaPermissao: 'DOCUMENTO',
			},

			// LINHA-PESQUISA (21–25)
			{
				id: 21,
				codigo: 'VISUALIZAR_LINHA_PESQUISA',
				descricao: 'Visualizar linha de pesquisa',
				codigoCategoriaPermissao: 'LINHA-PESQUISA',
			},
			{
				id: 22,
				codigo: 'VISUALIZAR_TODAS_LINHAS_PESQUISA',
				descricao: 'Visualizar todas as linhas de pesquisa',
				codigoCategoriaPermissao: 'LINHA-PESQUISA',
			},
			{
				id: 23,
				codigo: 'CRIAR_LINHA_PESQUISA',
				descricao: 'Criar linha de pesquisa',
				codigoCategoriaPermissao: 'LINHA-PESQUISA',
			},
			{
				id: 24,
				codigo: 'EDITAR_LINHA_PESQUISA',
				descricao: 'Editar linha de pesquisa',
				codigoCategoriaPermissao: 'LINHA-PESQUISA',
			},
			{
				id: 25,
				codigo: 'DELETAR_LINHA_PESQUISA',
				descricao: 'Deletar linha de pesquisa',
				codigoCategoriaPermissao: 'LINHA-PESQUISA',
			},

			// DOCENTE (26–30)
			{
				id: 26,
				codigo: 'VISUALIZAR_DOCENTE',
				descricao: 'Visualizar docente',
				codigoCategoriaPermissao: 'DOCENTE',
			},
			{
				id: 27,
				codigo: 'VISUALIZAR_TODOS_DOCENTES',
				descricao: 'Visualizar todos os docentes',
				codigoCategoriaPermissao: 'DOCENTE',
			},
			{
				id: 28,
				codigo: 'CRIAR_DOCENTE',
				descricao: 'Criar docente',
				codigoCategoriaPermissao: 'DOCENTE',
			},
			{
				id: 29,
				codigo: 'EDITAR_DOCENTE',
				descricao: 'Editar docente',
				codigoCategoriaPermissao: 'DOCENTE',
			},
			{
				id: 30,
				codigo: 'DELETAR_DOCENTE',
				descricao: 'Deletar docente',
				codigoCategoriaPermissao: 'DOCENTE',
			},
		]);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.getRepository(Permissao).delete({});
	}
}
