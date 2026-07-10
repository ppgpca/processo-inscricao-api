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
import { SeedDocenteEdital20260709000013 } from './20260709000013-seed-docente-edital';
import { SeedPalavraChave20260709000014 } from './20260709000014-seed-palavra-chave';
import { SeedDocentePalavraChave20260709000015 } from './20260709000015-seed-docente-palavra-chave';
import { Seeder } from './seeder.interface';

const HISTORY_TABLE = 'public.seed_history';

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
	SeedDocenteEdital20260709000013,
	SeedPalavraChave20260709000014,
	SeedDocentePalavraChave20260709000015,
];

function filterSeeders(target?: string): Array<new () => Seeder> {
	if (!target) return seeders;

	const matched = seeders.filter((SeederClass) =>
		SeederClass.name.toLowerCase().includes(target.toLowerCase()),
	);

	if (matched.length === 0) {
		console.error(`No seeder matched: "${target}"`);
		console.error('Available seeders:');
		seeders.forEach((s) => console.error(`  - ${s.name}`));
		process.exit(1);
	}

	return matched;
}

async function ensureHistoryTable(): Promise<void> {
	await dataSource.query(`
    CREATE TABLE IF NOT EXISTS ${HISTORY_TABLE} (
      id       SERIAL PRIMARY KEY,
      name     VARCHAR NOT NULL UNIQUE,
      run_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedSeeders(): Promise<Set<string>> {
	const rows: { name: string }[] = await dataSource.query(
		`SELECT name FROM ${HISTORY_TABLE}`,
	);
	return new Set(rows.map((r) => r.name));
}

async function markAsExecuted(name: string): Promise<void> {
	await dataSource.query(
		`INSERT INTO ${HISTORY_TABLE} (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
		[name],
	);
}

async function unmarkAsExecuted(name: string): Promise<void> {
	await dataSource.query(`DELETE FROM ${HISTORY_TABLE} WHERE name = $1`, [
		name,
	]);
}

async function runUp(target?: string): Promise<void> {
	const targets = filterSeeders(target);
	for (const SeederClass of targets) {
		const seeder = new SeederClass();
		console.log(`Running seeder: ${SeederClass.name}`);
		await seeder.up(dataSource);
		console.log(`  ✓ ${SeederClass.name}`);
	}
}

async function runDown(target?: string): Promise<void> {
	const targets = [...filterSeeders(target)].reverse();
	for (const SeederClass of targets) {
		const seeder = new SeederClass();
		console.log(`Reverting seeder: ${SeederClass.name}`);
		await seeder.down(dataSource);
		console.log(`  ✓ ${SeederClass.name}`);
	}
}

async function runPending(): Promise<void> {
	await ensureHistoryTable();
	const executed = await getExecutedSeeders();
	const pending = seeders.filter((S) => !executed.has(S.name));

	if (pending.length === 0) {
		console.log('Nenhum seeder pendente.');
		return;
	}

	console.log(`${pending.length} seeder(s) pendente(s):`);
	pending.forEach((S) => console.log(`  [ ] ${S.name}`));
	console.log('');

	for (const SeederClass of pending) {
		const seeder = new SeederClass();
		console.log(`Running seeder: ${SeederClass.name}`);
		await seeder.up(dataSource);
		await markAsExecuted(SeederClass.name);
		console.log(`  ✓ ${SeederClass.name}`);
	}
}

async function showStatus(): Promise<void> {
	await ensureHistoryTable();
	const executed = await getExecutedSeeders();

	console.log('Status dos seeders:');
	console.log('');
	for (const SeederClass of seeders) {
		const mark = executed.has(SeederClass.name) ? '[X]' : '[ ]';
		console.log(`  ${mark} ${SeederClass.name}`);
	}
}

async function main(): Promise<void> {
	const direction = process.argv[2];
	const target = process.argv[3];

	const validDirections = ['up', 'down', 'pending', 'show'];
	if (!validDirections.includes(direction)) {
		console.error('Usage: ts-node run.ts <up|down|pending|show> [seeder-name]');
		console.error('');
		console.error('Commands:');
		console.error('  up [name]   Executa todos os seeders (ou um específico)');
		console.error('  down [name] Reverte todos os seeders (ou um específico)');
		console.error('  pending     Executa apenas seeders ainda não registrados');
		console.error('  show        Exibe o status de cada seeder');
		console.error('');
		console.error('Examples:');
		console.error('  ts-node run.ts up');
		console.error('  ts-node run.ts up SeedDocente');
		console.error('  ts-node run.ts pending');
		console.error('  ts-node run.ts show');
		process.exit(1);
	}

	try {
		await dataSource.initialize();

		if (direction === 'up') {
			if (target) {
				console.log(`Running seeder "${target}"...`);
			} else {
				console.log('Running all seeders...');
			}
			await runUp(target);
		} else if (direction === 'down') {
			if (target) {
				console.log(`Reverting seeder "${target}"...`);
			} else {
				console.log('Reverting all seeders...');
			}
			await runDown(target);
		} else if (direction === 'pending') {
			await runPending();
		} else if (direction === 'show') {
			await showStatus();
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
