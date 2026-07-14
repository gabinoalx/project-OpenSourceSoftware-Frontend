import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { DocumentoService } from "../../services/documento";
import { EmpleadoService } from "../../../empleados/services/empleado";
import { Documento } from "../../models/documento.model";
import { Empleado } from "../../../empleados/models/empleado.model";
import { PageHeader } from "../../../../shared/components/page-header/page-header";

@Component({
  selector: "app-documento-list",
  standalone: true,
  imports: [RouterLink, PageHeader, FormsModule],
  templateUrl: "./list.html",
})
export class List {
  private service = inject(DocumentoService);
  private empleadoService = inject(EmpleadoService);

  documentos = signal<Documento[]>([]);
  empleados = signal<Empleado[]>([]);
  query = signal("");
  loading = signal(true);

  nombreEmpleado(id: number): string {
    const emp = this.empleados().find((e) => e.id === id);
    return emp ? `${emp.nombres} ${emp.apellidos}` : `ID ${id}`;
  }

  filteredDocumentos = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.documentos();
    return this.documentos().filter((d) => {
      const nombre = this.nombreEmpleado(d.empleadoId).toLowerCase();
      return (
        nombre.includes(q) ||
        d.tipoDocumento.toLowerCase().includes(q)
      );
    });
  });

  constructor() {
    this.empleadoService.list().subscribe((res) => this.empleados.set(res.data));
    this.service.list().subscribe({
      next: (res) => {
        this.documentos.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  delete(id: number) {
    if (!confirm("¿Eliminar este documento?")) return;
    this.service.delete(id).subscribe(() => {
      this.documentos.set(this.documentos().filter((d) => d.id !== id));
    });
  }
}
