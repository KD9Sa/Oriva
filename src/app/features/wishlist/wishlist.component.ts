import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StayStore } from '../../core/stay-store.service';
import { IconComponent } from '../../shared/components/icon.component';
import { PropertyCardComponent } from '../../shared/components/property-card.component';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, IconComponent, PropertyCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container section">
      <div class="section-heading page-heading">
        <div>
          <span class="eyebrow">A LITTLE INSPIRATION, KEPT CLOSE</span>
          <h1>Your saved stays.</h1>
          <p>Beautiful places for someday. Or maybe sooner.</p>
        </div>
        <span class="saved-total">
          {{ saved().length }} {{ saved().length === 1 ? 'place' : 'places' }} to dream about
        </span>
      </div>
      @if (store.loading()) {
        <div class="property-grid">
          @for (n of [1, 2, 3]; track n) {
            <div class="skeleton skeleton-card"></div>
          }
        </div>
      } @else if (saved().length) {
        <div class="property-grid">
          @for (property of saved(); track property.id; let index = $index) {
            <app-property-card [property]="property" [priority]="index < 3" />
          }
        </div>
        <div class="wishlist-footer">
          <span>Follow a feeling. See where it takes you.</span>
          <a routerLink="/explore" class="text-link">
            Keep exploring
            <app-icon name="arrow-right" [size]="15" />
          </a>
        </div>
      } @else {
        <div class="empty-state">
          <app-icon name="heart" [size]="39" />
          <h2>A little space for your daydreams.</h2>
          <p>Tap the heart on a stay you love. We’ll keep it here, ready for your next chapter.</p>
          <a routerLink="/explore" class="button">
            Find your inspiration
            <app-icon name="arrow-up-right" [size]="16" />
          </a>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .page-heading {
        padding-top: 0;
      }
      .page-heading h1 {
        font-size: 54px;
      }
      .saved-total {
        font-size: 11px;
        color: var(--color-text-secondary);
        padding-bottom: 4px;
      }
      .wishlist-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-top: 1px solid var(--color-border);
        padding-top: 24px;
        margin-top: 40px;
        font-size: 11px;
        color: var(--color-text-secondary);
      }
      @media (max-width: 600px) {
        .page-heading {
          display: block;
        }
        .page-heading h1 {
          font-size: 42px;
        }
        .saved-total {
          display: block;
          margin-top: 20px;
        }
        .wishlist-footer {
          flex-direction: column;
          align-items: start;
        }
      }
    `,
  ],
})
export class WishlistComponent {
  readonly store = inject(StayStore);
  readonly saved = computed(() =>
    this.store.properties().filter((property) => this.store.wishlist().includes(property.id)),
  );
}
