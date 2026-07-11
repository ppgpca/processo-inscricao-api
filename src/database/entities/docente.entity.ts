import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { AlocacaoOrientador } from './alocacao-orientador.entity';
import { DocenteEdital } from './docente-edital.entity';
import { DocenteLinhaPesquisa } from './docente-linha-pesquisa.entity';
import { DocentePalavraChave } from './docente-palavra-chave.entity';
import { NotaCriterio } from './nota-criterio.entity';
import { PreferenciaOrientador } from './preferencia-orientador.entity';

@Entity({ name: 'docente', schema: 'public' })
export class Docente {
	@PrimaryColumn({ type: 'varchar' })
	codigo: string;

	@Column({ type: 'varchar', nullable: false })
	nome: string;

	@Column({ type: 'varchar', nullable: false, unique: true })
	email: string;

	@Column({ name: 'usuario_ldap', type: 'varchar', nullable: true })
	usuarioLdap: string | null;

	@Column({ type: 'varchar', nullable: true })
	senha: string | null;

	@Column({ type: 'boolean', nullable: false })
	externo: boolean;

	@Column({ type: 'varchar', nullable: true })
	instituicao: string | null;

	@Column({ type: 'boolean', nullable: false })
	ativo: boolean;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@OneToMany(() => DocenteEdital, (de) => de.docente)
	docentesEdital: DocenteEdital[];

	@OneToMany(() => DocenteLinhaPesquisa, (dlp) => dlp.docente)
	linhasPesquisa: DocenteLinhaPesquisa[];

	@OneToMany(() => PreferenciaOrientador, (po) => po.docente)
	preferenciasOrientador: PreferenciaOrientador[];

	@OneToMany(() => AlocacaoOrientador, (ao) => ao.docente)
	alocacoesOrientador: AlocacaoOrientador[];

	@OneToMany(() => DocentePalavraChave, (dpk) => dpk.docente)
	docentesPalavraChave: DocentePalavraChave[];

	@OneToMany(() => NotaCriterio, (nc) => nc.docente)
	notasCriterio: NotaCriterio[];
}
