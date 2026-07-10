import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UsuarioGrupo } from './usuario-grupo.entity';

@Entity({ name: 'usuario', schema: 'public' })
export class Usuario {
	@PrimaryColumn({ type: 'varchar' })
	id: string;

	@Column({ type: 'varchar', nullable: true })
	nome: string | null;

	@Column({ type: 'varchar', nullable: true })
	email: string | null;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@OneToMany(() => UsuarioGrupo, (ug) => ug.usuario)
	usuarioGrupos: UsuarioGrupo[];
}
