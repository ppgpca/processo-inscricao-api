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
import { Edital } from './edital.entity';

@Entity({ name: 'docente_edital', schema: 'public' })
export class DocenteEdital {
	@PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
	codigoDocente: string;

	@PrimaryColumn({ name: 'id_edital', type: 'int' })
	idEdital: number;

	@Column({ type: 'boolean', nullable: false })
	avaliador: boolean;

	@Column({ type: 'boolean', nullable: false })
	orientador: boolean;

	@Column({ name: 'vagas_orientacao', type: 'int', nullable: true })
	vagasOrientacao: number | null;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Docente, (docente) => docente.docentesEdital)
	@JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
	docente: Docente;

	@ManyToOne(() => Edital, (edital) => edital.docentesEdital)
	@JoinColumn({ name: 'id_edital' })
	edital: Edital;
}
