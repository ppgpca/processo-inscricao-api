import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { DocentePalavraChave } from './docente-palavra-chave.entity';
import { InscricaoPalavraChave } from './inscricao-palavra-chave.entity';

@Entity({ name: 'palavra_chave', schema: 'public' })
export class PalavraChave {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', nullable: false })
	palavra: string;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@OneToMany(() => InscricaoPalavraChave, (ipk) => ipk.palavraChave)
	inscricoesPalavraChave: InscricaoPalavraChave[];

	@OneToMany(() => DocentePalavraChave, (dpk) => dpk.palavraChave)
	docentesPalavraChave: DocentePalavraChave[];
}
