import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DocumentoService } from '../../services/documento';
import { EmpleadoService } from '../../../empleados/services/empleado';
import { Empleado } from '../../../empleados/models/empleado.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-documento-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './create.html',
})
export class Create {
  private fb = inject(FormBuilder);
  private service = inject(DocumentoService);
  private empleadoService = inject(EmpleadoService);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);
  empleados = signal<Empleado[]>([]);
  selectedFile = signal<File | null>(null);

  form = this.fb.group({
    empleadoId: [0, Validators.required],
    tipoDocumento: ['MEDICO', Validators.required],
  });

  constructor() {
    this.empleadoService.list().subscribe((res) => this.empleados.set(res.data));
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedFile()) return;
    this.loading.set(true);
    this.error.set('');

    const v = this.form.value;
    this.service.create(
      this.selectedFile()!,
      Number(v.empleadoId),
      v.tipoDocumento!,
    ).subscribe({
      next: () => this.router.navigate(['/documentos']),
      error: () => { this.error.set('Error al crear documento'); this.loading.set(false); },
    });
  }
}
