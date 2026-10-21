import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Accommodation } from '../../core/models';
import { StayStore } from '../../core/stay-store.service';
import { IconComponent } from './icon.component';
@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="stay-card">
      <div class="stay-image">
        <a
          [routerLink]="['/stays', property.id]"
          [queryParams]="queryParams"
          [attr.aria-label]="'Discover ' + property.name"
        >
          <img
            [src]="property.image"
            [alt]="property.imageAlt"
            width="720"
            height="520"
            [loading]="priority ? 'eager' : 'lazy'"
            [attr.fetchpriority]="priority ? 'high' : 'auto'"
            (error)="imageFallback($event)"
          />
        </a>
        <span class="collection-label">{{ property.category }}</span>
        <button
          class="save"
          type="button"
          [class.saved]="store.isSaved(property.id)"
          [attr.aria-pressed]="store.isSaved(property.id)"
          [attr.aria-label]="(store.isSaved(property.id) ? 'Remove ' : 'Save ') + property.name"
          (click)="store.toggleWishlist(property.id)"
        >
          <app-icon name="heart" [size]="18" />
        </button>
      </div>
      <div class="stay-meta">
        <span>{{ property.location }}, {{ property.country }}</span>
        <span class="rating">
          <app-icon name="star" [size]="12" />
          {{ property.rating.toFixed(2) }}
        </span>
      </div>
      <h3>
        <a [routerLink]="['/stays', property.id]" [queryParams]="queryParams">
          {{ property.name }}
        </a>
      </h3>
      <div class="stay-bottom">
        <span>
          {{ property.type }}
          <span class="dot">·</span>
          Up to {{ capacity }} guests
        </span>
        <span class="price">
          {{ property.nightlyRateCents / 100 | currency: 'USD' : 'symbol' : '1.0-0' }}
          <small>/ night</small>
        </span>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .stay-image {
        aspect-ratio: 1.45;
        position: relative;
        overflow: hidden;
        border-radius: 6px;
        background: var(--color-surface);
      }
      .stay-image > a {
        display: block;
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        transition: transform 0.6s var(--ease);
      }
      .stay-card:hover img {
        transform: scale(1.035);
      }
      .collection-label {
        position: absolute;
        left: 14px;
        top: 14px;
        font-size: 9px;
        letter-spacing: 0.02em;
        padding: 5px 9px;
        background: var(--color-background);
        border-radius: 3px;
      }
      .save {
        position: absolute;
        right: 12px;
        top: 12px;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-elevated);
        border: 0;
        border-radius: 50%;
        color: var(--color-primary);
      }
      .save.saved {
        background: var(--color-accent);
      }
      .save.saved app-icon {
        fill: var(--color-primary);
      }
      .save:hover {
        background: var(--color-accent);
      }
      .stay-meta {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin: 17px 0 7px;
        color: var(--color-text-secondary);
        font-size: 10px;
      }
      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        color: var(--color-primary);
        font-weight: 500;
      }
      h3 {
        font-size: 23px;
        letter-spacing: -0.025em;
        margin: 0 0 12px;
      }
      h3 a:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      .stay-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        font-size: 10px;
        color: var(--color-text-secondary);
      }
      .dot {
        padding-inline: 3px;
      }
      .price {
        font-size: 19px;
        font-weight: 500;
        color: var(--color-primary);
        white-space: nowrap;
      }
      .price small {
        font-size: 10px;
        font-weight: 400;
        color: var(--color-text-secondary);
      }
      @media (max-width: 600px) {
        .stay-image {
          aspect-ratio: 1.4;
        }
        .stay-meta {
          font-size: 11px;
        }
        .stay-bottom {
          font-size: 11px;
        }
      }
    `,
  ],
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Accommodation;
  @Input() priority = false;
  @Input() queryParams: Record<string, string | number> = {};
  readonly store = inject(StayStore);
  get capacity(): number {
    return Math.max(...this.property.rooms.map((room) => room.capacity));
  }
  imageFallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/assets/images/hero.jpg')) image.src = '/assets/images/hero.jpg';
  }
}
