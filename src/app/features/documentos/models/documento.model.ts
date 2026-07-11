export type DocumentoType = 'MEDICO' | 'JUDICIAL';

export interface Documento {
  id: number;
  empleadoId: number;
  tipoDocumento: DocumentoType;
  url: string;
  publicId: string | null;
}
