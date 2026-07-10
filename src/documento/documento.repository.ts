import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from '../database/entities/documento.entity';

export interface CriarDocumentoDto {
	idInscricao: number;
	idTipoDocumentoEdital: number;
	versao: number;
	atual: boolean;
	nomeArquivoOriginal: string;
	nomeArquivo: string;
	caminhoArmazenamento: string;
	mimeType: string;
	tamanhoBytes: number;
	enviadoEm: Date;
}

@Injectable()
export class DocumentoRepository {
	constructor(
		@InjectRepository(Documento)
		private readonly repo: Repository<Documento>,
	) {}

	async obterPorInscricao(idInscricao: number): Promise<Documento[]> {
		return this.repo.find({
			where: { idInscricao },
			relations: { tipoDocumentoEdital: true },
			order: { idTipoDocumentoEdital: 'ASC' },
		});
	}

	async obterAtual(
		idInscricao: number,
		idTipoDocumentoEdital: number,
	): Promise<Documento | null> {
		return this.repo.findOne({
			where: { idInscricao, idTipoDocumentoEdital, atual: true },
		});
	}

	async obterProximaVersao(
		idInscricao: number,
		idTipoDocumentoEdital: number,
	): Promise<number> {
		const result = await this.repo
			.createQueryBuilder('d')
			.select('MAX(d.versao)', 'max')
			.where('d.idInscricao = :idInscricao', { idInscricao })
			.andWhere('d.idTipoDocumentoEdital = :idTipoDocumentoEdital', {
				idTipoDocumentoEdital,
			})
			.getRawOne<{ max: string | null }>();

		return (result?.max ? parseInt(result.max, 10) : 0) + 1;
	}

	async desmarcarAtual(
		idInscricao: number,
		idTipoDocumentoEdital: number,
	): Promise<void> {
		await this.repo.update(
			{ idInscricao, idTipoDocumentoEdital, atual: true },
			{ atual: false },
		);
	}

	async criar(dados: CriarDocumentoDto): Promise<Documento> {
		const documento = this.repo.create(dados);
		return this.repo.save(documento);
	}

	async remover(
		idInscricao: number,
		idTipoDocumentoEdital: number,
	): Promise<void> {
		await this.repo.delete({ idInscricao, idTipoDocumentoEdital });
	}
}
