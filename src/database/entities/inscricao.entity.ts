import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { AlocacaoOrientador } from './alocacao-orientador.entity';
import { Candidato } from './candidato.entity';
import { Documento } from './documento.entity';
import { Edital } from './edital.entity';
import { EtapaEdital } from './etapa-edital.entity';
import { InscricaoPalavraChave } from './inscricao-palavra-chave.entity';
import { LinhaPesquisa } from './linha-pesquisa.entity';
import { NotaCriterio } from './nota-criterio.entity';
import { PreferenciaOrientador } from './preferencia-orientador.entity';
import { Recurso } from './recurso.entity';

@Entity({ name: 'inscricao', schema: 'public' })
export class Inscricao {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', nullable: false })
	cpf: string;

	@Column({ name: 'id_edital', type: 'int', nullable: false })
	idEdital: number;

	@Column({ name: 'id_linha_pesquisa', type: 'int', nullable: false })
	idLinhaPesquisa: number;

	@Column({ type: 'boolean', nullable: false, default: true })
	ativa: boolean;

	@Column({ name: 'area_concentracao', type: 'varchar', nullable: true })
	areaConcentracao: string | null;

	@Column({ name: 'projeto_pesquisa', type: 'text', nullable: true })
	projetoPesquisa: string | null;

	@Column({ name: 'dados_complementares', type: 'jsonb', nullable: true })
	dadosComplementares: Record<string, unknown> | null;

	@Column({ name: 'nota_final', type: 'decimal', nullable: true })
	notaFinal: number | null;

	@Column({ name: 'posicao_ranking', type: 'int', nullable: true })
	posicaoRanking: number | null;

	@Column({ type: 'boolean', nullable: true })
	deficiente: boolean | null;

	@Column({ type: 'boolean', nullable: true })
	indigena: boolean | null;

	@Column({ name: 'preto_pardo', type: 'boolean', nullable: true })
	pretoPardo: boolean | null;

	@Column({ name: 'id_etapa_atual', type: 'int', nullable: false })
	idEtapaAtual: number;

	@Column({ type: 'boolean', nullable: true, default: null })
	deferida: boolean | null;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Candidato, (candidato) => candidato.inscricoes)
	@JoinColumn({ name: 'cpf', referencedColumnName: 'cpf' })
	candidato: Relation<Candidato>;

	@ManyToOne(() => Edital, (edital) => edital.inscricoes)
	@JoinColumn({ name: 'id_edital' })
	edital: Relation<Edital>;

	@ManyToOne(() => LinhaPesquisa, (lp) => lp.inscricoes)
	@JoinColumn({ name: 'id_linha_pesquisa' })
	linhaPesquisa: Relation<LinhaPesquisa>;

	@ManyToOne(() => EtapaEdital, { nullable: false, eager: false })
	@JoinColumn({ name: 'id_etapa_atual' })
	etapaAtual: Relation<EtapaEdital>;

	@OneToMany(() => Documento, (doc) => doc.inscricao)
	documentos: Documento[];

	@OneToMany(() => PreferenciaOrientador, (po) => po.inscricao)
	preferenciasOrientador: PreferenciaOrientador[];

	@OneToOne(() => AlocacaoOrientador, (ao) => ao.inscricao)
	alocacaoOrientador: Relation<AlocacaoOrientador>;

	@OneToMany(() => InscricaoPalavraChave, (ipk) => ipk.inscricao)
	inscricoesPalavraChave: InscricaoPalavraChave[];

	@OneToMany(() => NotaCriterio, (nc) => nc.inscricao)
	notasCriterio: NotaCriterio[];

	@OneToMany(() => Recurso, (recurso) => recurso.inscricao)
	recursos: Recurso[];
}
