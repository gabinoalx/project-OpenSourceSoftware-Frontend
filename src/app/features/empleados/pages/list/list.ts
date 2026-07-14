import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { EmpleadoService } from "../../services/empleado";
import { Empleado } from "../../models/empleado.model";
import { PageHeader } from "../../../../shared/components/page-header/page-header";

@Component({
  selector: "app-empleado-list",
  standalone: true,
  imports: [RouterLink, PageHeader, FormsModule],
  templateUrl: "./list.html",
})
export class List {
  private service = inject(EmpleadoService);

  empleados = signal<Empleado[]>([]);
  query = signal("");
  loading = signal(true);

  filteredEmpleados = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.empleados();
    return this.empleados().filter(
      (e) =>
        String(e.dni).includes(q) ||
        e.nombres.toLowerCase().includes(q) ||
        e.apellidos.toLowerCase().includes(q) ||
        e.correo.toLowerCase().includes(q),
    );
  });

  constructor() {
    this.service.list().subscribe({
      next: (res) => {
        this.empleados.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  delete(id: number) {
    if (!confirm("¿Eliminar este empleado?")) return;
    this.service.delete(id).subscribe(() => {
      this.empleados.set(this.empleados().filter((e) => e.id !== id));
    });
  }
}
