import { Injectable, inject, signal } from '@angular/core';
import { AccommodationRepository } from './accommodation.repository';
import { calculatePrice, guestDetailsError, todayISO, validateStay } from './booking-rules';
import { DemoStorage } from './demo-storage';
import type { Accommodation, BookingRequest, Reservation } from './models';

@Injectable({ providedIn: 'root' })
export class StayStore {
  private readonly repository = inject(AccommodationRepository);
  private readonly storage = inject(DemoStorage);
  private readonly initial = this.storage.read();
  readonly properties = signal<Accommodation[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly wishlist = signal<string[]>(this.initial.wishlist);
  readonly reservations = signal<Reservation[]>(this.initial.reservations);
  readonly toast = signal('');
  private loadPromise: Promise<void> | null = null;
  private notificationSequence = 0;

  async load(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;
    this.loading.set(true);
    this.error.set(null);
    this.loadPromise = this.repository
      .list()
      .then((properties) => {
        this.properties.set(properties);
      })
      .catch(() => {
        this.error.set('We could not load the stays. Please try again.');
      })
      .finally(() => {
        this.loading.set(false);
        this.loadPromise = null;
      });
    return this.loadPromise;
  }

  property(id: string): Accommodation | undefined {
    return this.properties().find((property) => property.id === id);
  }
  reservation(id: string): Reservation | undefined {
    return this.reservations().find(
      (reservation) => reservation.id === id || reservation.reference === id,
    );
  }
  isSaved(id: string): boolean {
    return this.wishlist().includes(id);
  }

  toggleWishlist(id: string): void {
    if (!this.property(id)) return;
    const wasSaved = this.isSaved(id);
    this.wishlist.update((ids) => (wasSaved ? ids.filter((value) => value !== id) : [...ids, id]));
    const saved = this.persist();
    this.notify(
      saved
        ? wasSaved
          ? 'Removed from your saved stays.'
          : 'A little inspiration, saved for later.'
        : 'Updated for this visit. Browser storage is unavailable.',
    );
  }

  notify(message: string): void {
    this.toast.set(message);
    const sequence = ++this.notificationSequence;
    setTimeout(() => {
      if (sequence === this.notificationSequence) this.toast.set('');
    }, 4500);
  }

  reserve(request: BookingRequest): Reservation {
    // Re-read before a write to reduce stale inventory in other tabs. This remains a demo,
    // not a transactional inventory guarantee: a real backend must enforce atomic booking.
    const current = this.storage.read();
    const merged = new Map(this.reservations().map((item) => [item.id, item]));
    for (const reservation of current.reservations) merged.set(reservation.id, reservation);
    this.reservations.set([...merged.values()]);
    const property = this.property(request.propertyId);
    const room = property?.rooms.find((item) => item.id === request.roomId);
    if (!property || !room)
      throw new Error('This stay or room could not be found. Please choose a room again.');
    const duplicate = this.reservations().find(
      (item) =>
        item.status === 'confirmed' &&
        item.propertyId === request.propertyId &&
        item.roomId === request.roomId &&
        item.checkIn === request.checkIn &&
        item.checkOut === request.checkOut &&
        item.email.toLowerCase() === request.email.trim().toLowerCase() &&
        item.guests === request.guests &&
        item.rooms === request.rooms,
    );
    const competingReservations = duplicate
      ? this.reservations().filter((item) => item.id !== duplicate.id)
      : this.reservations();
    const error =
      validateStay(
        request.checkIn,
        request.checkOut,
        request.guests,
        request.rooms,
        room,
        competingReservations,
        property.id,
      ) || guestDetailsError(request);
    if (error) throw new Error(error);
    if (duplicate) return duplicate;
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const reservation: Reservation = {
      ...request,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      email: request.email.trim().toLowerCase(),
      phone: request.phone.trim(),
      id,
      reference: `OR-${id.replaceAll('-', '').slice(-8).toUpperCase()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      price: calculatePrice(room, request.checkIn, request.checkOut, request.rooms),
    };
    this.reservations.update((items) => [reservation, ...items]);
    const saved = this.persist();
    this.notify(
      saved
        ? 'Your demo reservation is confirmed.'
        : 'Demo reservation confirmed for this visit. Browser storage is unavailable.',
    );
    return reservation;
  }

  cancel(id: string): void {
    const reservation = this.reservation(id);
    if (!reservation) throw new Error('This reservation could not be found.');
    if (reservation.status === 'canceled') return;
    if (reservation.checkIn <= todayISO())
      throw new Error('Demo reservations can be canceled until the day before check-in.');
    this.reservations.update((items) =>
      items.map((item) => (item.id === reservation.id ? { ...item, status: 'canceled' } : item)),
    );
    const saved = this.persist();
    this.notify(
      saved
        ? 'Demo reservation canceled. Your rooms are available again.'
        : 'Canceled for this visit. Browser storage is unavailable.',
    );
  }

  resetDemo(): void {
    this.wishlist.set([]);
    this.reservations.set([]);
    const cleared = this.storage.clear();
    this.notify(
      cleared
        ? 'Your demo data has been reset.'
        : 'Demo data reset for this visit. Browser storage is unavailable.',
    );
  }

  private persist(): boolean {
    return this.storage.write({
      version: 1,
      wishlist: this.wishlist(),
      reservations: this.reservations(),
    });
  }
}

export { StayStore as StayStoreService };
