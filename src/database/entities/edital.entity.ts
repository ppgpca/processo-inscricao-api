import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { CriterioAvaliacao } from './criterio-avaliacao.entity';
import { DocenteEdital } from './docente-edital.entity';
import { Inscricao } from './inscricao.entity';
import { TipoDocumentoEdital } from './tipo-documento-edital.entity';

@Entity({ name: 'edital', schema: 'public' })
export class Edital {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', nullable: false })
	numero: string;

	@Column({ type: 'varchar', nullable: false })
	titulo: string;

	@Column({ type: 'text', nullable: true })
	descricao: string | null;

	@Column({ type: 'int', nullable: false })
	ano: number;

	@Column({
		name: 'data_inicio_inscricao',
		type: 'timestamptz',
		nullable: false,
	})
	dataInicioInscricao: Date;

	@Column({
		name: 'data_fim_inscricao',
		type: 'timestamptz',
		nullable: false,
	})
	dataFimInscricao: Date;

	@Column({
		name: 'data_inicio_avaliacao',
		type: 'timestamptz',
		nullable: true,
	})
	dataInicioAvaliacao: Date | null;

	@Column({ name: 'data_fim_avaliacao', type: 'timestamptz', nullable: true })
	dataFimAvaliacao: Date | null;

	@Column({
		name: 'data_divulgacao_resultado',
		type: 'timestamptz',
		nullable: true,
	})
	dataDivulgacaoResultado: Date | null;

	@Column({
		name: 'data_inicio_preferencia_orientador',
		type: 'timestamptz',
		nullable: true,
	})
	dataInicioPreferenciaOrientador: Date | null;

	@Column({
		name: 'data_fim_preferencia_orientador',
		type: 'timestamptz',
		nullable: true,
	})
	dataFimPreferenciaOrientador: Date | null;

	@Column({ name: 'vagas_total', type: 'int', nullable: false })
	vagasTotal: number;

	@Column({ type: 'varchar', nullable: false, default: 'rascunho' })
	status: string;

	@Column({ name: 'url_edital_pdf', type: 'varchar', nullable: true })
	urlEditalPdf: string | null;

	@Column({ type: 'boolean', nullable: false })
	ativo: boolean;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@OneToMany(() => CriterioAvaliacao, (criterio) => criterio.edital)
	criteriosAvaliacao: CriterioAvaliacao[];

	@OneToMany(() => TipoDocumentoEdital, (tipo) => tipo.edital)
	tiposDocumento: TipoDocumentoEdital[];

	@OneToMany(() => Inscricao, (inscricao) => inscricao.edital)
	inscricoes: Inscricao[];

	@OneToMany(() => DocenteEdital, (docenteEdital) => docenteEdital.edital)
	docentesEdital: DocenteEdital[];
}
