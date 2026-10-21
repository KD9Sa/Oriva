import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon.component';
@Component({
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section container">
      <div class="empty-state">
        <app-icon name="compass" [size]="40" />
        <span class="eyebrow">A LITTLE OFF THE BEATEN PATH / 404</span>
        <h1>This place is still undiscovered.</h1>
        <p>
          The page you’re looking for has wandered off. Let’s find you somewhere lovely instead.
        </p>
        <a routerLink="/explore" class="button">
          Explore the stays
          <app-icon name="arrow-right" [size]="16" />
        </a>
      </div>
    </section>
  `,
})
export class NotFoundComponent {}
