export type EstadoAsistencia = 'PRESENTE' | 'AUSENTE' | 'TARDE' | 'JUSTIFICADO';

export interface Asistencia {
  id: number;
  empleadoId: number;
  semanaId: number;
  fecha: string;
  estado: EstadoAsistencia;
  minutosExtras: number | null;
  minutosAtrasadas: number | null;
  fechaModificacion: string | null;
  observaciones: string | null;
}
