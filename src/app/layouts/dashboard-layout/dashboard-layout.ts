import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {
  collapsed = signal(false);

  navItems = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Empleados', route: '/empleados' },
    { label: 'Asistencias', route: '/asistencias' },
    { label: 'Cargos', route: '/cargos' },
    { label: 'Descuentos', route: '/descuentos' },
    { label: 'Documentos', route: '/documentos' },
    { label: 'Pagos', route: '/pagos' },
    { label: 'Planillas', route: '/planillas' },
    { label: 'Semanas', route: '/semanas' },
    { label: 'Turnos', route: '/turnos' },
  ];

  get userName(): string {
    return localStorage.getItem('userName') || '';
  }

  get userEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  get userRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = '/auth/login';
  }
}
