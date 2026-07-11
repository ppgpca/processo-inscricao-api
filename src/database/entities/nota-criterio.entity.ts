import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CriterioAvaliacao } from './criterio-avaliacao.entity';
import { Docente } from './docente.entity';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'nota_criterio', schema: 'public' })
export class NotaCriterio {
	@PrimaryColumn({ name: 'id_inscricao', type: 'int' })
	idInscricao: number;

	@PrimaryColumn({ name: 'id_criterio_avaliacao', type: 'int' })
	idCriterioAvaliacao: number;

	@PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
	codigoDocente: string;

	@Column({ type: 'text', nullable: true })
	comentario: string | null;

	@Column({ type: 'decimal', nullable: false })
	nota: number;

	@ManyToOne(() => Inscricao, (inscricao) => inscricao.notasCriterio)
	@JoinColumn({ name: 'id_inscricao' })
	inscricao: Inscricao;

	@ManyToOne(() => CriterioAvaliacao, (criterio) => criterio.notasCriterio)
	@JoinColumn({ name: 'id_criterio_avaliacao' })
	criterioAvaliacao: CriterioAvaliacao;

	@ManyToOne(() => Docente, (docente) => docente.notasCriterio)
	@JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
	docente: Docente;
}
