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
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StayStore } from '../../core/stay-store.service';
import {
  availableInventory,
  calculatePrice,
  defaultDates,
  todayISO,
  validateStay,
} from '../../core/booking-rules';
import { PropertyCardComponent } from '../../shared/components/property-card.component';

@Component({
  selector: 'app-accommodation',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, PropertyCardComponent],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccommodationComponent {
  readonly store = inject(StayStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly gallery = viewChild<ElementRef<HTMLDialogElement>>('gallery');
  readonly id = signal(this.route.snapshot.paramMap.get('id') ?? '');
  readonly property = computed(() => this.store.property(this.id()));
  private readonly dates = defaultDates();
  readonly checkIn = signal(this.dates.checkIn);
  readonly checkOut = signal(this.dates.checkOut);
  readonly guests = signal(2);
  readonly rooms = signal(1);
  readonly roomId = signal('');
  readonly stayQuery = computed(() => ({
    checkIn: this.checkIn(),
    checkOut: this.checkOut(),
    guests: this.guests(),
    rooms: this.rooms(),
  }));
  readonly today = todayISO();
  readonly photoIndex = signal(0);
  readonly currentRoom = computed(() => {
    const property = this.property();
    if (!property) return undefined;
    return (
      property.rooms.find((room) => room.id === this.roomId()) ??
      property.rooms.find(
        (room) =>
          !validateStay(
            this.checkIn(),
            this.checkOut(),
            this.guests(),
            this.rooms(),
            room,
            this.store.reservations(),
            property.id,
          ),
      ) ??
      property.rooms[0]
    );
  });
  readonly availabilityError = computed(() => {
    const property = this.property();
    const room = this.currentRoom();
    return property && room
      ? validateStay(
          this.checkIn(),
          this.checkOut(),
          this.guests(),
          this.rooms(),
          room,
          this.store.reservations(),
          property.id,
        )
      : 'Choose a room to continue.';
  });
  readonly remainingRooms = computed(() => {
    const property = this.property();
    const room = this.currentRoom();
    return property && room
      ? availableInventory(
          room,
          this.checkIn(),
          this.checkOut(),
          this.store.reservations(),
          property.id,
        )
      : 0;
  });
  readonly price = computed(() => {
    const room = this.currentRoom();
    if (!room) return null;
    try {
      return calculatePrice(room, this.checkIn(), this.checkOut(), this.rooms());
    } catch {
      return null;
    }
  });
  readonly similar = computed(() => {
    const property = this.property();
    return this.store
      .properties()
      .filter((stay) => stay.id !== this.id())
      .sort(
        (a, b) => Number(b.country === property?.country) - Number(a.country === property?.country),
      )
      .slice(0, 3);
  });
  readonly images = computed(() =>
    this.property()?.images.length ? this.property()!.images : [this.property()?.image ?? ''],
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.id.set(params.get('id') ?? '');
      this.roomId.set('');
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.checkIn.set(params.get('checkIn') ?? this.dates.checkIn);
      this.checkOut.set(params.get('checkOut') ?? this.dates.checkOut);
      this.guests.set(Number(params.get('guests')) || 2);
      this.rooms.set(Number(params.get('rooms')) || 1);
      this.roomId.set(params.get('roomId') ?? '');
    });
  }

  openGallery(index = 0): void {
    this.photoIndex.set(index);
    this.gallery()?.nativeElement.showModal();
  }

  closeGallery(): void {
    this.gallery()?.nativeElement.close();
  }
  galleryBackdrop(event: MouseEvent): void {
    const dialog = this.gallery()?.nativeElement;
    if (!dialog || event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      this.closeGallery();
  }
  galleryKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }
  changePhoto(delta: number): void {
    this.photoIndex.update(
      (index) => (index + delta + this.images().length) % this.images().length,
    );
  }

  book(): void {
    const room = this.currentRoom();
    if (!room || this.availabilityError()) return;
    void this.router.navigate(['/booking', this.id()], {
      queryParams: {
        roomId: room.id,
        checkIn: this.checkIn(),
        checkOut: this.checkOut(),
        guests: this.guests(),
        rooms: this.rooms(),
      },
    });
  }
}
