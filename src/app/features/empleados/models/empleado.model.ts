export type Sexo = 'MASCULINO' | 'FEMENINO';

export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO';

export interface Direccion {
  departamento: string;
  provincia: string;
  distrito: string;
  domicilio: string;
}

export interface ExamenMedico {
  fecha: string | null;
  montoGastado: number | null;
  alta: boolean | null;
}

export interface Empleado {
  id: number;
  dni: number;
  nombres: string;
  apellidos: string;
  edad: number;
  sexo: Sexo;
  fechaNacimiento: string;
  correo: string;
  celular: number;
  asegurado: boolean;
  cargoId: number;
  estado: EstadoEmpleado;
  direccion: Direccion;
  examenMedico: ExamenMedico;
}
