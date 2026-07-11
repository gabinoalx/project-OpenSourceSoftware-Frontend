export type EstadoSemana = 'ACTIVA' | 'COMPLETADA' | 'PENDIENTE' | 'CANCELADA';

export interface Semana {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  numeroSemana: number;
  turnoId: number;
  estado: EstadoSemana;
}
