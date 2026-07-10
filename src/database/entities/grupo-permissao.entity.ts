import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Grupo } from './grupo.entity';
import { Permissao } from './permissao.entity';

@Entity({ name: 'grupo_permissao', schema: 'public' })
export class GrupoPermissao {
	@PrimaryColumn({ name: 'id_grupo', type: 'int' })
	idGrupo: number;

	@PrimaryColumn({ name: 'id_permissao', type: 'int' })
	idPermissao: number;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Grupo, (grupo) => grupo.grupoPermissoes)
	@JoinColumn({ name: 'id_grupo' })
	grupo: Grupo;

	@ManyToOne(() => Permissao, (permissao) => permissao.grupoPermissoes)
	@JoinColumn({ name: 'id_permissao' })
	permissao: Permissao;
}
