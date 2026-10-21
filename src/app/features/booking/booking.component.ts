import { CalendarDatePipe } from '../../shared/pipes/calendar-date.pipe';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StayStore } from '../../core/stay-store.service';
import {
  calculatePrice,
  defaultDates,
  guestDetailsError,
  todayISO,
  validateStay,
} from '../../core/booking-rules';
import { IconComponent } from '../../shared/components/icon.component';
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, CalendarDatePipe, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent {
  readonly store = inject(StayStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly today = todayISO();
  private readonly defaults = defaultDates();
  private readonly params = this.route.snapshot.queryParamMap;
  readonly id = signal(this.route.snapshot.paramMap.get('id') ?? '');
  readonly property = computed(() => this.store.property(this.id()));
  readonly error = signal('');
  readonly submitting = signal(false);
  readonly attempted = signal(false);
  readonly form = this.fb.group({
    roomId: [this.params.get('roomId') ?? '', Validators.required],
    checkIn: [this.params.get('checkIn') ?? this.defaults.checkIn, Validators.required],
    checkOut: [this.params.get('checkOut') ?? this.defaults.checkOut, Validators.required],
    guests: [
      Number(this.params.get('guests') ?? 2),
      [Validators.required, Validators.min(1), Validators.max(16)],
    ],
    rooms: [
      Number(this.params.get('rooms') ?? 1),
      [Validators.required, Validators.min(1), Validators.max(4)],
    ],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+()\d\s.-]{7,30}$/)]],
    consent: [false, Validators.requiredTrue],
  });
  readonly selection = signal(this.form.getRawValue());
  readonly room = computed(() =>
    this.property()?.rooms.find((room) => room.id === this.selection().roomId),
  );
  readonly availabilityError = computed(() => {
    const room = this.room(),
      property = this.property(),
      v = this.selection();
    return room && property
      ? validateStay(
          v.checkIn,
          v.checkOut,
          v.guests,
          v.rooms,
          room,
          this.store.reservations(),
          property.id,
        )
      : 'Please select a room to continue.';
  });
  readonly price = computed(() => {
    const room = this.room(),
      v = this.selection();
    if (!room) return null;
    try {
      return calculatePrice(room, v.checkIn, v.checkOut, v.rooms);
    } catch {
      return null;
    }
  });
  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.selection.set(this.form.getRawValue());
      this.error.set('');
    });
  }
  invalid(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.attempted());
  }
  submit(): void {
    if (this.submitting()) return;
    this.attempted.set(true);
    this.form.markAllAsTouched();
    const v = this.form.getRawValue();
    const detailsError = guestDetailsError(v);
    if (this.availabilityError()) {
      this.error.set(this.availabilityError()!);
      return;
    }
    if (this.form.invalid || detailsError) {
      this.error.set(
        detailsError ??
          'Please complete the highlighted fields and acknowledge the demo reservation.',
      );
      return;
    }
    this.submitting.set(true);
    try {
      const reservation = this.store.reserve({
        propertyId: this.id(),
        roomId: v.roomId,
        checkIn: v.checkIn,
        checkOut: v.checkOut,
        guests: v.guests,
        rooms: v.rooms,
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        phone: v.phone,
      });
      void this.router.navigate(['/confirmation', reservation.id]);
    } catch (error: unknown) {
      this.error.set(
        error instanceof Error
          ? error.message
          : 'Your demo reservation could not be completed. Please try again.',
      );
      this.submitting.set(false);
    }
  }
}
