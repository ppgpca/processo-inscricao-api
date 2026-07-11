import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Docente } from './docente.entity';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'alocacao_orientador', schema: 'public' })
export class AlocacaoOrientador {
	@PrimaryColumn({ name: 'id_inscricao', type: 'int' })
	idInscricao: number;

	@PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
	codigoDocente: string;

	@Column({ name: 'data_alocacao', type: 'timestamptz', nullable: false })
	dataAlocacao: Date;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@OneToOne(() => Inscricao, (inscricao) => inscricao.alocacaoOrientador)
	@JoinColumn({ name: 'id_inscricao' })
	inscricao: Inscricao;

	@ManyToOne(() => Docente, (docente) => docente.alocacoesOrientador)
	@JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
	docente: Docente;
}
