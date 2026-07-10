import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Docente } from './docente.entity';
import { PalavraChave } from './palavra-chave.entity';

@Entity({ name: 'docente_palavra_chave', schema: 'public' })
export class DocentePalavraChave {
	@PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
	codigoDocente: string;

	@PrimaryColumn({ name: 'id_palavra_chave', type: 'int' })
	idPalavraChave: number;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Docente, (docente) => docente.docentesPalavraChave)
	@JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
	docente: Docente;

	@ManyToOne(() => PalavraChave, (pk) => pk.docentesPalavraChave)
	@JoinColumn({ name: 'id_palavra_chave' })
	palavraChave: PalavraChave;
}
