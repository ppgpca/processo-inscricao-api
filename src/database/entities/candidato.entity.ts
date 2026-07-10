import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'candidato', schema: 'public' })
export class Candidato {
  @PrimaryColumn({ type: 'varchar' })
  cpf: string;

  @Column({ type: 'varchar', nullable: false })
  nome: string;

  @Column({ name: 'data_nascimento', type: 'date', nullable: false })
  dataNascimento: string;

  @Column({ type: 'varchar', nullable: true })
  rg: string | null;

  @Column({ type: 'varchar', nullable: true })
  telefone: string | null;

  @Column({ type: 'varchar', nullable: true })
  celular: string | null;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  email2: string | null;

  @Column({ name: 'endereco_rua', type: 'text', nullable: true })
  enderecoRua: string | null;

  @Column({ name: 'endereco_num', type: 'varchar', nullable: true })
  enderecoNum: string | null;

  @Column({ name: 'endereco_bairro', type: 'varchar', nullable: true })
  enderecoBairro: string | null;

  @Column({ name: 'endereco_cidade', type: 'varchar', nullable: true })
  enderecoCidade: string | null;

  @Column({ name: 'endereco_estado', type: 'varchar', nullable: true })
  enderecoEstado: string | null;

  @Column({ name: 'endereco_cep', type: 'varchar', nullable: true })
  enderecoCep: string | null;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @OneToMany(() => Inscricao, (inscricao) => inscricao.candidato)
  inscricoes: Inscricao[];
}
