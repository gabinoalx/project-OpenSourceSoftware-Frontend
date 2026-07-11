import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpleadoService } from '../../services/empleado';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-empleado-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './edit.html',
})
export class Edit {
  private fb = inject(FormBuilder);
  private service = inject(EmpleadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);
  loadingData = signal(true);

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

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.get(id).subscribe({
      next: (res) => {
        const e = res.data;
        this.form.patchValue({
          dni: String(e.dni), nombres: e.nombres, apellidos: e.apellidos,
          edad: e.edad, sexo: e.sexo, fechaNacimiento: e.fechaNacimiento,
          correo: e.correo, celular: String(e.celular), asegurado: e.asegurado,
          cargoId: e.cargoId, estado: e.estado,
          departamento: e.direccion?.departamento || '',
          provincia: e.direccion?.provincia || '',
          distrito: e.direccion?.distrito || '',
          domicilio: e.direccion?.domicilio || '',
          examenFecha: e.examenMedico?.fecha || '',
          examenMonto: e.examenMedico?.montoGastado || 0,
          examenAlta: e.examenMedico?.alta ?? true,
        });
        this.loadingData.set(false);
      },
      error: () => this.router.navigate(['/empleados']),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const v = this.form.value;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const payload: any = {
      dni: Number(v.dni), nombres: v.nombres, apellidos: v.apellidos,
      edad: Number(v.edad), sexo: v.sexo, fechaNacimiento: v.fechaNacimiento,
      correo: v.correo, celular: Number(v.celular), asegurado: v.asegurado,
      cargoId: Number(v.cargoId), estado: v.estado,
      direccion: { departamento: v.departamento, provincia: v.provincia, distrito: v.distrito, domicilio: v.domicilio },
      examenMedico: { fecha: v.examenFecha || null, montoGastado: Number(v.examenMonto), alta: v.examenAlta },
    };

    this.service.update(id, payload).subscribe({
      next: () => this.router.navigate(['/empleados']),
      error: () => { this.error.set('Error al actualizar empleado'); this.loading.set(false); },
    });
  }
}
