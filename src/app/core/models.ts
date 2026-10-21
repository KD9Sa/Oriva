export interface Room {
  id: string;
  name: string;
  capacity: number;
  inventory: number;
  nightlyRateCents: number;
  description: string;
}

export interface Accommodation {
  id: string;
  name: string;
  location: string;
  country: string;
  destination: string;
  type: 'Boutique hotel' | 'Villa' | 'Riad' | 'Cabin' | 'Guesthouse' | 'Ryokan';
  category: string;
  description: string;
  image: string;
  images: string[];
  imageAlt: string;
  rating: number;
  reviewCount: number;
  nightlyRateCents: number;
  amenities: string[];
  rooms: Room[];
  host: string;
  featured: boolean;
  collection: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface PriceBreakdown {
  nights: number;
  nightlyRateCents: number;
  subtotalCents: number;
  cleaningFeeCents: number;
  serviceFeeCents: number;
  taxCents: number;
  totalCents: number;
}

export interface BookingRequest {
  propertyId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Reservation extends BookingRequest {
  id: string;
  reference: string;
  status: 'confirmed' | 'canceled';
  createdAt: string;
  price: PriceBreakdown;
}

export interface SearchFilters {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  maxPrice?: number;
  type?: string;
  amenities?: string[];
  minRating?: number;
  sort?: string;
}

export interface DemoState {
  version: 1;
  wishlist: string[];
  reservations: Reservation[];
}
