export class DocumentoCandidatoDto {
	idTipoDocumentoEdital: number;
	nomeTipo: string;
	versao: number;
	atual: boolean;
	nomeArquivoOriginal: string;
	mimeType: string;
	tamanhoBytes: number;
	enviadoEm: Date;
}

export class ConsultaDocumentosRespostaDto {
	id: number;
	idEdital: number;
	linhaPesquisa: string | null;
	finalizada: boolean;
	deferida: boolean | null;
	documentos: DocumentoCandidatoDto[];
}
