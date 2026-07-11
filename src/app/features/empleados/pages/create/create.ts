import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmpleadoService } from '../../services/empleado';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-empleado-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './create.html',
})
export class Create {
  private fb = inject(FormBuilder);
  private service = inject(EmpleadoService);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);

  form = this.fb.group({
    dni: ['', [Validators.required, Validators.min(10000000), Validators.max(99999999)]],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    edad: [0, [Validators.required, Validators.min(18)]],
    sexo: ['MASCULINO', Validators.required],
    fechaNacimiento: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    celular: ['', [Validators.required, Validators.min(100000000), Validators.max(999999999)]],
    asegurado: [true, Validators.required],
    cargoId: [0, Validators.required],
    estado: ['ACTIVO', Validators.required],
    departamento: [''],
    provincia: [''],
    distrito: [''],
    domicilio: [''],
    examenFecha: [''],
    examenMonto: [0],
    examenAlta: [true],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const v = this.form.value;
    const payload: any = {
      dni: Number(v.dni), nombres: v.nombres, apellidos: v.apellidos,
      edad: Number(v.edad), sexo: v.sexo, fechaNacimiento: v.fechaNacimiento,
      correo: v.correo, celular: Number(v.celular), asegurado: v.asegurado,
      cargoId: Number(v.cargoId), estado: v.estado,
      direccion: { departamento: v.departamento, provincia: v.provincia, distrito: v.distrito, domicilio: v.domicilio },
      examenMedico: { fecha: v.examenFecha || null, montoGastado: Number(v.examenMonto), alta: v.examenAlta },
    };

    this.service.create(payload).subscribe({
      next: () => this.router.navigate(['/empleados']),
      error: () => { this.error.set('Error al crear empleado'); this.loading.set(false); },
    });
  }
}
