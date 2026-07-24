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
import type { Relation } from 'typeorm';
import { Edital } from './edital.entity';
import { Recurso } from './recurso.entity';

@Entity({ name: 'etapa_edital', schema: 'public' })
export class EtapaEdital {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'id_edital', type: 'int', nullable: false })
	idEdital: number;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'varchar', nullable: false })
	descricao: string;

	@Column({ type: 'int', nullable: false })
	ordem: number;

	@Column({ name: 'data_inicio', type: 'timestamptz', nullable: false })
	dataInicio: Date;

	@Column({ name: 'data_fim', type: 'timestamptz', nullable: true })
	dataFim: Date | null;

	@Column({ type: 'boolean', nullable: false, default: false })
	recurso: boolean;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Edital, (edital) => edital.etapas)
	@JoinColumn({ name: 'id_edital' })
	edital: Relation<Edital>;

	@OneToMany(() => Recurso, (recurso) => recurso.etapaEdital)
	recursos: Recurso[];
}
