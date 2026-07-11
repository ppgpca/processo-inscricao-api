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
import { Edital } from './edital.entity';
import { NotaCriterio } from './nota-criterio.entity';

@Entity({ name: 'criterio_avaliacao', schema: 'public' })
export class CriterioAvaliacao {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'id_edital', type: 'int', nullable: false })
	idEdital: number;

	@Column({ name: 'id_criterio_pai', type: 'int', nullable: true })
	idCriterioPai: number | null;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'text', nullable: true })
	descricao: string | null;

	@Column({ name: 'nota_maxima', type: 'decimal', nullable: false })
	notaMaxima: number;

	@Column({ type: 'decimal', nullable: false })
	peso: number;

	@Column({ type: 'int', nullable: false })
	ordem: number;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Edital, (edital) => edital.criteriosAvaliacao)
	@JoinColumn({ name: 'id_edital' })
	edital: Edital;

	@ManyToOne(() => CriterioAvaliacao, (c) => c.subCriterios, { nullable: true })
	@JoinColumn({ name: 'id_criterio_pai' })
	criterioPai: CriterioAvaliacao | null;

	@OneToMany(() => CriterioAvaliacao, (c) => c.criterioPai)
	subCriterios: CriterioAvaliacao[];

	@OneToMany(() => NotaCriterio, (nc) => nc.criterioAvaliacao)
	notasCriterio: NotaCriterio[];
}
