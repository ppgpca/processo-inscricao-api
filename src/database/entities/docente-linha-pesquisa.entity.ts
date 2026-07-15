import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Docente } from './docente.entity';
import { LinhaPesquisa } from './linha-pesquisa.entity';

@Entity({ name: 'docente_linha_pesquisa', schema: 'public' })
export class DocenteLinhaPesquisa {
	@PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
	codigoDocente: string;

	@PrimaryColumn({ name: 'id_linha_pesquisa', type: 'int' })
	idLinhaPesquisa: number;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Docente, (docente) => docente.linhasPesquisa)
	@JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
	docente: Relation<Docente>;

	@ManyToOne(() => LinhaPesquisa, (lp) => lp.docentesLinhaPesquisa)
	@JoinColumn({ name: 'id_linha_pesquisa' })
	linhaPesquisa: Relation<LinhaPesquisa>;
}
