import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Docente } from './docente.entity';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'distribuicao_avaliacao', schema: 'public' })
export class DistribuicaoAvaliacao {
	@PrimaryColumn({ name: 'id_inscricao', type: 'int' })
	idInscricao: number;

	@PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
	codigoDocente: string;

	@Column({ name: 'nota_final', type: 'decimal', nullable: true })
	notaFinal: number | null;

	@Column({ type: 'boolean', nullable: false, default: false })
	avaliado: boolean;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Inscricao, (inscricao) => inscricao.distribuicoesAvaliacao)
	@JoinColumn({ name: 'id_inscricao' })
	inscricao: Inscricao;

	@ManyToOne(() => Docente, (docente) => docente.distribuicoesAvaliacao)
	@JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
	docente: Docente;
}
