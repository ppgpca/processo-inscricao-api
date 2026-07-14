import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Edital } from './edital.entity';

@Entity({ name: 'etapa_edital', schema: 'public' })
export class EtapaEdital {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'id_edital', type: 'int', nullable: false })
	idEdital: number;

	@Column({ type: 'varchar', nullable: false })
	sigla: string;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'int', nullable: false })
	ordem: number;

	@Column({ name: 'data_inicio', type: 'timestamptz', nullable: false })
	dataInicio: Date;

	@Column({ name: 'data_fim', type: 'timestamptz', nullable: true })
	dataFim: Date | null;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Edital, (edital) => edital.etapas)
	@JoinColumn({ name: 'id_edital' })
	edital: Edital;
}
