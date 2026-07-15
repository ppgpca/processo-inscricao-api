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
import { EtapaEdital } from './etapa-edital.entity';
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

	@Column({ name: 'vagas_total', type: 'int', nullable: false })
	vagasTotal: number;

	/** Derivado da etapa INSCRICAO: início da etapa de inscrições. */
	get dataInicioInscricao(): Date | null {
		return (
			this.etapas?.find((e) => e.sigla === 'INSCRICAO')?.dataInicio ??
			null
		);
	}

	/** Derivado da etapa INSCRICAO: fim da etapa de inscrições. */
	get dataFimInscricao(): Date | null {
		return (
			this.etapas?.find((e) => e.sigla === 'INSCRICAO')?.dataFim ?? null
		);
	}

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

	@OneToMany(() => EtapaEdital, (etapa) => etapa.edital)
	etapas: EtapaEdital[];
}
