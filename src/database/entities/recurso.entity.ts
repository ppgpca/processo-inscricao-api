import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { CriterioAvaliacao } from './criterio-avaliacao.entity';
import { EtapaEdital } from './etapa-edital.entity';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'recurso', schema: 'public' })
export class Recurso {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', nullable: true })
	texto: string | null;

	@Column({ name: 'id_criterio_avaliacao', type: 'int', nullable: false })
	idCriterioAvaliacao: number;

	@Column({ name: 'id_etapa_edital', type: 'int', nullable: false })
	idEtapaEdital: number;

	@Column({ name: 'id_inscricao', type: 'int', nullable: false })
	idInscricao: number;

	@Column({ type: 'boolean', nullable: true })
	deferido: boolean | null;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => CriterioAvaliacao, (criterio) => criterio.recursos)
	@JoinColumn({ name: 'id_criterio_avaliacao' })
	criterioAvaliacao: Relation<CriterioAvaliacao>;

	@ManyToOne(() => EtapaEdital, (etapa) => etapa.recursos)
	@JoinColumn({ name: 'id_etapa_edital' })
	etapaEdital: Relation<EtapaEdital>;

	@ManyToOne(() => Inscricao, (inscricao) => inscricao.recursos)
	@JoinColumn({ name: 'id_inscricao' })
	inscricao: Relation<Inscricao>;
}
