import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permissao } from './permissao.entity';

@Entity({ name: 'categoria_permissao', schema: 'public' })
export class CategoriaPermissao {
  @PrimaryColumn({ type: 'varchar' })
  codigo: string;

  @Column({ type: 'varchar', nullable: false })
  descricao: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @OneToMany(() => Permissao, (permissao) => permissao.categoria)
  permissoes: Permissao[];
}
