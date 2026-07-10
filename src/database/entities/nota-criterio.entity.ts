import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { CriterioAvaliacao } from './criterio-avaliacao.entity';

@Entity({ name: 'nota_criterio', schema: 'public' })
export class NotaCriterio {
	@PrimaryColumn({ name: 'id_criterio_avaliacao', type: 'int' })
	idCriterioAvaliacao: number;

	@PrimaryColumn({ name: 'id_inscricao', type: 'int' })
	idInscricao: number;

	@PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
	codigoDocente: string;

	@Column({ type: 'decimal', nullable: false })
	nota: number;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => CriterioAvaliacao, (criterio) => criterio.notasCriterio)
	@JoinColumn({ name: 'id_criterio_avaliacao' })
	criterioAvaliacao: CriterioAvaliacao;
}
