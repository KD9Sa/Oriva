import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    title: 'Oriva — Find your kind of elsewhere',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'explore',
    title: 'Explore considered stays — Oriva',
    loadComponent: () =>
      import('./features/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'stays/:id',
    title: 'A place to slow down — Oriva',
    loadComponent: () =>
      import('./features/accommodation/accommodation.component').then(
        (m) => m.AccommodationComponent,
      ),
  },
  {
    path: 'booking/:id',
    title: 'Your next chapter — Oriva',
    loadComponent: () =>
      import('./features/booking/booking.component').then((m) => m.BookingComponent),
  },
  {
    path: 'confirmation/:id',
    title: 'Your demo reservation — Oriva',
    loadComponent: () =>
      import('./features/booking/confirmation.component').then((m) => m.ConfirmationComponent),
  },
  {
    path: 'saved',
    title: 'Your saved stays — Oriva',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
  },
  {
    path: 'reservations',
    title: 'My reservations — Oriva',
    loadComponent: () =>
      import('./features/reservations/reservations.component').then((m) => m.ReservationsComponent),
  },
  {
    path: '**',
    title: 'A little off the beaten path — Oriva',
    loadComponent: () =>
      import('./features/home/not-found.component').then((m) => m.NotFoundComponent),
  },
];
