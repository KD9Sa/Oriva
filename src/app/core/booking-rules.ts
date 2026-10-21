import type {
  Accommodation,
  BookingRequest,
  PriceBreakdown,
  Reservation,
  Room,
  SearchFilters,
} from './models';

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
export const CLEANING_FEE_CENTS = 3500;
export const SERVICE_FEE_BASIS_POINTS = 500;
export const TAX_BASIS_POINTS = 1000;

/** Local calendar date for the visitor; UTC is used only for calendar arithmetic. */
export function todayISO(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function dateNumber(date: string): number {
  if (!ISO_DATE.test(date)) return Number.NaN;
  const value = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === date
    ? value
    : Number.NaN;
}

export function addDays(date: string, days: number): string {
  const value = dateNumber(date);
  if (!Number.isFinite(value)) throw new Error('Please choose a valid calendar date.');
  return new Date(value + days * DAY_MS).toISOString().slice(0, 10);
}

export function defaultDates(): { checkIn: string; checkOut: string } {
  const start = addDays(todayISO(), 14);
  return { checkIn: start, checkOut: addDays(start, 4) };
}

export function nightCount(checkIn: string, checkOut: string): number {
  return (dateNumber(checkOut) - dateNumber(checkIn)) / DAY_MS;
}

export function dateRangeError(
  checkIn: string,
  checkOut: string,
  today = todayISO(),
): string | null {
  if (!Number.isFinite(dateNumber(checkIn)) || !Number.isFinite(dateNumber(checkOut)))
    return 'Please choose valid check-in and check-out dates.';
  if (checkIn < today) return 'Check-in must be today or later.';
  if (checkOut <= checkIn) return 'Check-out must be after check-in.';
  if (nightCount(checkIn, checkOut) > 30) return 'Please choose a stay of 30 nights or fewer.';
  return null;
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}

/** Sweep the occupied nights: a guest checking out frees inventory that same day. */
export function availableInventory(
  room: Room,
  checkIn: string,
  checkOut: string,
  reservations: readonly Reservation[],
  propertyId: string,
): number {
  const events: { date: string; delta: number }[] = [];
  for (const reservation of reservations) {
    if (
      reservation.status !== 'confirmed' ||
      reservation.propertyId !== propertyId ||
      reservation.roomId !== room.id ||
      !rangesOverlap(checkIn, checkOut, reservation.checkIn, reservation.checkOut)
    )
      continue;
    events.push({
      date: reservation.checkIn > checkIn ? reservation.checkIn : checkIn,
      delta: reservation.rooms,
    });
    events.push({
      date: reservation.checkOut < checkOut ? reservation.checkOut : checkOut,
      delta: -reservation.rooms,
    });
  }
  events.sort((a, b) => a.date.localeCompare(b.date) || a.delta - b.delta);
  let occupied = 0;
  let peak = 0;
  for (const event of events) {
    occupied += event.delta;
    peak = Math.max(peak, occupied);
  }
  return Math.max(0, room.inventory - peak);
}

export function validateStay(
  checkIn: string,
  checkOut: string,
  guests: number,
  rooms: number,
  room: Room,
  reservations: readonly Reservation[],
  propertyId: string,
): string | null {
  const dateError = dateRangeError(checkIn, checkOut);
  if (dateError) return dateError;
  if (!Number.isInteger(guests) || guests < 1 || guests > 16)
    return 'Choose between 1 and 16 guests.';
  if (!Number.isInteger(rooms) || rooms < 1 || rooms > room.inventory)
    return `Choose between 1 and ${room.inventory} rooms.`;
  if (rooms > guests) return 'Please choose at least one guest per room.';
  if (guests > room.capacity * rooms)
    return `This room accommodates ${room.capacity} guests per room. Please choose more rooms or fewer guests.`;
  if (availableInventory(room, checkIn, checkOut, reservations, propertyId) < rooms)
    return 'These rooms are unavailable for your dates. Try another room or date range.';
  return null;
}

export function guestDetailsError(
  request: Pick<BookingRequest, 'firstName' | 'lastName' | 'email' | 'phone'>,
): string | null {
  if (
    request.firstName.trim().length < 2 ||
    request.firstName.trim().length > 80 ||
    request.lastName.trim().length < 2 ||
    request.lastName.trim().length > 80
  )
    return 'Please enter a first and last name of 2–80 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email.trim()) || request.email.length > 254)
    return 'Please enter a valid email address.';
  if (
    !/^[+()\d\s.-]{7,30}$/.test(request.phone.trim()) ||
    request.phone.replace(/\D/g, '').length < 7
  )
    return 'Please enter a phone number with at least 7 digits.';
  return null;
}

/** USD amounts stay in integer cents. Round each percentage line once, half-up. */
export function calculatePrice(
  room: Room,
  checkIn: string,
  checkOut: string,
  rooms = 1,
): PriceBreakdown {
  const nights = nightCount(checkIn, checkOut);
  if (
    !Number.isInteger(nights) ||
    nights < 1 ||
    nights > 30 ||
    !Number.isInteger(rooms) ||
    rooms < 1 ||
    !Number.isSafeInteger(room.nightlyRateCents) ||
    room.nightlyRateCents < 0
  )
    throw new Error('A valid date range and room count are required to calculate a price.');
  const subtotalCents = room.nightlyRateCents * nights * rooms;
  const cleaningFeeCents = CLEANING_FEE_CENTS * rooms;
  const serviceFeeCents = Math.round((subtotalCents * SERVICE_FEE_BASIS_POINTS) / 10_000);
  const taxCents = Math.round(
    ((subtotalCents + cleaningFeeCents + serviceFeeCents) * TAX_BASIS_POINTS) / 10_000,
  );
  return {
    nights,
    nightlyRateCents: room.nightlyRateCents,
    subtotalCents,
    cleaningFeeCents,
    serviceFeeCents,
    taxCents,
    totalCents: subtotalCents + cleaningFeeCents + serviceFeeCents + taxCents,
  };
}

export function filterAccommodations(
  properties: readonly Accommodation[],
  filters: SearchFilters,
  reservations: readonly Reservation[] = [],
): Accommodation[] {
  const query = filters.destination?.trim().toLocaleLowerCase() ?? '';
  const guests = filters.guests ?? 1;
  const rooms = filters.rooms ?? 1;
  if (
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 16 ||
    !Number.isInteger(rooms) ||
    rooms < 1
  )
    return [];
  if (!!filters.checkIn !== !!filters.checkOut) return [];
  const filtered = properties.flatMap((property) => {
    if (
      query &&
      !`${property.name} ${property.location} ${property.country} ${property.destination} ${property.collection}`
        .toLocaleLowerCase()
        .includes(query)
    )
      return [];
    if (
      filters.type &&
      filters.type !== 'All stays' &&
      filters.type !== 'all' &&
      property.type.toLowerCase() !== filters.type.toLowerCase()
    )
      return [];
    if (filters.minRating != null && property.rating < filters.minRating) return [];
    if (
      filters.amenities?.some(
        (amenity) =>
          !property.amenities.some((value) => value.toLowerCase() === amenity.toLowerCase()),
      )
    )
      return [];
    const availableRooms = property.rooms.filter((room) => {
      if (guests > room.capacity * rooms || rooms > room.inventory || rooms > guests) return false;
      if (filters.maxPrice != null && room.nightlyRateCents > filters.maxPrice * 100) return false;
      if (filters.checkIn && filters.checkOut)
        return !validateStay(
          filters.checkIn,
          filters.checkOut,
          guests,
          rooms,
          room,
          reservations,
          property.id,
        );
      return true;
    });
    if (!availableRooms.length) return [];
    // The displayed and sorted price is the cheapest room that actually matches this search.
    return [
      {
        ...property,
        nightlyRateCents: Math.min(...availableRooms.map((room) => room.nightlyRateCents)),
      },
    ];
  });
  switch (filters.sort) {
    case 'price-asc':
    case 'price-low':
      return filtered.sort((a, b) => a.nightlyRateCents - b.nightlyRateCents);
    case 'price-desc':
    case 'price-high':
      return filtered.sort((a, b) => b.nightlyRateCents - a.nightlyRateCents);
    case 'rating':
    case 'rating-desc':
      return filtered.sort((a, b) => b.rating - a.rating);
    default:
      return filtered.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
      );
  }
}
