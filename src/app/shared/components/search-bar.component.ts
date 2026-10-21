import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defaultDates, dateRangeError, todayISO } from '../../core/booking-rules';
import { IconComponent } from './icon.component';
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="search-bar"
      [class.compact]="compact"
      (ngSubmit)="search()"
      aria-label="Find your stay"
    >
      <div class="search-field destination">
        <app-icon name="pin" [size]="20" />
        <div>
          <label for="destination">Where to?</label>
          <input
            id="destination"
            name="destination"
            placeholder="Your next somewhere"
            [(ngModel)]="destination"
            list="destinations"
            autocomplete="off"
          />
          <datalist id="destinations">
            @for (place of destinations; track place) {
              <option [value]="place"></option>
            }
          </datalist>
        </div>
      </div>
      <div class="search-field">
        <app-icon name="calendar" [size]="19" />
        <div>
          <label for="check-in">Check in</label>
          <input
            id="check-in"
            type="date"
            name="checkIn"
            [(ngModel)]="checkIn"
            [min]="today"
            required
          />
        </div>
      </div>
      <div class="search-field">
        <app-icon name="calendar" [size]="19" />
        <div>
          <label for="check-out">Check out</label>
          <input
            id="check-out"
            type="date"
            name="checkOut"
            [(ngModel)]="checkOut"
            [min]="checkIn"
            required
          />
        </div>
      </div>
      <div class="search-field guests">
        <app-icon name="users" [size]="20" />
        <div>
          <label for="guests">Travelers</label>
          <div class="guest-inputs">
            <select id="guests" name="guests" [(ngModel)]="guests" aria-label="Guests">
              @for (n of guestOptions; track n) {
                <option [ngValue]="n">{{ n }} {{ n === 1 ? 'guest' : 'guests' }}</option>
              }
            </select>
            <select name="rooms" [(ngModel)]="rooms" aria-label="Rooms">
              @for (n of roomOptions; track n) {
                <option [ngValue]="n">{{ n }} {{ n === 1 ? 'room' : 'rooms' }}</option>
              }
            </select>
          </div>
        </div>
      </div>
      <button class="button search-submit" type="submit">
        <app-icon name="search" [size]="17" />
        <span>Find my stay</span>
      </button>
    </form>
    @if (error()) {
      <p class="search-error" role="alert">{{ error() }}</p>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .search-bar {
        display: grid;
        grid-template-columns: 1.4fr 1fr 1fr 1.25fr auto;
        align-items: center;
        background: var(--color-elevated);
        box-shadow: var(--shadow);
        border: 1px solid var(--color-border);
        border-radius: 7px;
        padding: 19px 22px;
        gap: 0;
      }
      .search-field {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 0 20px;
        border-right: 1px solid var(--color-border);
        min-width: 0;
      }
      .search-field:first-child {
        padding-left: 0;
      }
      .search-field > div {
        min-width: 0;
        width: 100%;
      }
      .search-field label {
        display: block;
        font-size: 10px;
        font-weight: 600;
        margin-bottom: 3px;
      }
      .search-field input,
      .search-field select {
        border: 0;
        background: transparent;
        width: 100%;
        padding: 0;
        min-width: 0;
        line-height: 1.8;
        font-size: 11px;
        color: var(--color-text-secondary);
        outline-offset: 3px;
      }
      .search-field input[type='date'] {
        font-size: 11px;
      }
      .search-field input::placeholder {
        color: var(--color-muted);
      }
      .search-submit {
        margin-left: 22px;
        min-height: 48px;
        padding-inline: 23px;
      }
      .guest-inputs {
        display: flex;
        gap: 3px;
      }
      .guest-inputs select {
        appearance: auto;
        font-size: 10px;
      }
      .search-error {
        background: var(--color-elevated);
        color: var(--color-error);
        padding: 10px 20px;
        font-size: 12px;
        margin: 8px 0 0;
        border-radius: 4px;
      }
      .compact {
        box-shadow: none;
        background: var(--color-elevated);
      }
      @media (max-width: 1100px) {
        .search-bar {
          padding: 16px;
        }
        .search-field {
          padding-inline: 12px;
          gap: 8px;
        }
        .search-submit {
          margin-left: 14px;
          padding-inline: 14px;
        }
        .search-field app-icon {
          display: none;
        }
      }
      @media (max-width: 800px) {
        .search-bar {
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding: 20px;
        }
        .search-field {
          padding: 0;
          border: 0;
        }
        .destination {
          grid-column: 1/-1;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
        }
        .search-field app-icon {
          display: inline-flex;
        }
        .guests {
          grid-column: 1;
        }
        .search-submit {
          margin: 0;
          grid-column: 2;
        }
        .search-field input,
        .search-field input[type='date'] {
          font-size: 13px;
        }
        .search-field label {
          font-size: 11px;
        }
        .guest-inputs select {
          font-size: 11px;
        }
      }
      @media (max-width: 400px) {
        .search-bar {
          padding: 15px;
          gap: 12px;
        }
        .search-field app-icon {
          display: none;
        }
        .search-submit {
          padding-inline: 9px;
          font-size: 11px;
        }
      }
    `,
  ],
})
export class SearchBarComponent {
  @Input() compact = false;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dates = defaultDates();
  readonly today = todayISO();
  readonly error = signal('');
  readonly guestOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
  readonly roomOptions = [1, 2, 3, 4];
  readonly destinations = [
    'Italy',
    'Greece',
    'Portugal',
    'Morocco',
    'Bali',
    'Japan',
    'Amalfi Coast',
    'Santorini',
    'Comporta',
    'Marrakech',
    'Ubud',
    'Kyoto',
  ];
  destination = this.route.snapshot.queryParamMap.get('destination') ?? '';
  checkIn = this.route.snapshot.queryParamMap.get('checkIn') ?? this.dates.checkIn;
  checkOut = this.route.snapshot.queryParamMap.get('checkOut') ?? this.dates.checkOut;
  guests = Number(this.route.snapshot.queryParamMap.get('guests') ?? 2);
  rooms = Number(this.route.snapshot.queryParamMap.get('rooms') ?? 1);
  constructor() {
    const changeDetector = inject(ChangeDetectorRef);
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.destination = params.get('destination') ?? '';
      this.checkIn = params.get('checkIn') ?? this.dates.checkIn;
      this.checkOut = params.get('checkOut') ?? this.dates.checkOut;
      this.guests = Number(params.get('guests') ?? 2);
      this.rooms = Number(params.get('rooms') ?? 1);
      this.error.set('');
      changeDetector.markForCheck();
    });
  }
  search(): void {
    const error = dateRangeError(this.checkIn, this.checkOut);
    if (error) {
      this.error.set(error);
      return;
    }
    if (this.rooms > this.guests) {
      this.error.set('Please choose at least one guest per room.');
      return;
    }
    this.error.set('');
    void this.router.navigate(['/explore'], {
      queryParams: {
        destination: this.destination.trim() || null,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        guests: this.guests,
        rooms: this.rooms,
      },
    });
  }
}
