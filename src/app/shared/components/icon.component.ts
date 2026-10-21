import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
const paths: Record<string, string> = {
  'arrow-right': 'M4 12h16m-6-6 6 6-6 6',
  'arrow-left': 'M20 12H4m6-6-6 6 6 6',
  'arrow-up-right': 'M6 18 18 6M6 6h12v12',
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-left': 'm15 6-6 6 6 6',
  'chevron-right': 'm9 6 6 6-6 6',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  search: 'm20 20-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6',
  'check-circle': 'M22 11a10 10 0 1 1-5.9-9.1M9 11l3 3L22 4',
  calendar: 'M4 5h16v16H4ZM16 3v4M8 3v4M4 10h16',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.9M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  bed: 'M3 18v3M21 18v3M3 18h18V9H3ZM5 9V4h14v5M12 4v5',
  home: 'm3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8',
  leaf: 'M20 3C6 2 2 8 5 15s17 7 15-12ZM4 21 16 9',
  sun: 'M12 2v2M12 20v2M2 12h2M20 12h2m-3-9-1.5 1.5M5.5 18.5 4 20m16 0-1.5-1.5M5.5 5.5 4 4M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
  compass: 'm16 8-3 5-5 3 3-5 5-3ZM22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  wifi: 'M2 8a17 17 0 0 1 20 0M5 12a12 12 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0M12 19h.01',
  pool: 'M3 20q3-3 6 0t6 0 6 0M7 15V5a2 2 0 0 1 4 0M15 15V5a2 2 0 0 1 4 0M7 8h8M7 12h8',
  coffee: 'M3 8h14v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5ZM17 8h2a3 3 0 1 1 0 6h-2M6 2v3M10 2v3M14 2v3',
  filter: 'M4 6h16M7 12h10M10 18h4',
  grid: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  minus: 'M5 12h14',
  plus: 'M5 12h14M12 5v14',
  print: 'M6 9V3h12v6M6 18H3V9h18v9h-3M6 14h12v8H6ZM17 12h.01',
  mail: 'M3 5h18v14H3Zm0 0 9 8 9-8',
  shield: 'm12 3 8 3v6c0 5-8 10-8 10S4 17 4 12V6l8-3Zm-4 9 3 3 5-6',
};
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path [attr.d]="path" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        vertical-align: middle;
      }
      svg {
        display: block;
      }
    `,
  ],
})
export class IconComponent {
  @Input() name = 'compass';
  @Input() size = 20;
  get path(): string {
    return paths[this.name] ?? paths['compass']!;
  }
}
