import { CalendarDatePipe } from '../../shared/pipes/calendar-date.pipe';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StayStore } from '../../core/stay-store.service';
import { IconComponent } from '../../shared/components/icon.component';
@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CurrencyPipe, CalendarDatePipe, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container section confirmation">
      @if (reservation(); as booking) {
        <div class="confirmation-heading">
          <div class="success-mark">
            <app-icon [name]="booking.status === 'canceled' ? 'close' : 'check'" [size]="31" />
          </div>
          <span class="eyebrow">
            {{
              booking.status === 'canceled'
                ? 'A CHANGE OF PLANS'
                : 'A LITTLE ELSEWHERE, AWAITING YOU'
            }}
          </span>
          <h1>
            {{
              booking.status === 'canceled'
                ? 'Room for a new chapter.'
                : 'Your next chapter is booked.'
            }}
          </h1>
          <p>
            {{
              booking.status === 'canceled'
                ? 'This demo reservation has been canceled. Your next adventure is still out there.'
                : 'We’re glad you found your somewhere, ' +
                  booking.firstName +
                  '. Here’s every little detail.'
            }}
          </p>
          <span class="status" [class.canceled]="booking.status === 'canceled'">
            Demo reservation {{ booking.status }}
          </span>
        </div>
        @if (property(); as stay) {
          <article class="confirmation-card panel">
            <div class="confirmation-photo">
              <img [src]="stay.image" [alt]="stay.imageAlt" width="700" height="800" />
              <span>YOUR LITTLE ELSEWHERE</span>
            </div>
            <div class="confirmation-details">
              <div class="reference">
                <span>BOOKING REFERENCE</span>
                <strong>{{ booking.reference }}</strong>
              </div>
              <h2>{{ stay.name }}</h2>
              <p class="location">
                <app-icon name="pin" [size]="14" />
                {{ stay.location }}, {{ stay.country }}
              </p>
              <div class="room-name">{{ roomName() }}</div>
              <div class="details-grid">
                <div>
                  <span>CHECK IN</span>
                  <strong>{{ booking.checkIn | calendarDate: 'EEE, dd MMM yyyy' }}</strong>
                  <small>From {{ stay.checkInTime }}</small>
                </div>
                <div>
                  <span>CHECK OUT</span>
                  <strong>{{ booking.checkOut | calendarDate: 'EEE, dd MMM yyyy' }}</strong>
                  <small>By {{ stay.checkOutTime }}</small>
                </div>
                <div>
                  <span>TRAVELERS</span>
                  <strong>
                    {{ booking.guests }} guests · {{ booking.rooms }}
                    {{ booking.rooms === 1 ? 'room' : 'rooms' }}
                  </strong>
                  <small>
                    {{ booking.price.nights }}
                    {{ booking.price.nights === 1 ? 'night' : 'nights' }} of a different pace
                  </small>
                </div>
                <div>
                  <span>LEAD GUEST</span>
                  <strong>{{ booking.firstName }} {{ booking.lastName }}</strong>
                  <small>{{ booking.email }}</small>
                </div>
              </div>
              <div class="receipt-lines">
                <div>
                  <span>Room subtotal</span>
                  <span>{{ booking.price.subtotalCents / 100 | currency }}</span>
                </div>
                <div>
                  <span>Cleaning, service & taxes</span>
                  <span>
                    {{
                      (booking.price.cleaningFeeCents +
                        booking.price.serviceFeeCents +
                        booking.price.taxCents) /
                        100 | currency
                    }}
                  </span>
                </div>
              </div>
              <div class="confirmation-total">
                <span>
                  Total
                  <small>USD</small>
                </span>
                <strong>{{ booking.price.totalCents / 100 | currency }}</strong>
              </div>
              <p class="charge-note">Simulated total · No payment made</p>
            </div>
          </article>
        }
        <div class="confirmation-notes">
          <div>
            <app-icon name="calendar" [size]="22" />
            <h3>Room to change your mind.</h3>
            <p>
              Cancel before your check-in date through My reservations. It’s a demo, so there are no
              charges or refunds.
            </p>
          </div>
          <div>
            <app-icon name="leaf" [size]="22" />
            <h3>All the details, right here.</h3>
            <p>
              Your confirmation stays in this browser. No real room is reserved and no confirmation
              email is sent.
            </p>
          </div>
        </div>
        <div class="confirmation-actions no-print">
          <a routerLink="/reservations" class="button">
            My reservations
            <app-icon name="arrow-right" [size]="16" />
          </a>
          <button type="button" class="button secondary" (click)="print()">
            <app-icon name="print" [size]="16" />
            Print confirmation
          </button>
        </div>
        <a routerLink="/explore" class="text-link no-print">
          A little more exploring
          <app-icon name="arrow-up-right" [size]="15" />
        </a>
      } @else {
        <div class="empty-state">
          <app-icon name="compass" [size]="40" />
          <h1>We couldn’t find this chapter.</h1>
          <p>This demo reservation may belong to another browser or have been reset.</p>
          <a routerLink="/reservations" class="button">My reservations</a>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .confirmation {
        max-width: 930px;
        text-align: center;
        padding-top: 55px;
      }
      .success-mark {
        width: 66px;
        height: 66px;
        border: 1px solid var(--color-border);
        border-radius: 50%;
        display: grid;
        place-items: center;
        margin: 0 auto 24px;
        background: var(--color-accent);
      }
      .confirmation-heading .eyebrow {
        font-size: 9px;
      }
      .confirmation-heading h1 {
        font-size: 48px;
        margin-bottom: 15px;
      }
      .confirmation-heading > p {
        font-size: 12px;
        color: var(--color-text-secondary);
      }
      .confirmation-heading .status {
        margin-top: 7px;
      }
      .confirmation-card {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        text-align: left;
        margin: 37px auto;
        padding: 0;
        overflow: hidden;
      }
      .confirmation-photo {
        position: relative;
        min-height: 470px;
      }
      .confirmation-photo img {
        width: 100%;
        height: 100%;
        position: absolute;
      }
      .confirmation-photo > span {
        position: absolute;
        bottom: 25px;
        left: 23px;
        right: 15px;
        color: white;
        font-size: 8px;
        letter-spacing: 0.14em;
        text-shadow: 0 1px 8px #172b23;
      }
      .confirmation-details {
        padding: 30px;
      }
      .reference {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 28px;
        font-size: 10px;
      }
      .reference > span {
        font-size: 8px;
        letter-spacing: 0.1em;
        color: var(--color-muted);
      }
      .reference strong {
        font-weight: 500;
        letter-spacing: 0.05em;
      }
      .confirmation-details h2 {
        font-size: 29px;
        margin-bottom: 10px;
      }
      .location {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        color: var(--color-text-secondary);
      }
      .room-name {
        font-size: 11px;
        padding: 15px 0;
        border-block: 1px solid var(--color-border);
        margin-top: 20px;
      }
      .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px 15px;
        padding: 24px 0;
      }
      .details-grid > div {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }
      .details-grid span {
        font-size: 8px;
        letter-spacing: 0.09em;
        color: var(--color-muted);
      }
      .details-grid strong {
        font-size: 11px;
        font-weight: 500;
      }
      .details-grid small {
        font-size: 9px;
        color: var(--color-text-secondary);
        overflow-wrap: anywhere;
      }
      .receipt-lines {
        font-size: 10px;
        color: var(--color-text-secondary);
        display: flex;
        flex-direction: column;
        gap: 7px;
        border-top: 1px solid var(--color-border);
        padding-top: 17px;
      }
      .receipt-lines > div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }
      .confirmation-total {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--color-border);
        padding-top: 18px;
        margin-top: 18px;
        font-size: 20px;
      }
      .confirmation-total small {
        font-size: 10px;
        color: var(--color-muted);
      }
      .confirmation-total strong {
        font-weight: 500;
      }
      .charge-note {
        font-size: 9px;
        color: var(--color-muted);
        margin-top: 7px;
        margin-bottom: 0;
      }
      .confirmation-notes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 35px;
        text-align: left;
        padding-inline: 10px;
      }
      .confirmation-notes h3 {
        font-size: 21px;
        margin: 13px 0 10px;
      }
      .confirmation-notes p {
        font-size: 11px;
        color: var(--color-text-secondary);
        line-height: 1.8;
      }
      .confirmation-actions {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin: 25px 0 20px;
      }
      .confirmation > .text-link {
        font-size: 11px;
      }
      @media (max-width: 650px) {
        .confirmation {
          padding-top: 35px;
        }
        .confirmation-heading h1 {
          font-size: 37px;
        }
        .confirmation-card {
          grid-template-columns: 1fr;
        }
        .confirmation-photo {
          min-height: 230px;
        }
        .confirmation-details {
          padding: 24px;
        }
        .confirmation-notes {
          grid-template-columns: 1fr;
          gap: 15px;
        }
        .confirmation-actions {
          flex-direction: column;
        }
        .details-grid {
          gap: 20px 12px;
        }
        .confirmation-details h2 {
          font-size: 30px;
        }
      }
      @media print {
        .confirmation {
          max-width: 100%;
          padding-top: 0;
        }
        .confirmation-card {
          grid-template-columns: 0.7fr 1.3fr;
          margin: 20px 0;
        }
        .confirmation-heading h1 {
          font-size: 35px;
        }
        .success-mark {
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
        }
        .confirmation-notes {
          display: none;
        }
        .confirmation-photo {
          min-height: 400px;
        }
      }
    `,
  ],
})
export class ConfirmationComponent {
  readonly store = inject(StayStore);
  private readonly route = inject(ActivatedRoute);
  readonly reservation = computed(() =>
    this.store.reservation(this.route.snapshot.paramMap.get('id') ?? ''),
  );
  readonly property = computed(() => {
    const booking = this.reservation();
    return booking ? this.store.property(booking.propertyId) : undefined;
  });
  readonly roomName = computed(
    () =>
      this.property()?.rooms.find((room) => room.id === this.reservation()?.roomId)?.name ??
      'Your selected room',
  );
  print(): void {
    window.print();
  }
}
