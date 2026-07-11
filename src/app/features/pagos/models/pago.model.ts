export interface Pago {
  id: number;
  planillaId: number;
  empleadoId: number;
  pagoBruto: number;
  minutosExtrasTotales: number;
  pagoNeto: number;
}