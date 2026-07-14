import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { CategoriaPermissao } from './categoria-permissao.entity';
import { GrupoPermissao } from './grupo-permissao.entity';

@Entity({ name: 'permissoes', schema: 'public' })
export class Permissao {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'varchar', nullable: true })
	descricao: string | null;

	@Column({
		name: 'codigo_categoria_permissao',
		type: 'varchar',
		nullable: false,
	})
	codigoCategoriaPermissao: string;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => CategoriaPermissao, (cat) => cat.permissoes)
	@JoinColumn({
		name: 'codigo_categoria_permissao',
		referencedColumnName: 'codigo',
	})
	categoria: CategoriaPermissao;

	@OneToMany(() => GrupoPermissao, (gp) => gp.permissao)
	grupoPermissoes: GrupoPermissao[];
}
