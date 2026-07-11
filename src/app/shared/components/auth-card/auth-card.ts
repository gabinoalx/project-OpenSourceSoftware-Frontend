import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  template: `
  
    <div class="flex min-h-screen items-center justify-center bg-background p-4">
      <div class="w-full max-w-sm rounded-(--radius) border border-border bg-card p-6 shadow-sm">
        <div class="mb-6 text-center">
          <h1 class="text-xl font-semibold text-card-foreground">{{ title() }}</h1>
          @if (subtitle()) {
            <p class="mt-1 text-sm text-muted-foreground">{{ subtitle() }}</p>
          }
        </div>
        <ng-content />
      </div>
    </div>
  `,
})
export class AuthCard {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
