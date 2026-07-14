import { DataSource, DeepPartial } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Seeder } from './seeder.interface';

const usuarios: DeepPartial<Usuario>[] = [
	{
		id: 'braulio',
		nome: 'Braulio Adriano de Mello',
		email: 'braulio@uffs.edu.br',
		senha: '$2b$10$Sm3UbCsU40aOMR5NDYDZMuxYdspHAN//xajdVSBC16vSawFxTk4w6',
	},
	{
		id: 'claunir.pavan',
		nome: 'Claunir Pavan',
		email: 'claunir.pavan@uffs.edu.br',
		senha: '$2b$10$OaPr5Z9lNdUgaRmRrZ3Jz.9uGHUg0Hdc5CAkTbThZpH0Y8M/3/oF.',
	},
	{
		id: 'duarte',
		nome: 'Denio Duarte',
		email: 'duarte@uffs.edu.br',
		senha: '$2b$10$TIhSelNjWWtGza7jCPK9NOMiQXEcaOQCbnyf8LPqwrbez3nLDsnbu',
	},
	{
		id: 'felipegrando',
		nome: 'Felipe Grando',
		email: 'grando@uffs.edu.br',
		senha: '$2b$10$ld8VFs7F42ALWgpJRsuSxebGHIq7c62lnYvm7IMCoXQKrJG0V61qi',
	},
	{
		id: 'gschreiner',
		nome: 'Geomar Schreiner',
		email: 'schreiner.geomar@uffs.edu.br',
		senha: '$2b$10$vdwErOGTvImfB4LSovSsnuZhglwIVXiwY8oELWkQJ1LGfmADzm/xO',
	},
	{
		id: 'gian',
		nome: 'Giancarlo Salton',
		email: 'gian@uffs.edu.br',
		senha: '$2b$10$fSZpty.O.yftCl5zmLnpc.CsC0E.TR6k3i9ag7FRG7ah1vw2opUgK',
	},
	{
		id: 'guilherme.dalbianco',
		nome: 'Guilherme Dal Bianco',
		email: 'guilherme.dalbianco@uffs.edu.br',
		senha: '$2b$10$iKOqwcREJNNhukfPUVLl2elkpwaEK2cvELtilCrFi2EGOQy1k4Cfy',
	},
	{
		id: 'lcaimi',
		nome: 'Luciano Lores Caimi',
		email: 'lcaimi@uffs.edu.br',
		senha: '$2b$10$HRs9z3.z9jL4xyoicwYOgOkPdd63JY5CKrScVLDvFAxLbCgZMJcPe',
	},
	{
		id: 'marco.spohn',
		nome: 'Marco Aurelio Spohn',
		email: 'marco.spohn@uffs.edu.br',
		senha: '$2b$10$IoY2h6qOmV4AI8LcFi7yIuWBwdbQ4bBfB0/P8Uk1B1gsMpMarryg6',
	},
	{
		id: 'samuel.feitosa',
		nome: 'Samuel Feitosa',
		email: 'samuelfeitosa@uffs.edu.br',
		senha: '$2b$10$QmaZEKh9oRderY.uLpbkKeHNM5fdDVKV4Ucqx08NUbBmIRJVb9Mqi',
	},
	{
		id: 'jose.grzybowski',
		nome: 'Jose Mario Vicensi Grzybowski',
		email: 'jose.grzybowski@uffs.edu.br',
		senha: '$2b$10$wjJ88O3BAqV6sUF9rg1keOVmkWq.DcPr36iTwb5vXxRN1/GErhSpO',
	},
	{
		id: 'tiago.zonta',
		nome: 'Tiago Zonta',
		email: 'tiago.zonta',
		senha: '$2b$10$npT/ByKhFilQ/cL9510T5el5T1t0X6VP.yZ03Xln9wt6rua5P/ePq',
	},
	{
		id: 'fernando.bevilacqua',
		nome: 'Fernando Bevilacqua',
		email: 'fernando.bevilacqua',
		senha: '$2b$10$i.Ph/TNmOfCDQglmujeqpeyjMo1WbYFisnQd3KV56SwM6xdT9XREW',
	},
	{
		id: 'graziela.tonin',
		nome: 'Graziela Tonin',
		email: 'graziela.tonin',
		senha: '$2b$10$tlKBcmK/Gj6OQLA9nv02w.KduXYG996MN8uPDJZHhITd9MCzIH636',
	},
];

export class SeedUsuario20260709000011 implements Seeder {
	async up(dataSource: DataSource): Promise<void> {
		await dataSource.manager.save(Usuario, usuarios);
	}

	async down(dataSource: DataSource): Promise<void> {
		await dataSource
			.getRepository(Usuario)
			.createQueryBuilder()
			.delete()
			.execute();
	}
}
