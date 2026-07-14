import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AsistenciaService } from '../../services/asistencia';
import { EmpleadoService } from '../../../empleados/services/empleado';
import { SemanaService } from '../../../semanas/services/semana';
import { Empleado } from '../../../empleados/models/empleado.model';
import { Semana } from '../../../semanas/models/semana.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-asistencia-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './create.html',
})
export class Create {
  private fb = inject(FormBuilder);
  private service = inject(AsistenciaService);
  private empleadoService = inject(EmpleadoService);
  private semanaService = inject(SemanaService);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);
  empleados = signal<Empleado[]>([]);
  semanas = signal<Semana[]>([]);

  constructor() {
    this.empleadoService.list().subscribe((res) => this.empleados.set(res.data));
    this.semanaService.list().subscribe((res) => this.semanas.set(res.data));
  }

  form = this.fb.group({
    empleadoId: [0, Validators.required],
    semanaId: [0, Validators.required],
    fecha: ['', Validators.required],
    estado: ['PRESENTE', Validators.required],
    minutosExtras: [0],
    minutosAtrasadas: [0],
    observaciones: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const v = this.form.value;
    const payload: any = {
      empleadoId: Number(v.empleadoId),
      semanaId: Number(v.semanaId),
      fecha: v.fecha,
      estado: v.estado,
      minutosExtras: v.minutosExtras ? Number(v.minutosExtras) : null,
      minutosAtrasadas: v.minutosAtrasadas ? Number(v.minutosAtrasadas) : null,
      observaciones: v.observaciones || null,
    };

    this.service.create(payload).subscribe({
      next: () => this.router.navigate(['/asistencias']),
      error: () => { this.error.set('Error al crear asistencia'); this.loading.set(false); },
    });
  }
}
