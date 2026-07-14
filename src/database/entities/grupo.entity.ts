import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { GrupoPermissao } from './grupo-permissao.entity';
import { UsuarioGrupo } from './usuario-grupo.entity';

@Entity({ name: 'grupo', schema: 'public' })
export class Grupo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'varchar', nullable: true })
	descricao: string | null;

	@Column({ type: 'int', nullable: false, default: 1 })
	sistema: number;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@OneToMany(() => UsuarioGrupo, (ug) => ug.grupo)
	usuarioGrupos: UsuarioGrupo[];

	@OneToMany(() => GrupoPermissao, (gp) => gp.grupo)
	grupoPermissoes: GrupoPermissao[];
}
