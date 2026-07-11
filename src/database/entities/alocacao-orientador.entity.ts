import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
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

	@OneToOne(() => Inscricao, (inscricao) => inscricao.alocacaoOrientador)
	@JoinColumn({ name: 'id_inscricao' })
	inscricao: Inscricao;

	@ManyToOne(() => Docente, (docente) => docente.alocacoesOrientador)
	@JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
	docente: Docente;
}
