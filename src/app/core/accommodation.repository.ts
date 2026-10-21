import { Injectable } from '@angular/core';
import type { Accommodation } from './models';

interface StaySeed {
  id: string;
  name: string;
  location: string;
  country: string;
  destination: string;
  type: Accommodation['type'];
  category: string;
  description: string;
  rate: number;
  rating: number;
  reviews: number;
  host: string;
  amenities: string[];
  collection: string;
}

const seeds: StaySeed[] = [
  {
    id: 'casa-della-luce',
    name: 'Casa della Luce',
    location: 'Amalfi Coast',
    country: 'Italy',
    destination: 'Amalfi Coast',
    type: 'Boutique hotel',
    category: 'By the sea',
    description:
      'A sun-washed hideaway above the Tyrrhenian Sea. Lemon trees shade the courtyard, linen curtains catch the afternoon breeze, and every morning begins with a breakfast of local fruit and warm pastries. Follow the stone steps into the village, or spend the day doing beautifully little.',
    rate: 24500,
    rating: 4.96,
    reviews: 128,
    host: 'Sofia & Luca',
    amenities: ['Wi-Fi', 'Pool', 'Breakfast', 'Ocean view', 'Restaurant', 'Air conditioning'],
    collection: 'Coastal escapes',
  },
  {
    id: 'aegean-house',
    name: 'The Aegean House',
    location: 'Santorini',
    country: 'Greece',
    destination: 'Santorini',
    type: 'Villa',
    category: 'Island living',
    description:
      'Sculpted white walls, soft volcanic stone, and a terrace made for watching the Aegean turn gold. This intimate island retreat brings simple Cycladic design together with thoughtful comforts and a private plunge pool.',
    rate: 32000,
    rating: 4.98,
    reviews: 94,
    host: 'Eleni',
    amenities: ['Wi-Fi', 'Pool', 'Breakfast', 'Ocean view', 'Air conditioning'],
    collection: 'Coastal escapes',
  },
  {
    id: 'casa-da-areia',
    name: 'Casa da Areia',
    location: 'Comporta',
    country: 'Portugal',
    destination: 'Comporta',
    type: 'Guesthouse',
    category: 'Barefoot luxury',
    description:
      'Beyond the rice fields, a little collection of timber and whitewashed cottages settles into the dunes. Slow lunches, quiet Atlantic beaches, and a garden swimming pool give this coastal guesthouse its unhurried rhythm.',
    rate: 19500,
    rating: 4.92,
    reviews: 86,
    host: 'Mariana & Tomás',
    amenities: ['Wi-Fi', 'Pool', 'Breakfast', 'Garden', 'Parking'],
    collection: 'Slow countryside',
  },
  {
    id: 'riad-nour',
    name: 'Riad Nour',
    location: 'Marrakech',
    country: 'Morocco',
    destination: 'Marrakech',
    type: 'Riad',
    category: 'A hidden sanctuary',
    description:
      'Behind a quiet medina doorway, zellige tiles and orange blossoms frame a cool courtyard pool. Six individually considered rooms, a small hammam, and a rooftop breakfast table make this an intimate introduction to Marrakech.',
    rate: 16500,
    rating: 4.95,
    reviews: 172,
    host: 'Amal',
    amenities: ['Wi-Fi', 'Pool', 'Breakfast', 'Spa', 'Restaurant', 'Air conditioning'],
    collection: 'Design-led hideaways',
  },
  {
    id: 'uma-bambu',
    name: 'Uma Bambu Retreat',
    location: 'Ubud, Bali',
    country: 'Indonesia',
    destination: 'Bali',
    type: 'Cabin',
    category: 'Into the green',
    description:
      'Handcrafted bamboo rooms open toward a lush river valley. Wake to birdsong, follow a garden path to the pool, and discover a gentler side of Bali with locally prepared breakfasts and small-group village walks.',
    rate: 14500,
    rating: 4.89,
    reviews: 113,
    host: 'Wayan & Made',
    amenities: ['Wi-Fi', 'Pool', 'Breakfast', 'Garden', 'Spa'],
    collection: 'Nature retreats',
  },
  {
    id: 'komorebi-inn',
    name: 'Komorebi Inn',
    location: 'Kyoto',
    country: 'Japan',
    destination: 'Kyoto',
    type: 'Ryokan',
    category: 'Quiet traditions',
    description:
      'A restored machiya on a quiet lane balances cedar wood, tatami, and a miniature courtyard garden. Seasonal breakfast is served in your room, while nearby temples and neighborhood cafés invite you to explore Kyoto on foot.',
    rate: 22500,
    rating: 4.97,
    reviews: 68,
    host: 'Haruka',
    amenities: ['Wi-Fi', 'Breakfast', 'Garden', 'Air conditioning'],
    collection: 'Design-led hideaways',
  },
  {
    id: 'casa-oliva',
    name: 'Casa Oliva',
    location: 'Tuscany',
    country: 'Italy',
    destination: 'Tuscany',
    type: 'Villa',
    category: 'Country soul',
    description:
      'An old stone farmhouse set among olive groves and cypress trees. The kitchen celebrates seasonal produce, the pool looks out over rolling hills, and the nearest village is a short drive through the Tuscan countryside.',
    rate: 27500,
    rating: 4.94,
    reviews: 105,
    host: 'Giulia',
    amenities: ['Wi-Fi', 'Pool', 'Garden', 'Parking', 'Restaurant'],
    collection: 'Slow countryside',
  },
  {
    id: 'nera-cove',
    name: 'Nera Cove',
    location: 'Milos',
    country: 'Greece',
    destination: 'Milos',
    type: 'Boutique hotel',
    category: 'Blue horizons',
    description:
      'A small Aegean retreat with pale stone terraces, breezy rooms, and sea views at every turn. Swim before breakfast, discover quiet coves, then return for a sunset drink beneath the pergola.',
    rate: 21000,
    rating: 4.91,
    reviews: 79,
    host: 'Nikos',
    amenities: ['Wi-Fi', 'Breakfast', 'Ocean view', 'Parking', 'Air conditioning'],
    collection: 'Coastal escapes',
  },
  {
    id: 'quinta-do-sol',
    name: 'Quinta do Sol',
    location: 'Algarve',
    country: 'Portugal',
    destination: 'Algarve',
    type: 'Guesthouse',
    category: 'Sun-filled days',
    description:
      'A former country estate between orchard and ocean, with generous terraces and a courtyard made for long breakfasts. Explore the nearby fishing villages or stay close to the garden pool.',
    rate: 18000,
    rating: 4.88,
    reviews: 121,
    host: 'Inês & Pedro',
    amenities: ['Wi-Fi', 'Pool', 'Breakfast', 'Garden', 'Parking'],
    collection: 'Slow countryside',
  },
  {
    id: 'the-slow-house',
    name: 'The Slow House',
    location: 'Canggu, Bali',
    country: 'Indonesia',
    destination: 'Bali',
    type: 'Villa',
    category: 'Tropical ease',
    description:
      'Earthy textures, open-air living, and a palm-framed swimming pool give this intimate villa its easy character. The beach is a short ride away, and a thoughtful team can point you toward neighborhood cafés and local makers.',
    rate: 13500,
    rating: 4.87,
    reviews: 96,
    host: 'Kadek',
    amenities: ['Wi-Fi', 'Pool', 'Garden', 'Parking', 'Air conditioning'],
    collection: 'Nature retreats',
  },
  {
    id: 'villa-serena',
    name: 'Villa Serena',
    location: 'Lake Como',
    country: 'Italy',
    destination: 'Lake Como',
    type: 'Boutique hotel',
    category: 'Lakeside reverie',
    description:
      'A graceful lakeside villa with shuttered windows, shaded terraces, and a garden that tumbles toward the water. Take the ferry between villages or linger over lunch with the mountains reflected in the lake.',
    rate: 36500,
    rating: 4.99,
    reviews: 57,
    host: 'Alessandro',
    amenities: ['Wi-Fi', 'Breakfast', 'Garden', 'Restaurant', 'Parking', 'Air conditioning'],
    collection: 'Design-led hideaways',
  },
  {
    id: 'riad-du-vent',
    name: 'Riad du Vent',
    location: 'Essaouira',
    country: 'Morocco',
    destination: 'Essaouira',
    type: 'Riad',
    category: 'Atlantic stories',
    description:
      'Inside the old city walls, this light-filled riad celebrates carved wood, woven textiles, and the Atlantic breeze. A sheltered courtyard and rooftop terrace offer a quiet return after a morning wandering the harbor.',
    rate: 11500,
    rating: 4.9,
    reviews: 143,
    host: 'Youssef & Leila',
    amenities: ['Wi-Fi', 'Breakfast', 'Restaurant', 'Ocean view'],
    collection: 'Coastal escapes',
  },
];

