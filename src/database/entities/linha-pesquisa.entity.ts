import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { DocenteLinhaPesquisa } from './docente-linha-pesquisa.entity';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'linha_pesquisa', schema: 'public' })
export class LinhaPesquisa {
	@PrimaryColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'boolean', nullable: true })
	ativa: boolean | null;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@OneToMany(() => Inscricao, (inscricao) => inscricao.linhaPesquisa)
	inscricoes: Inscricao[];

	@OneToMany(() => DocenteLinhaPesquisa, (dlp) => dlp.linhaPesquisa)
	docentesLinhaPesquisa: DocenteLinhaPesquisa[];
}
