import { CalendarDatePipe } from '../../shared/pipes/calendar-date.pipe';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StayStore } from '../../core/stay-store.service';
import { todayISO } from '../../core/booking-rules';
import { Reservation } from '../../core/models';
import { IconComponent } from '../../shared/components/icon.component';
type ReservationTab = 'upcoming' | 'past' | 'canceled';
@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CalendarDatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent {
  readonly store = inject(StayStore);
  readonly tab = signal<ReservationTab>('upcoming');
  readonly today = todayISO();
  readonly cancelDialog = viewChild<ElementRef<HTMLDialogElement>>('cancelDialog');
  readonly cancelTarget = signal<Reservation | null>(null);
  readonly error = signal('');
  readonly tabs: { id: ReservationTab; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming & current' },
    { id: 'past', label: 'Past stays' },
    { id: 'canceled', label: 'Canceled' },
  ];
  readonly filtered = computed(() =>
    this.store
      .reservations()
      .filter((booking) => this.inTab(booking, this.tab()))
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn)),
  );
  inTab(booking: Reservation, tab: ReservationTab): boolean {
    return tab === 'canceled'
      ? booking.status === 'canceled'
      : booking.status === 'confirmed' &&
          (tab === 'past' ? booking.checkOut <= this.today : booking.checkOut > this.today);
  }
  count(tab: ReservationTab): number {
    return this.store.reservations().filter((booking) => this.inTab(booking, tab)).length;
  }
  roomName(booking: Reservation): string {
    return (
      this.store.property(booking.propertyId)?.rooms.find((room) => room.id === booking.roomId)
        ?.name ?? 'Your selected room'
    );
  }
  openCancel(booking: Reservation): void {
    this.cancelTarget.set(booking);
    this.error.set('');
    this.cancelDialog()?.nativeElement.showModal();
  }
  closeCancel(): void {
    this.cancelDialog()?.nativeElement.close();
    this.cancelTarget.set(null);
  }
  cancel(): void {
    const booking = this.cancelTarget();
    if (!booking) return;
    try {
      this.store.cancel(booking.id);
      this.closeCancel();
      this.tab.set('canceled');
    } catch (error: unknown) {
      this.error.set(
        error instanceof Error ? error.message : 'Cancellation failed. Please try again.',
      );
    }
  }
}
