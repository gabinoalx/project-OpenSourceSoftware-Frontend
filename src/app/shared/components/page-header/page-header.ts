import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-foreground">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="mt-1 text-sm text-muted-foreground">{{ subtitle() }}</p>
        }
      </div>
      <div class="flex items-center gap-2">
        @if (backRoute()) {
          <a [routerLink]="backRoute()"
             class="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            Volver
          </a>
        }
        @if (showAdd()) {
          <a [routerLink]="addRoute()"
             class="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            {{ addLabel() }}
          </a>
        }
      </div>
    </div>
  `,
})

export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly backRoute = input<string>();
  readonly showAdd = input(false);
  readonly addRoute = input<string>('/');
  readonly addLabel = input('Agregar');
}
