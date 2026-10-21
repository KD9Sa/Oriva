import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { StayStore } from '../core/stay-store.service';
import { IconComponent } from '../shared/components/icon.component';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-main">
          <div class="footer-brand">
            <a routerLink="/" class="wordmark">
              <span class="brand-mark">✳</span>
              oriva.
            </a>
            <p>
              Go somewhere.
              <br />
              <em>Feel something.</em>
            </p>
            <span>Considered stays. Unforgettable places.</span>
          </div>
          <div class="footer-links">
            <span class="eyebrow">A LITTLE EXPLORATION</span>
            <a routerLink="/explore">Find your stay</a>
            <a routerLink="/" fragment="destinations">Our destinations</a>
            <a routerLink="/saved">Your saved places</a>
            <a routerLink="/reservations">My reservations</a>
          </div>
          <div class="footer-links">
            <span class="eyebrow">GOOD TO KNOW</span>
            <button type="button" (click)="openInfo('About Oriva')">The Oriva story</button>
            <button type="button" (click)="openInfo('Booking & cancellation')">
              Booking & cancellation
            </button>
            <button type="button" (click)="openInfo('Privacy & your data')">
              Privacy & your data
            </button>
            <button type="button" (click)="openReset()">Reset demo data</button>
          </div>
          <div class="footer-note">
            <span class="eyebrow">A NOTE FROM US</span>
            <p>
              Beautiful places are just the beginning. It’s how a place makes you feel that stays
              with you.
            </p>
            <a routerLink="/explore" class="text-link">
              Find your elsewhere
              <app-icon name="arrow-up-right" [size]="15" />
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© {{ year }} Oriva. A little elsewhere.</span>
          <span>Frontend portfolio demo · No real reservations or payments</span>
          <span>
            Made for the way you travel
            <app-icon name="sun" [size]="14" />
          </span>
        </div>
      </div>
    </footer>
    <dialog #information aria-labelledby="information-title" (click)="closeOnBackdrop($event)">
      <h2 id="information-title">{{ infoTitle() }}</h2>
      @switch (infoTitle()) {
        @case ('About Oriva') {
          <p>
            Oriva is an invented name inspired by horizons and arrival. We believe the most
            memorable journeys begin with a place that feels a little different.
          </p>
          <p>
            This independent frontend portfolio project explores thoughtful travel design through
            fictional stays and illustrative photography.
          </p>
          <a routerLink="/explore" class="button" (click)="closeInfo()">Explore the collection</a>
        }
        @case ('Booking & cancellation') {
          <p>
            All reservations are simulations stored in this browser. Nothing is sent to a hotel, and
            no payments are collected.
          </p>
          <p>
            Demo pricing is in USD: nightly room rates, a $35 cleaning fee per room, a 5% service
            fee on the room subtotal, and 10% tax on the subtotal plus fees. Maximum stay: 30
            nights.
          </p>
          <p>
            Cancel any demo reservation before the check-in date through My reservations. Canceled
            rooms become available again. On or after check-in, cancellation is unavailable.
          </p>
        }
        @case ('Privacy & your data') {
          <p>
            Your saved stays and demo reservations are stored locally in this browser. Guest details
            are used only for your local demo confirmation. Please use fictional details.
          </p>
          <p>
            There are no analytics, user accounts, payment forms, or booking emails. Reset demo data
            removes saved stays and reservations from this browser. Browser storage is a
            convenience, not a security boundary.
          </p>
        }
        @case ('Reset demo data') {
          <p>
            This removes all saved stays and demo reservations from this browser. This action cannot
            be undone.
          </p>
          <div class="dialog-actions">
            <button class="button secondary" (click)="closeInfo()">Keep my data</button>
            <button class="button" (click)="reset()">Reset demo data</button>
          </div>
        }
      }
      @if (infoTitle() !== 'Reset demo data') {
        <div class="dialog-actions">
          <button class="button secondary" (click)="closeInfo()">Close</button>
        </div>
      }
    </dialog>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .wordmark {
        font-family: var(--font-display);
        font-size: 38px;
        font-weight: 500;
        letter-spacing: -2px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        line-height: 1;
      }
      .brand-mark {
        font-family: Georgia;
        font-size: 31px;
        font-weight: 400;
        margin-right: 2px;
      }
      .site-footer {
        background: #edf0e6;
        margin-top: 50px;
      }
      .footer-main {
        display: grid;
        grid-template-columns: 1.3fr 0.8fr 0.85fr 1fr;
        gap: 55px;
        padding: 62px 0 50px;
      }
      .footer-brand .wordmark {
        font-size: 34px;
      }
      .footer-brand p {
        font-family: var(--font-display);
        font-size: 29px;
        line-height: 1.2;
        letter-spacing: -0.025em;
        margin: 24px 0 16px;
      }
      .footer-brand > span {
        font-size: 10px;
        color: var(--color-text-secondary);
      }
      .footer-links {
        display: flex;
        flex-direction: column;
        gap: 11px;
        font-size: 11px;
        padding-top: 8px;
      }
      .footer-links .eyebrow,
      .footer-note .eyebrow {
        font-size: 9px;
        margin-bottom: 13px;
      }
      .footer-links button {
        background: transparent;
        border: 0;
        text-align: left;
        padding: 0;
        font-size: 11px;
        line-height: 1.65;
      }
      .footer-links a:hover,
      .footer-links button:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      .footer-note {
        padding-top: 8px;
      }
      .footer-note p {
        font-size: 12px;
        color: var(--color-text-secondary);
        max-width: 220px;
        margin-bottom: 22px;
      }
      .footer-bottom {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 20px 0;
        border-top: 1px solid var(--color-border);
        font-size: 9px;
        color: var(--color-text-secondary);
      }
      .footer-bottom > span:last-child {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      dialog p {
        font-size: 14px;
        color: var(--color-text-secondary);
      }
      @media (max-width: 1100px) {
        .footer-main {
          gap: 30px;
        }
      }
      @media (max-width: 900px) {
        .footer-main {
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .footer-bottom {
          flex-wrap: wrap;
          font-size: 9px;
        }
      }
      @media (max-width: 650px) {
        .wordmark {
          font-size: 33px;
        }
        .brand-mark {
          font-size: 27px;
        }
        .footer-main {
          grid-template-columns: 1fr 1fr;
          padding-top: 42px;
          gap: 32px 20px;
        }
        .footer-brand {
          grid-column: 1/-1;
        }
        .footer-brand p {
          margin-block: 18px 10px;
        }
        .footer-note {
          grid-column: 1/-1;
        }
        .footer-note p {
          max-width: 320px;
        }
        .footer-bottom {
          flex-direction: column;
          gap: 8px;
        }
        .site-footer {
          margin-top: 20px;
        }
      }
    `,
  ],
})
export class FooterComponent {
  readonly store = inject(StayStore);
  readonly infoTitle = signal('');
  readonly year = new Date().getFullYear();
  @ViewChild('information') private information?: ElementRef<HTMLDialogElement>;
  openInfo(title: string): void {
    this.infoTitle.set(title);
    this.information?.nativeElement.showModal();
  }
  closeInfo(): void {
    this.information?.nativeElement.close();
  }
  closeOnBackdrop(event: MouseEvent): void {
    const dialog = this.information?.nativeElement;
    if (!dialog || event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      this.closeInfo();
  }
  openReset(): void {
    this.openInfo('Reset demo data');
  }
  reset(): void {
    this.store.resetDemo();
    this.closeInfo();
  }
}
