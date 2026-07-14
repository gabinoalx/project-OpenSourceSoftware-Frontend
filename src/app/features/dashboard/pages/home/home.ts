import { Component, inject, signal } from '@angular/core';
import { EmpleadoService } from '../../../empleados/services/empleado';
import { SemanaService } from '../../../semanas/services/semana';
import { TurnoService } from '../../../turnos/services/turno';
import { Semana } from '../../../semanas/models/semana.model';
import { Empleado } from '../../../empleados/models/empleado.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
})
export class Home {
  private empleadoService = inject(EmpleadoService);
  private semanaService = inject(SemanaService);
  private turnoService = inject(TurnoService);

  loading = signal(true);

  totalEmpleados = signal(0);
  empleadosActivos = signal(0);
  totalTurnos = signal(0);
  semanaActual = signal<Semana | null>(null);
  proximaSemana = signal<Semana | null>(null);

  constructor() {
    this.empleadoService.list().subscribe((res) => {
      const empleados = res.data;
      this.totalEmpleados.set(empleados.length);
      this.empleadosActivos.set(empleados.filter((e) => e.estado === 'ACTIVO').length);
    });

    this.turnoService.list().subscribe((res) => {
      this.totalTurnos.set(res.data.length);
    });

    this.semanaService.list().subscribe((res) => {
      const semanas = res.data;
      const activa = semanas.find((s) => s.estado === 'ACTIVA');
      if (activa) {
        this.semanaActual.set(activa);
      } else {
        const hoy = new Date();
        const actual = semanas.find((s) => {
          const inicio = new Date(s.fechaInicio);
          const fin = new Date(s.fechaFin);
          return hoy >= inicio && hoy <= fin;
        });
        this.semanaActual.set(actual ?? null);
      }

      const pendiente = semanas.find((s) => s.estado === 'PENDIENTE');
      if (pendiente) {
        this.proximaSemana.set(pendiente);
      } else {
        const hoy = new Date();
        const futuras = semanas
          .filter((s) => new Date(s.fechaInicio) > hoy)
          .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
        this.proximaSemana.set(futuras[0] ?? null);
      }

      this.loading.set(false);
    });
  }
}
