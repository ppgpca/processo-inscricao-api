import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';

export class SeedPermissao20260709000009 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.query(`
			INSERT INTO public.permissao (id, codigo, descricao, codigo_categoria_permissao)
			VALUES
				(1, 'VISUALIZAR_EDITAL', 'Visualizar edital', 'EDITAL'),
				(2, 'VISUALIZAR_TODOS_EDITAIS', 'Visualizar todos os editais', 'EDITAL'),
				(3, 'CRIAR_EDITAL', 'Criar edital', 'EDITAL'),
				(4, 'EDITAR_EDITAL', 'Editar edital', 'EDITAL'),
				(5, 'DELETAR_EDITAL', 'Deletar edital', 'EDITAL'),
				(6, 'VISUALIZAR_INSCRICAO', 'Visualizar inscrição', 'INSCRICAO'),
				(7, 'VISUALIZAR_TODAS_INSCRICOES', 'Visualizar todas as inscrições', 'INSCRICAO'),
				(8, 'CRIAR_INSCRICAO', 'Criar inscrição', 'INSCRICAO'),
				(9, 'EDITAR_INSCRICAO', 'Editar inscrição', 'INSCRICAO'),
				(10, 'DELETAR_INSCRICAO', 'Deletar inscrição', 'INSCRICAO'),
				(11, 'VISUALIZAR_CANDIDATO', 'Visualizar candidato', 'CANDIDATO'),
				(12, 'VISUALIZAR_TODOS_CANDIDATOS', 'Visualizar todos os candidatos', 'CANDIDATO'),
				(13, 'CRIAR_CANDIDATO', 'Criar candidato', 'CANDIDATO'),
				(14, 'EDITAR_CANDIDATO', 'Editar candidato', 'CANDIDATO'),
				(15, 'DELETAR_CANDIDATO', 'Deletar candidato', 'CANDIDATO'),
				(16, 'VISUALIZAR_DOCUMENTO', 'Visualizar documento', 'DOCUMENTO'),
				(17, 'VISUALIZAR_TODOS_DOCUMENTOS', 'Visualizar todos os documentos', 'DOCUMENTO'),
				(18, 'CRIAR_DOCUMENTO', 'Criar documento', 'DOCUMENTO'),
				(19, 'EDITAR_DOCUMENTO', 'Editar documento', 'DOCUMENTO'),
				(20, 'DELETAR_DOCUMENTO', 'Deletar documento', 'DOCUMENTO'),
				(21, 'VISUALIZAR_LINHA_PESQUISA', 'Visualizar linha de pesquisa', 'LINHA-PESQUISA'),
				(22, 'VISUALIZAR_TODAS_LINHAS_PESQUISA', 'Visualizar todas as linhas de pesquisa', 'LINHA-PESQUISA'),
				(23, 'CRIAR_LINHA_PESQUISA', 'Criar linha de pesquisa', 'LINHA-PESQUISA'),
				(24, 'EDITAR_LINHA_PESQUISA', 'Editar linha de pesquisa', 'LINHA-PESQUISA'),
				(25, 'DELETAR_LINHA_PESQUISA', 'Deletar linha de pesquisa', 'LINHA-PESQUISA'),
				(26, 'VISUALIZAR_DOCENTE', 'Visualizar docente', 'DOCENTE'),
				(27, 'VISUALIZAR_TODOS_DOCENTES', 'Visualizar todos os docentes', 'DOCENTE'),
				(28, 'CRIAR_DOCENTE', 'Criar docente', 'DOCENTE'),
				(29, 'EDITAR_DOCENTE', 'Editar docente', 'DOCENTE'),
				(30, 'DELETAR_DOCENTE', 'Deletar docente', 'DOCENTE')
		`);
		await dataSource.query(`SELECT setval('permissao_id_seq', 30, true)`);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource.query(`DELETE FROM public.permissao`);
		await dataSource.query(`SELECT setval('permissao_id_seq', 1, false)`);
	}
}
