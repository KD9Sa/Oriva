import { Injectable } from '@angular/core';
import { calculatePrice, dateNumber, guestDetailsError } from './booking-rules';
import { DEMO_ACCOMMODATIONS } from './accommodation.repository';
import type { DemoState, Reservation } from './models';

export const STORAGE_KEY = 'oriva.demo.v1';
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const emptyState = (): DemoState => ({ version: 1, wishlist: [], reservations: [] });
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isString = (value: unknown): value is string => typeof value === 'string';

function validReservation(value: unknown): value is Reservation {
  if (!isObject(value)) return false;
  const strings = [
    'id',
    'reference',
    'propertyId',
    'roomId',
    'checkIn',
    'checkOut',
    'firstName',
    'lastName',
    'email',
    'phone',
    'createdAt',
  ] as const;
  if (!strings.every((key) => isString(value[key]) && (value[key] as string).length <= 300))
    return false;
  if (value['status'] !== 'confirmed' && value['status'] !== 'canceled') return false;
  const reservation = value as unknown as Reservation;
  const property = DEMO_ACCOMMODATIONS.find((item) => item.id === reservation.propertyId);
  const room = property?.rooms.find((item) => item.id === reservation.roomId);
  if (
    !room ||
    !Number.isInteger(reservation.guests) ||
    reservation.guests < 1 ||
    !Number.isInteger(reservation.rooms) ||
    reservation.rooms < 1 ||
    reservation.rooms > room.inventory ||
    reservation.guests > reservation.rooms * room.capacity ||
    reservation.rooms > reservation.guests
  )
    return false;
  if (
    !Number.isFinite(dateNumber(reservation.checkIn)) ||
    !Number.isFinite(dateNumber(reservation.checkOut)) ||
    reservation.checkOut <= reservation.checkIn ||
    !Number.isFinite(Date.parse(reservation.createdAt)) ||
    guestDetailsError(reservation)
  )
    return false;
  if (!isObject(value['price'])) return false;
  try {
    const expected = calculatePrice(
      room,
      reservation.checkIn,
      reservation.checkOut,
      reservation.rooms,
    );
    return Object.entries(expected).every(
      ([key, amount]) => (value['price'] as Record<string, unknown>)[key] === amount,
    );
  } catch {
    return false;
  }
}

/** Storage is untrusted. Unknown versions and malformed records never crash the app. */
export function parseDemoState(raw: string | null): DemoState {
  if (!raw) return emptyState();
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !isObject(value) ||
      value['version'] !== 1 ||
      !Array.isArray(value['wishlist']) ||
      !Array.isArray(value['reservations'])
    )
      return emptyState();
    const knownIds = new Set(DEMO_ACCOMMODATIONS.map((property) => property.id));
    const wishlist = [
      ...new Set(value['wishlist'].filter((id): id is string => isString(id) && knownIds.has(id))),
    ];
    const ids = new Set<string>();
    const reservations = value['reservations'].filter(validReservation).filter((item) => {
      if (!item.id || ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    });
    return { version: 1, wishlist, reservations };
  } catch {
    return emptyState();
  }
}

@Injectable({ providedIn: 'root' })
export class DemoStorage {
  private storage(): StoragePort | null {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage;
    } catch {
      return null;
    }
  }

  read(): DemoState {
    try {
      return parseDemoState(this.storage()?.getItem(STORAGE_KEY) ?? null);
    } catch {
      return emptyState();
    }
  }

  write(state: DemoState): boolean {
    try {
      const storage = this.storage();
      if (!storage) return false;
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  clear(): boolean {
    try {
      const storage = this.storage();
      if (!storage) return false;
      storage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }
}
