import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AccommodationRepository,
  DEMO_ACCOMMODATIONS,
  DemoAccommodationRepository,
} from '../src/app/core/accommodation.repository';
import {
  addDays,
  availableInventory,
  calculatePrice,
  dateNumber,
  dateRangeError,
  defaultDates,
  filterAccommodations,
  guestDetailsError,
  nightCount,
  rangesOverlap,
  todayISO,
  validateStay,
} from '../src/app/core/booking-rules';
import { DemoStorage, parseDemoState } from '../src/app/core/demo-storage';
import type { BookingRequest, DemoState, Reservation, Room } from '../src/app/core/models';
import { StayStore } from '../src/app/core/stay-store.service';

const room: Room = {
  id: 'signature-room',
  name: 'Test room',
  capacity: 2,
  inventory: 3,
  nightlyRateCents: 24500,
  description: 'Two guests',
};
const start = '2030-04-10';
const end = '2030-04-14';
const request: BookingRequest = {
  propertyId: 'casa-della-luce',
  roomId: room.id,
  checkIn: start,
  checkOut: end,
  guests: 2,
  rooms: 1,
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex@example.com',
  phone: '+20 123 456 7890',
};
function reservation(overrides: Partial<Reservation> = {}): Reservation {
  return {
    ...request,
    id: 'existing-01',
    reference: 'OR-EXISTING',
    createdAt: '2029-10-21T12:00:00Z',
    status: 'confirmed',
    price: calculatePrice(room, start, end),
    ...overrides,
  };
}

class MemoryStorage extends DemoStorage {
  state: DemoState = { version: 1, wishlist: [], reservations: [] };
  override read(): DemoState {
    return structuredClone(this.state);
  }
  override write(state: DemoState): boolean {
    this.state = structuredClone(state);
    return true;
  }
  override clear(): boolean {
    this.state = { version: 1, wishlist: [], reservations: [] };
    return true;
  }
}

function createStore(
  storage: DemoStorage = new MemoryStorage(),
  repo: AccommodationRepository = new DemoAccommodationRepository(),
): StayStore {
  const injector = Injector.create({
    providers: [
      { provide: AccommodationRepository, useValue: repo },
      { provide: DemoStorage, useValue: storage },
    ],
  });
  return runInInjectionContext(injector, () => new StayStore());
}

describe('calendar rules', () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date('2029-10-21T12:00:00Z') }));
  afterEach(() => vi.useRealTimers());
  it('uses valid calendar dates and UTC calendar differences across DST', () => {
    expect(Number.isNaN(dateNumber('2030-02-30'))).toBe(true);
    expect(Number.isNaN(dateNumber('04/10/2030'))).toBe(true);
    expect(nightCount('2030-03-30', '2030-04-02')).toBe(3);
    expect(addDays('2032-02-28', 2)).toBe('2032-03-01');
  });
  it('rejects past dates, reversed dates, zero nights and stays above 30 nights', () => {
    expect(dateRangeError('2020-01-01', '2020-01-03')).toContain('today');
    expect(dateRangeError(end, start)).toContain('after');
    expect(dateRangeError(start, start)).toContain('after');
    expect(dateRangeError(start, addDays(start, 31))).toContain('30');
    expect(dateRangeError(start, end)).toBeNull();
  });
  it('produces future default dates and half-open reservation ranges', () => {
    const dates = defaultDates();
    expect(dates.checkIn).toBe(addDays(todayISO(), 14));
    expect(nightCount(dates.checkIn, dates.checkOut)).toBe(4);
    expect(rangesOverlap(start, end, end, '2030-04-18')).toBe(false);
    expect(rangesOverlap(start, end, '2030-04-13', '2030-04-18')).toBe(true);
  });
});

describe('integer-cent pricing', () => {
  it('calculates transparent nightly, cleaning, service and tax lines', () => {
    expect(calculatePrice(room, start, end)).toEqual({
      nights: 4,
      nightlyRateCents: 24500,
      subtotalCents: 98000,
      cleaningFeeCents: 3500,
      serviceFeeCents: 4900,
      taxCents: 10640,
      totalCents: 117040,
    });
  });
  it('rounds percentage fees once per line and scales room counts consistently', () => {
    const price = calculatePrice({ ...room, nightlyRateCents: 19999 }, start, '2030-04-11', 2);
    expect(price).toEqual({
      nights: 1,
      nightlyRateCents: 19999,
      subtotalCents: 39998,
      cleaningFeeCents: 7000,
      serviceFeeCents: 2000,
      taxCents: 4900,
      totalCents: 53898,
    });
    expect(Object.values(price).every(Number.isSafeInteger)).toBe(true);
    expect(() => calculatePrice(room, end, start)).toThrow();
  });
});