export const DEMO_ACCOMMODATIONS: Accommodation[] = seeds.map((seed, index) => {
  const image = `/assets/images/stay-${String(index + 1).padStart(2, '0')}.jpg`;
  const villa = seed.type === 'Villa';
  return {
    id: seed.id,
    name: seed.name,
    location: seed.location,
    country: seed.country,
    destination: seed.destination,
    type: seed.type,
    category: seed.category,
    description: seed.description,
    image,
    images: [
      image,
      `/assets/images/stay-${String(((index + 6) % 12) + 1).padStart(2, '0')}.jpg`,
      `/assets/images/stay-${String(((index + 2) % 12) + 1).padStart(2, '0')}.jpg`,
    ],
    imageAlt: `Illustrative accommodation photograph for ${seed.name}, ${seed.location}`,
    rating: seed.rating,
    reviewCount: seed.reviews,
    nightlyRateCents: seed.rate,
    amenities: seed.amenities,
    host: seed.host,
    featured: index < 3,
    collection: seed.collection,
    checkInTime: '15:00–21:00',
    checkOutTime: '11:00',
    rooms: [
      {
        id: 'signature-room',
        name: villa ? 'Private villa' : 'Signature room',
        capacity: villa ? 4 : 2,
        inventory: villa ? 1 : 3,
        nightlyRateCents: seed.rate,
        description: villa
          ? 'Private living space, two bedrooms, and a terrace. Up to four guests.'
          : 'A thoughtfully appointed room with a king bed and private bathroom. Up to two guests.',
      },
      {
        id: 'terrace-suite',
        name: villa ? 'Grand villa' : 'Terrace suite',
        capacity: villa ? 6 : 4,
        inventory: 1,
        nightlyRateCents: seed.rate + 8500,
        description: villa
          ? 'Three bedrooms, generous living space, and a private outdoor terrace. Up to six guests.'
          : 'A spacious suite with a separate lounge, king bed, sofa bed, and terrace. Up to four guests.',
      },
    ],
  };
});

/** Replace this boundary with an HTTP-backed subclass when an API is available. */
@Injectable({ providedIn: 'root', useFactory: () => new DemoAccommodationRepository() })
export abstract class AccommodationRepository {
  abstract list(): Promise<Accommodation[]>;
}

export class DemoAccommodationRepository extends AccommodationRepository {
  async list(): Promise<Accommodation[]> {
    // Copy returned objects so presentation state cannot mutate the shared fixtures.
    return structuredClone(DEMO_ACCOMMODATIONS);
  }
}
