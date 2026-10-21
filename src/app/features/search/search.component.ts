import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchFilters } from '../../core/models';
import { dateRangeError, filterAccommodations } from '../../core/booking-rules';
import { StayStore } from '../../core/stay-store.service';
import { PropertyCardComponent } from '../../shared/components/property-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, PropertyCardComponent, SearchBarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  readonly store = inject(StayStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly filters = signal<SearchFilters>({});
  readonly page = signal(1);
  readonly showFilters = signal(false);
  readonly listView = signal(false);
  readonly stayQuery = computed(() => {
    const filters = this.filters();
    const params: Record<string, string | number> = {
      guests: filters.guests ?? 2,
      rooms: filters.rooms ?? 1,
    };
    if (filters.checkIn) params['checkIn'] = filters.checkIn;
    if (filters.checkOut) params['checkOut'] = filters.checkOut;
    return params;
  });
  readonly pageSize = 6;
  readonly types = ['Boutique hotel', 'Villa', 'Riad', 'Cabin', 'Guesthouse', 'Ryokan'];
  readonly amenities = [
    'Wi-Fi',
    'Pool',
    'Breakfast',
    'Spa',
    'Restaurant',
    'Ocean view',
    'Garden',
    'Parking',
    'Air conditioning',
  ];
  readonly results = computed(() =>
    filterAccommodations(this.store.properties(), this.filters(), this.store.reservations()),
  );
  readonly pages = computed(() => Math.max(1, Math.ceil(this.results().length / this.pageSize)));
  readonly currentPage = computed(() => Math.min(this.page(), this.pages()));
  readonly visibleResults = computed(() =>
    this.results().slice(
      (this.currentPage() - 1) * this.pageSize,
      this.currentPage() * this.pageSize,
    ),
  );
  readonly pageNumbers = computed(() => Array.from({ length: this.pages() }, (_, i) => i + 1));
  readonly dateError = computed(() => {
    const f = this.filters();
    return f.checkIn && f.checkOut ? dateRangeError(f.checkIn, f.checkOut) : null;
  });
  readonly activeFilters = computed(() => {
    const f = this.filters();
    const chips: { label: string; key: string }[] = [];
    if (f.type) chips.push({ label: f.type, key: 'type' });
    if (f.maxPrice) chips.push({ label: `Under $${f.maxPrice}`, key: 'maxPrice' });
    if (f.minRating) chips.push({ label: `${f.minRating}+ rating`, key: 'minRating' });
    for (const amenity of f.amenities ?? [])
      chips.push({ label: amenity, key: `amenity:${amenity}` });
    return chips;
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const number = (key: string): number | undefined => {
        const value = Number(params.get(key));
        return Number.isFinite(value) && value > 0 ? value : undefined;
      };
      this.filters.set({
        destination: params.get('destination') ?? '',
        checkIn: params.get('checkIn') ?? undefined,
        checkOut: params.get('checkOut') ?? undefined,
        guests: number('guests') ?? 2,
        rooms: number('rooms') ?? 1,
        maxPrice: number('maxPrice'),
        type: params.get('type') ?? '',
        amenities: params.get('amenities')?.split(',').filter(Boolean) ?? [],
        minRating: number('minRating'),
        sort: params.get('sort') ?? 'recommended',
      });
      this.page.set(Math.max(1, Math.floor(number('page') ?? 1)));
    });
  }

  updateFilter(key: string, value: string | number | null): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  toggleAmenity(amenity: string): void {
    const values = this.filters().amenities ?? [];
    const next = values.includes(amenity)
      ? values.filter((value) => value !== amenity)
      : [...values, amenity];
    this.updateFilter('amenities', next.join(','));
  }

  removeFilter(key: string): void {
    if (key.startsWith('amenity:')) this.toggleAmenity(key.slice(8));
    else this.updateFilter(key, null);
  }

  resetFilters(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: null,
        maxPrice: null,
        minRating: null,
        amenities: null,
        sort: null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  exploreAll(): void {
    void this.router.navigate(['/explore']);
  }

  goToPage(page: number): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
