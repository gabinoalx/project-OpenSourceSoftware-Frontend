import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsistenciaService } from '../../services/asistencia';
import { EmpleadoService } from '../../../empleados/services/empleado';
import { SemanaService } from '../../../semanas/services/semana';
import { Empleado } from '../../../empleados/models/empleado.model';
import { Semana } from '../../../semanas/models/semana.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-asistencia-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './edit.html',
})
export class Edit {
  private fb = inject(FormBuilder);
  private service = inject(AsistenciaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);
  loadingData = signal(true);

  form = this.fb.group({
    empleadoId: [0, Validators.required],
    semanaId: [0, Validators.required],
    fecha: ['', Validators.required],
    estado: ['PRESENTE', Validators.required],
    minutosExtras: [0],
    minutosAtrasadas: [0],
    observaciones: [''],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.get(id).subscribe({
      next: (res) => {
        const a = res.data;
        this.form.patchValue({
          empleadoId: a.empleadoId,
          semanaId: a.semanaId,
          fecha: a.fecha,
          estado: a.estado,
          minutosExtras: a.minutosExtras ?? 0,
          minutosAtrasadas: a.minutosAtrasadas ?? 0,
          observaciones: a.observaciones ?? '',
        });
        this.loadingData.set(false);
      },
      error: () => this.router.navigate(['/asistencias']),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const v = this.form.value;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const payload: any = {
      empleadoId: Number(v.empleadoId),
      semanaId: Number(v.semanaId),
      fecha: v.fecha,
      estado: v.estado,
      minutosExtras: v.minutosExtras ? Number(v.minutosExtras) : null,
      minutosAtrasadas: v.minutosAtrasadas ? Number(v.minutosAtrasadas) : null,
      observaciones: v.observaciones || null,
    };

    this.service.update(id, payload).subscribe({
      next: () => this.router.navigate(['/asistencias']),
      error: () => { this.error.set('Error al actualizar asistencia'); this.loading.set(false); },
    });
  }
}
