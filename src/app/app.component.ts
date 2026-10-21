import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StayStore } from './core/stay-store.service';
import { IconComponent } from './shared/components/icon.component';
import { HeaderComponent } from './layouts/header.component';
import { FooterComponent } from './layouts/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IconComponent, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <app-header />
    <main id="main-content" tabindex="-1"><router-outlet /></main>
    <app-footer />
    @if (store.toast()) {
      <div class="toast" role="status">
        <app-icon name="check-circle" [size]="18" />
        <span>{{ store.toast() }}</span>
        <button type="button" aria-label="Dismiss notification" (click)="store.toast.set('')">
          <app-icon name="close" [size]="16" />
        </button>
      </div>
    }
  `,
  styles: [
    `
      .skip-link {
        position: fixed;
        top: -60px;
        left: 20px;
        z-index: 100;
        background: var(--color-primary);
        color: white;
        padding: 12px 20px;
      }
      .skip-link:focus {
        top: 10px;
      }
      .toast {
        position: fixed;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 70;
        background: var(--color-primary);
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px 18px;
        border-radius: 6px;
        box-shadow: var(--shadow);
        font-size: 12px;
        width: max-content;
        max-width: calc(100% - 32px);
      }
      .toast button {
        color: white;
        background: none;
        border: 0;
        padding: 4px;
        display: flex;
      }
      .toast > app-icon {
        color: var(--color-accent);
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  readonly store = inject(StayStore);
  ngOnInit(): void {
    void this.store.load();
  }
}
