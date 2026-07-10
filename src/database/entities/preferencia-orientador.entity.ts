import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Docente } from './docente.entity';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'preferencia_orientador', schema: 'public' })
export class PreferenciaOrientador {
  @PrimaryColumn({ name: 'id_inscricao', type: 'int' })
  idInscricao: number;

  @PrimaryColumn({ name: 'codigo_docente', type: 'varchar' })
  codigoDocente: string;

  @Column({ type: 'int', nullable: false })
  ordem: number;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @ManyToOne(() => Inscricao, (inscricao) => inscricao.preferenciasOrientador)
  @JoinColumn({ name: 'id_inscricao' })
  inscricao: Inscricao;

  @ManyToOne(() => Docente, (docente) => docente.preferenciasOrientador)
  @JoinColumn({ name: 'codigo_docente', referencedColumnName: 'codigo' })
  docente: Docente;
}
