import 'reflect-metadata';
import dataSource from '../data-source';
import { SeedDocente20260709000001 } from './20260709000001-seed-docente';
import { SeedLinhaPesquisa20260709000002 } from './20260709000002-seed-linha-pesquisa';
import { SeedEdital20260709000003 } from './20260709000003-seed-edital';
import { SeedDocenteLinhaPesquisa20260709000004 } from './20260709000004-seed-docente-linha-pesquisa';
import { SeedTipoDocumentoEdital20260709000005 } from './20260709000005-seed-tipo-documento-edital';
import { SeedInscricaoSequence20260709000006 } from './20260709000006-seed-inscricao-sequence';
import { SeedGrupo20260709000007 } from './20260709000007-seed-grupo';
import { SeedCategoriaPermissao20260709000008 } from './20260709000008-seed-categoria-permissao';
import { SeedPermissao20260709000009 } from './20260709000009-seed-permissao';
import { SeedUsuario20260709000010 } from './20260709000010-seed-usuario';
import { SeedGrupoPermissao20260709000011 } from './20260709000011-seed-grupo-permissao';
import { SeedUsuarioGrupo20260709000012 } from './20260709000012-seed-usuario-grupo';
import { Seeder } from './seeder.interface';

const seeders: Array<new () => Seeder> = [
  SeedDocente20260709000001,
  SeedLinhaPesquisa20260709000002,
  SeedEdital20260709000003,
  SeedDocenteLinhaPesquisa20260709000004,
  SeedTipoDocumentoEdital20260709000005,
  SeedInscricaoSequence20260709000006,
  SeedGrupo20260709000007,
  SeedCategoriaPermissao20260709000008,
  SeedPermissao20260709000009,
  SeedUsuario20260709000010,
  SeedGrupoPermissao20260709000011,
  SeedUsuarioGrupo20260709000012,
];

async function runUp(): Promise<void> {
  for (const SeederClass of seeders) {
    const seeder = new SeederClass();
    console.log(`Running seeder: ${SeederClass.name}`);
    await seeder.up(dataSource);
    console.log(`  ✓ ${SeederClass.name}`);
  }
}

async function runDown(): Promise<void> {
  for (const SeederClass of [...seeders].reverse()) {
    const seeder = new SeederClass();
    console.log(`Reverting seeder: ${SeederClass.name}`);
    await seeder.down(dataSource);
    console.log(`  ✓ ${SeederClass.name}`);
  }
}

async function main(): Promise<void> {
  const direction = process.argv[2];

  if (direction !== 'up' && direction !== 'down') {
    console.error('Usage: ts-node run.ts <up|down>');
    process.exit(1);
  }

  try {
    await dataSource.initialize();
    console.log(`Running seeders (${direction})...`);

    if (direction === 'up') {
      await runUp();
    } else {
      await runDown();
    }

    console.log('Done.');
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

void main();
