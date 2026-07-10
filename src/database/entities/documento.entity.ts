import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Inscricao } from './inscricao.entity';
import { TipoDocumentoEdital } from './tipo-documento-edital.entity';

@Entity({ name: 'documento', schema: 'public' })
export class Documento {
	@PrimaryColumn({ name: 'id_inscricao', type: 'int' })
	idInscricao: number;

	@PrimaryColumn({ name: 'id_tipo_documento_edital', type: 'int' })
	idTipoDocumentoEdital: number;

	@PrimaryColumn({ type: 'int' })
	versao: number;

	@Column({ type: 'boolean', nullable: false })
	atual: boolean;

	@Column({ name: 'nome_arquivo_original', type: 'varchar', nullable: false })
	nomeArquivoOriginal: string;

	@Column({ name: 'nome_arquivo', type: 'varchar', nullable: true })
	nomeArquivo: string | null;

	@Column({ name: 'caminho_armazenamento', type: 'varchar', nullable: false })
	caminhoArmazenamento: string;

	@Column({ name: 'mime_type', type: 'varchar', nullable: false })
	mimeType: string;

	@Column({ name: 'tamanho_bytes', type: 'int', nullable: false })
	tamanhoBytes: number;

	@Column({ name: 'enviado_em', type: 'timestamptz', nullable: false })
	enviadoEm: Date;

	@CreateDateColumn({ nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ nullable: false })
	updatedAt: Date;

	@ManyToOne(() => Inscricao, (inscricao) => inscricao.documentos)
	@JoinColumn({ name: 'id_inscricao' })
	inscricao: Inscricao;

	@ManyToOne(() => TipoDocumentoEdital, (tipo) => tipo.documentos)
	@JoinColumn({ name: 'id_tipo_documento_edital' })
	tipoDocumentoEdital: TipoDocumentoEdital;
}
