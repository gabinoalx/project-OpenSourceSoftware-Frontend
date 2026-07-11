import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EmpleadoService } from '../../services/empleado';
import { Empleado } from '../../models/empleado.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-empleado-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, PageHeader],
  templateUrl: './detail.html',
})
export class Detail {
  private service = inject(EmpleadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  empleado = signal<Empleado | null>(null);
  loading = signal(true);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.get(id).subscribe({
      next: (res) => { this.empleado.set(res.data); this.loading.set(false); },
      error: () => this.router.navigate(['/empleados']),
    });
  }
}
