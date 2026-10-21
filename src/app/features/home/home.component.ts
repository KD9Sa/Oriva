import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StayStore } from '../../core/stay-store.service';
import { SearchBarComponent } from '../../shared/components/search-bar.component';
import { PropertyCardComponent } from '../../shared/components/property-card.component';
import { IconComponent } from '../../shared/components/icon.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SearchBarComponent, PropertyCardComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly store = inject(StayStore);
  readonly selected = signal('All stays');
  readonly categories = [
    { name: 'All stays', icon: 'compass' },
    { name: 'By the sea', icon: 'pool' },
    { name: 'In the countryside', icon: 'leaf' },
    { name: 'City hideaways', icon: 'home' },
    { name: 'A little different', icon: 'sun' },
  ];
  readonly featured = computed(() => {
    const properties = this.store.properties();
    const category = this.selected();
    if (category === 'By the sea')
      return properties.filter((p) => p.amenities.includes('Ocean view')).slice(0, 3);
    if (category === 'In the countryside')
      return properties
        .filter((p) => ['Tuscany', 'Ubud', 'Douro Valley'].some((x) => p.location.includes(x)))
        .slice(0, 3);
    if (category === 'City hideaways')
      return properties
        .filter((p) => ['Marrakech', 'Kyoto', 'Canggu'].some((x) => p.location.includes(x)))
        .slice(0, 3);
    if (category === 'A little different')
      return properties.filter((p) => ['Ryokan', 'Riad', 'Cabin'].includes(p.type)).slice(0, 3);
    return properties.slice(0, 3);
  });
  readonly destinations = [
    {
      name: 'Italy',
      line: 'La dolce vita, your way.',
      image: '/assets/images/stay-01.jpg',
      count: 3,
    },
    {
      name: 'Greece',
      line: 'Chase a different shade of blue.',
      image: '/assets/images/stay-02.jpg',
      count: 2,
    },
    {
      name: 'Portugal',
      line: 'A little wild. A little wonderful.',
      image: '/assets/images/stay-03.jpg',
      count: 2,
    },
    {
      name: 'Bali',
      line: 'Let the everyday drift away.',
      image: '/assets/images/stay-05.jpg',
      count: 2,
    },
  ];
}
