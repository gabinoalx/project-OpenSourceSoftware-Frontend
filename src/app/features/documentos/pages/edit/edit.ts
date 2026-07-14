import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentoService } from '../../services/documento';
import { EmpleadoService } from '../../../empleados/services/empleado';
import { Empleado } from '../../../empleados/models/empleado.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-documento-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './edit.html',
})
export class Edit {
  private fb = inject(FormBuilder);
  private service = inject(DocumentoService);
  private empleadoService = inject(EmpleadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);
  loadingData = signal(true);
  empleados = signal<Empleado[]>([]);
  selectedFile = signal<File | null>(null);

  form = this.fb.group({
    empleadoId: [0, Validators.required],
    tipoDocumento: ['MEDICO', Validators.required],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.empleadoService.list().subscribe((res) => this.empleados.set(res.data));

    this.service.list().subscribe({
      next: (res) => {
        const doc = res.data.find((d) => d.id === id);
        if (doc) {
          this.form.patchValue({
            empleadoId: doc.empleadoId,
            tipoDocumento: doc.tipoDocumento,
          });
          this.loadingData.set(false);
        } else {
          this.router.navigate(['/documentos']);
        }
      },
      error: () => this.router.navigate(['/documentos']),
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const v = this.form.value;

    this.service.update(
      id,
      this.selectedFile() ?? undefined,
      Number(v.empleadoId),
      v.tipoDocumento!,
    ).subscribe({
      next: () => this.router.navigate(['/documentos']),
      error: () => { this.error.set('Error al actualizar documento'); this.loading.set(false); },
    });
  }
}