describe('capacity and inventory', () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date('2029-10-21T12:00:00Z') }));
  afterEach(() => vi.useRealTimers());
  it('validates integer guests, room inventory, at least one guest per room, capacity', () => {
    expect(validateStay(start, end, 2.5, 1, room, [], request.propertyId)).toContain('guests');
    expect(validateStay(start, end, 2, 4, room, [], request.propertyId)).toContain('rooms');
    expect(validateStay(start, end, 1, 2, room, [], request.propertyId)).toContain('one guest');
    expect(validateStay(start, end, 3, 1, room, [], request.propertyId)).toContain('accommodates');
    expect(validateStay(start, end, 4, 2, room, [], request.propertyId)).toBeNull();
  });
  it('blocks overlapping exhausted inventory and frees canceled rooms', () => {
    const occupied = reservation({ rooms: 3, guests: 6 });
    expect(availableInventory(room, start, end, [occupied], request.propertyId)).toBe(0);
    expect(validateStay(start, end, 2, 1, room, [occupied], request.propertyId)).toContain(
      'unavailable',
    );
    expect(
      availableInventory(
        room,
        start,
        end,
        [{ ...occupied, status: 'canceled' }],
        request.propertyId,
      ),
    ).toBe(3);
    expect(availableInventory(room, end, '2030-04-16', [occupied], request.propertyId)).toBe(3);
  });
  it('uses peak concurrent inventory rather than adding disjoint overlaps', () => {
    const bookings = [
      reservation({ checkIn: '2030-04-09', checkOut: '2030-04-12', rooms: 2 }),
      reservation({ id: 'second', checkIn: '2030-04-12', checkOut: '2030-04-16', rooms: 2 }),
    ];
    expect(availableInventory(room, start, end, bookings, request.propertyId)).toBe(1);
    expect(validateStay(start, end, 2, 1, room, bookings, request.propertyId)).toBeNull();
  });
  it('keeps different properties and room types isolated', () => {
    const bookings = [
      reservation({ propertyId: 'aegean-house', rooms: 3 }),
      reservation({ roomId: 'terrace-suite', rooms: 1 }),
    ];
    expect(availableInventory(room, start, end, bookings, request.propertyId)).toBe(3);
  });
});

describe('discovery', () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date('2029-10-21T12:00:00Z') }));
  afterEach(() => vi.useRealTimers());
  it('combines destination, price, rating, type and amenities without mutating input', () => {
    const copy = [...DEMO_ACCOMMODATIONS];
    const results = filterAccommodations(DEMO_ACCOMMODATIONS, {
      destination: 'Italy',
      type: 'Boutique hotel',
      maxPrice: 300,
      minRating: 4.9,
      amenities: ['Pool'],
    });
    expect(results.map((item) => item.id)).toEqual(['casa-della-luce']);
    expect(DEMO_ACCOMMODATIONS).toEqual(copy);
  });
  it('sorts by price and rating, supports empty and capacity-filtered results', () => {
    const prices = filterAccommodations(DEMO_ACCOMMODATIONS, { sort: 'price-asc' }).map(
      (item) => item.nightlyRateCents,
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(filterAccommodations(DEMO_ACCOMMODATIONS, { sort: 'rating' })[0]?.id).toBe(
      'villa-serena',
    );
    expect(filterAccommodations(DEMO_ACCOMMODATIONS, { destination: 'Atlantis' })).toEqual([]);
    expect(filterAccommodations(DEMO_ACCOMMODATIONS, { guests: 7, rooms: 1 })).toEqual([]);
  });
  it('applies availability to the requested dates', () => {
    const property = DEMO_ACCOMMODATIONS[0]!;
    const bookings = property.rooms.map((item, index) =>
      reservation({
        id: `full-${index}`,
        roomId: item.id,
        rooms: item.inventory,
        guests: item.inventory * item.capacity,
      }),
    );
    expect(
      filterAccommodations([property], { checkIn: start, checkOut: end, guests: 2 }, bookings),
    ).toEqual([]);
  });
  it('uses available qualifying room rates for budgets and displayed prices', () => {
    const property = DEMO_ACCOMMODATIONS[0]!;
    const fullSignature = reservation({ rooms: 3, guests: 6 });
    const filters = { checkIn: start, checkOut: end, guests: 2, maxPrice: 300 };
    expect(filterAccommodations([property], filters, [fullSignature])).toEqual([]);
    const suiteResults = filterAccommodations([property], { ...filters, maxPrice: 400 }, [
      fullSignature,
    ]);
    expect(suiteResults[0]?.nightlyRateCents).toBe(33000);
    expect(property.nightlyRateCents).toBe(24500);
    expect(filterAccommodations([property], { guests: 4 })[0]?.nightlyRateCents).toBe(33000);
  });
  it('rejects incomplete date ranges and non-integer or negative search counts', () => {
    expect(filterAccommodations(DEMO_ACCOMMODATIONS, { checkIn: start })).toEqual([]);
    expect(filterAccommodations(DEMO_ACCOMMODATIONS, { guests: -1 })).toEqual([]);
    expect(filterAccommodations(DEMO_ACCOMMODATIONS, { rooms: 1.5 })).toEqual([]);
  });
});

