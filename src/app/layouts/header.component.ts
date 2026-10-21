import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StayStore } from '../core/stay-store.service';
import { IconComponent } from '../shared/components/icon.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top-note">
      A world of beautiful places. A different pace.
      <a routerLink="/explore">
        Discover the Oriva collection
        <app-icon name="arrow-right" [size]="12" />
      </a>
    </div>
    <header class="site-header">
      <div class="container nav">
        <a routerLink="/" class="wordmark" aria-label="Oriva home">
          <span class="brand-mark">✳</span>
          oriva
          <span class="wordmark-dot">.</span>
        </a>
        <nav class="desktop-nav" aria-label="Main navigation">
          <a routerLink="/explore" routerLinkActive="active">Find a stay</a>
          <a routerLink="/" fragment="destinations">Destinations</a>
          <a routerLink="/" fragment="the-oriva-way">
            The Oriva way
            <app-icon name="arrow-up-right" [size]="12" />
          </a>
        </nav>
        <div class="nav-actions">
          <a routerLink="/saved" class="saved-link" aria-label="Saved stays">
            <app-icon name="heart" [size]="18" />
            <span>Saved</span>
            @if (store.wishlist().length) {
              <span class="saved-count">{{ store.wishlist().length }}</span>
            }
          </a>
          <a class="reservation-link" routerLink="/reservations">
            My reservations
            <app-icon name="arrow-up-right" [size]="14" />
          </a>
          <button
            class="mobile-menu icon-button"
            type="button"
            (click)="menuOpen.set(!menuOpen())"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            <app-icon [name]="menuOpen() ? 'close' : 'menu'" />
          </button>
        </div>
      </div>
      @if (menuOpen()) {
        <nav id="mobile-navigation" class="mobile-nav container" aria-label="Mobile navigation">
          <a routerLink="/explore" (click)="menuOpen.set(false)">Find a stay</a>
          <a routerLink="/" fragment="destinations" (click)="menuOpen.set(false)">Destinations</a>
          <a routerLink="/saved" (click)="menuOpen.set(false)">Saved stays</a>
          <a routerLink="/reservations" (click)="menuOpen.set(false)">My reservations</a>
          <a routerLink="/" fragment="the-oriva-way" (click)="menuOpen.set(false)">The Oriva way</a>
        </nav>
      }
    </header>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .top-note {
        background: var(--color-primary);
        color: #f2f4e9;
        text-align: center;
        font-size: 9px;
        letter-spacing: 0.035em;
        padding: 7px 16px;
        line-height: 1.5;
      }
      .top-note a {
        margin-left: 25px;
        color: var(--color-accent);
      }
      .top-note app-icon {
        margin-left: 6px;
      }
      .site-header {
        position: sticky;
        top: 0;
        z-index: 20;
        background: var(--color-background);
        border-bottom: 1px solid #daddd266;
      }
      .nav {
        height: 88px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
      }
      .wordmark {
        font-family: var(--font-display);
        font-size: 38px;
        font-weight: 500;
        letter-spacing: -2px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        line-height: 1;
      }
      .brand-mark {
        font-family: Georgia;
        font-size: 31px;
        font-weight: 400;
        margin-right: 2px;
      }
      .wordmark-dot {
        margin-left: -8px;
        color: var(--color-secondary);
      }
      .desktop-nav {
        display: flex;
        align-items: center;
        gap: 32px;
        font-size: 11px;
        margin-left: 34px;
      }
      .desktop-nav a {
        padding: 9px 0;
        position: relative;
      }
      .desktop-nav a:hover,
      .desktop-nav a.active {
        color: var(--color-secondary);
      }
      .desktop-nav a.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 20px;
        height: 1px;
        background: var(--color-primary);
      }
      .desktop-nav app-icon {
        margin-left: 4px;
      }
      .nav-actions {
        display: flex;
        align-items: center;
        gap: 24px;
        font-size: 11px;
      }
      .saved-link {
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .saved-count {
        border-radius: 50%;
        font-size: 9px;
        background: var(--color-accent);
        width: 17px;
        height: 17px;
        display: grid;
        place-items: center;
      }
      .reservation-link {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 11px 16px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
      }
      .reservation-link:hover {
        background: var(--color-surface);
      }
      .mobile-menu {
        display: none;
      }
      .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-bottom: 18px;
      }
      .mobile-nav a {
        padding: 10px 0;
        border-top: 1px solid var(--color-border);
      }
      .footer-brand .wordmark {
        font-size: 34px;
      }
      @media (max-width: 1100px) {
        .desktop-nav {
          gap: 20px;
          margin-left: 0;
        }
        .nav-actions {
          gap: 16px;
        }
      }
      @media (max-width: 900px) {
        .nav {
          height: 76px;
          gap: 20px;
        }
        .desktop-nav {
          font-size: 10px;
          gap: 18px;
        }
        .nav-actions {
          gap: 16px;
        }
        .saved-link span:not(.saved-count) {
          display: none;
        }
        .reservation-link {
          padding: 9px 12px;
          gap: 8px;
          font-size: 10px;
        }
      }
      @media (max-width: 650px) {
        .top-note {
          font-size: 8px;
          padding: 6px 10px;
        }
        .top-note a {
          display: none;
        }
        .nav {
          height: 70px;
        }
        .wordmark {
          font-size: 33px;
        }
        .brand-mark {
          font-size: 27px;
        }
        .desktop-nav,
        .reservation-link {
          display: none;
        }
        .mobile-menu {
          display: inline-flex;
          width: 36px;
          height: 36px;
          border: 0;
        }
        .nav-actions {
          gap: 15px;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  readonly store = inject(StayStore);
  readonly menuOpen = signal(false);
}
