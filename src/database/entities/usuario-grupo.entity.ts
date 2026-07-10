import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Grupo } from './grupo.entity';
import { Usuario } from './usuario.entity';

@Entity({ name: 'usuario_grupo', schema: 'public' })
export class UsuarioGrupo {
  @PrimaryColumn({ name: 'id_grupo', type: 'int' })
  idGrupo: number;

  @PrimaryColumn({ name: 'id_usuario', type: 'varchar' })
  idUsuario: string;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @ManyToOne(() => Grupo, (grupo) => grupo.usuarioGrupos)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioGrupos)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;
}