describe('safe persistence', () => {
  it('recovers from malformed JSON and unknown versions', () => {
    expect(parseDemoState('{broken')).toEqual({ version: 1, wishlist: [], reservations: [] });
    expect(
      parseDemoState(JSON.stringify({ version: 2, wishlist: ['x'], reservations: [] })).wishlist,
    ).toEqual([]);
  });
  it('validates nested records, ignores unknown saved IDs and deduplicates', () => {
    const state = parseDemoState(
      JSON.stringify({
        version: 1,
        wishlist: ['casa-della-luce', 'unknown', 5, 'casa-della-luce'],
        reservations: [
          reservation(),
          reservation(),
          { ...reservation({ id: 'tampered' }), price: { totalCents: 1 } },
          { propertyId: 'casa-della-luce' },
        ],
      }),
    );
    expect(state.wishlist).toEqual(['casa-della-luce']);
    expect(state.reservations).toHaveLength(1);
    expect(state.reservations[0]?.id).toBe('existing-01');
  });
  it('handles unavailable browser storage without crashing', () => {
    const storage = new DemoStorage();
    expect(storage.read()).toEqual({ version: 1, wishlist: [], reservations: [] });
    expect(storage.write({ version: 1, wishlist: [], reservations: [] })).toBe(false);
  });
});

describe('stateful booking journey', () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date('2029-10-21T12:00:00Z') }));
  afterEach(() => vi.useRealTimers());
  it('creates, persists, hydrates and cancels a confirmed demo booking', async () => {
    const storage = new MemoryStorage();
    const store = createStore(storage);
    await store.load();
    const booking = store.reserve(request);
    expect(booking.status).toBe('confirmed');
    expect(booking.price.totalCents).toBe(117040);
    expect(store.reservation(booking.id)).toEqual(booking);
    const reloaded = createStore(storage);
    await reloaded.load();
    expect(reloaded.reservations()).toHaveLength(1);
    reloaded.cancel(booking.id);
    expect(reloaded.reservation(booking.id)?.status).toBe('canceled');
    expect(availableInventory(room, start, end, reloaded.reservations(), request.propertyId)).toBe(
      3,
    );
  });
  it('persists wishlist toggles and safely ignores unknown property IDs', async () => {
    const storage = new MemoryStorage();
    const store = createStore(storage);
    await store.load();
    store.toggleWishlist(request.propertyId);
    expect(createStore(storage).isSaved(request.propertyId)).toBe(true);
    store.toggleWishlist('unknown');
    expect(store.wishlist()).toHaveLength(1);
    store.toggleWishlist(request.propertyId);
    expect(store.wishlist()).toEqual([]);
  });
  it('rejects invalid names, email, phone, guest count and past bookings', async () => {
    const store = createStore();
    await store.load();
    expect(() => store.reserve({ ...request, email: 'wrong' })).toThrow('email');
    expect(() => store.reserve({ ...request, firstName: ' ' })).toThrow('name');
    expect(() => store.reserve({ ...request, phone: 'abc' })).toThrow('phone');
    expect(() => store.reserve({ ...request, guests: 5 })).toThrow('accommodates');
    expect(() => store.reserve({ ...request, checkIn: '2020-01-01' })).toThrow('today');
    expect(store.reservations()).toHaveLength(0);
    expect(guestDetailsError(request)).toBeNull();
  });
  it('makes duplicate submissions idempotent even for one-room inventory', async () => {
    const store = createStore();
    await store.load();
    const villaRequest = { ...request, propertyId: 'aegean-house' };
    const first = store.reserve(villaRequest);
    expect(store.reserve(villaRequest).id).toBe(first.id);
    expect(store.reservations()).toHaveLength(1);
    expect(() => store.reserve({ ...villaRequest, email: 'other@example.com' })).toThrow(
      'unavailable',
    );
  });
  it('disallows cancellation on or after check-in and resets demo data', async () => {
    const store = createStore();
    await store.load();
    const booking = store.reserve(request);
    vi.setSystemTime(new Date('2030-04-10T12:00:00Z'));
    expect(() => store.cancel(booking.id)).toThrow('day before');
    store.resetDemo();
    expect(store.reservations()).toEqual([]);
    expect(store.wishlist()).toEqual([]);
  });
  it('surfaces repository errors and can retry', async () => {
    let attempt = 0;
    const store = createStore(new MemoryStorage(), {
      list: async () => {
        if (++attempt === 1) throw new Error('offline');
        return structuredClone(DEMO_ACCOMMODATIONS);
      },
    });
    await store.load();
    expect(store.error()).toContain('try again');
    expect(store.loading()).toBe(false);
    await store.load();
    expect(store.error()).toBeNull();
    expect(store.properties()).toHaveLength(12);
  });
});
