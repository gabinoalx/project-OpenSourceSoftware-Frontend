export type TipoTurno = 'MATUTINO' | 'TARDE' | 'NOCTURNO' | 'COMPLETO';

export interface Turno {
  id: number;
  tipo: TipoTurno;
  horaInicio: string;
  horaFin: string;
}
