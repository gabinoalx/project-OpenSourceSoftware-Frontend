import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AsistenciaService } from "../../services/asistencia";
import { Asistencia } from "../../models/asistencia.model";
import { EmpleadoService } from "../../../empleados/services/empleado";
import { Empleado } from "../../../empleados/models/empleado.model";
import { PageHeader } from "../../../../shared/components/page-header/page-header";

@Component({
  selector: "app-asistencia-list",
  standalone: true,
  imports: [RouterLink, PageHeader, FormsModule],
  templateUrl: "./list.html",
})
export class List {
  private service = inject(AsistenciaService);
  private empleadoService = inject(EmpleadoService);

  asistencias = signal<Asistencia[]>([]);
  empleados = signal<Empleado[]>([]);
  query = signal("");
  loading = signal(true);

  nombreEmpleado(id: number): string {
    const emp = this.empleados().find((e) => e.id === id);
    return emp ? `${emp.nombres} ${emp.apellidos}` : `ID ${id}`;
  }

  filteredAsistencias = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.asistencias();
    return this.asistencias().filter((a) => {
      const nombre = this.nombreEmpleado(a.empleadoId).toLowerCase();
      return (
        nombre.includes(q) ||
        a.fecha.includes(q) ||
        a.estado.toLowerCase().includes(q) ||
        (a.observaciones && a.observaciones.toLowerCase().includes(q))
      );
    });
  });

  constructor() {
    this.empleadoService.list().subscribe((res) => this.empleados.set(res.data));
    this.service.list().subscribe({
      next: (res) => {
        this.asistencias.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  delete(id: number) {
    if (!confirm("¿Eliminar esta asistencia?")) return;
    this.service.delete(id).subscribe(() => {
      this.asistencias.set(this.asistencias().filter((a) => a.id !== id));
    });
  }
}
