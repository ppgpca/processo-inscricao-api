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
import { Documento } from './documento.entity';
import { Edital } from './edital.entity';

@Entity({ name: 'tipo_documento_edital', schema: 'public' })
export class TipoDocumentoEdital {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'id_edital', type: 'int', nullable: false })
	idEdital: number;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'text', nullable: true })
	descricao: string | null;

	@Column({ type: 'boolean', nullable: false })
	obrigatorio: boolean;

	@Column({ type: 'int', nullable: false })
	ordem: number;

	@Column({ type: 'boolean', nullable: false })
	ativo: boolean;

	@Column({ name: 'padrao_nome', type: 'varchar', nullable: false })
	padraoNome: string;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Edital, (edital) => edital.tiposDocumento)
	@JoinColumn({ name: 'id_edital' })
	edital: Relation<Edital>;

	@OneToMany(() => Documento, (doc) => doc.tipoDocumentoEdital)
	documentos: Documento[];
}
