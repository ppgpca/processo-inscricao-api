import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Inscricao } from './inscricao.entity';
import { PalavraChave } from './palavra-chave.entity';

@Entity({ name: 'inscricao_palavra_chave', schema: 'public' })
export class InscricaoPalavraChave {
	@PrimaryColumn({ name: 'id_inscricao', type: 'int' })
	idInscricao: number;

	@PrimaryColumn({ name: 'id_palavra_chave', type: 'int' })
	idPalavraChave: number;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Inscricao, (inscricao) => inscricao.inscricoesPalavraChave)
	@JoinColumn({ name: 'id_inscricao' })
	inscricao: Relation<Inscricao>;

	@ManyToOne(() => PalavraChave, (pk) => pk.inscricoesPalavraChave)
	@JoinColumn({ name: 'id_palavra_chave' })
	palavraChave: Relation<PalavraChave>;
}
