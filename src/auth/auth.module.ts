import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from '../database/entities/grupo.entity';
import { GrupoPermissao } from '../database/entities/grupo-permissao.entity';
import { Permissao } from '../database/entities/permissao.entity';
import { Usuario } from '../database/entities/usuario.entity';
import { UsuarioGrupo } from '../database/entities/usuario-grupo.entity';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { PermissoesRepository } from './permissoes.repository';
import { PermissoesService } from './permissoes.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LdapStrategy } from './strategies/ldap.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sua-chave-secreta-padrao',
      signOptions: { algorithm: 'HS256' },
    }),
    TypeOrmModule.forFeature([Usuario, Grupo, Permissao, GrupoPermissao, UsuarioGrupo]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PermissoesService,
    PermissoesRepository,
    JwtStrategy,
    LdapStrategy,
  ],
  exports: [AuthService, PermissoesService, JwtStrategy],
})
export class AuthModule {}
