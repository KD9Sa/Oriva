import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const screenshotDirectory = resolve('docs/assets/screenshots');
const demoKey = 'oriva.demo.v1';

function futureDate(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function confirmationDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()];
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][date.getUTCMonth()];
  return `${weekday}, ${String(date.getUTCDate()).padStart(2, '0')} ${month} ${date.getUTCFullYear()}`;
}

async function capture(page: Page, name: string, fullPage = false): Promise<void> {
  await mkdir(screenshotDirectory, { recursive: true });
  const dismiss = page.getByRole('button', { name: 'Dismiss notification', exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
  await page.evaluate(() => document.fonts.ready);
  if (fullPage) {
    const images = page.locator('img');
    for (let index = 0; index < (await images.count()); index++)
      await images.nth(index).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await page.locator('img').evaluateAll(async (images) => {
    await Promise.all(
      images
        .filter((image) => image.getBoundingClientRect().top < innerHeight)
        .map((image) => image.decode().catch(() => undefined)),
    );
  });
  await page.screenshot({
    path: resolve(screenshotDirectory, name),
    fullPage,
    animations: 'disabled',
    caret: 'hide',
  });
}

test('complete discovery, saved stay, simulated booking, confirmation and cancellation journey', async ({
  page,
}) => {
  const errors: string[] = [];
  const imageWarnings: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().includes('NG0913')) {
      imageWarnings.push(message.text());
    }
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Find my stay' })).toBeVisible();
  await capture(page, 'homepage-preview.png');
  await capture(page, 'homepage-desktop.png', true);

  await page.getByLabel('Where to?', { exact: true }).fill('Italy');
  await page.getByLabel('Check in', { exact: true }).fill(futureDate(14));
  await page.getByLabel('Check out', { exact: true }).fill(futureDate(18));
  await page.getByRole('button', { name: 'Find my stay' }).click();
  await expect(page).toHaveURL(/\/explore\?.*destination=Italy/);
  await expect(page.locator('app-property-card')).toHaveCount(3);
  await capture(page, 'search-results.png');

  await page.getByRole('button', { name: 'Save Casa della Luce', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Remove Casa della Luce', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Remove Casa della Luce', exact: true }),
  ).toBeVisible();
  await page.goto('/saved');
  await expect(
    page.getByRole('link', { name: 'Discover Casa della Luce', exact: true }),
  ).toBeVisible();
  await capture(page, 'wishlist.png');

  await page.goto(
    `/stays/casa-della-luce?checkIn=${futureDate(14)}&checkOut=${futureDate(18)}&guests=2&rooms=1`,
  );
  await expect(page.getByRole('heading', { name: 'Casa della Luce', exact: true })).toBeVisible();
  await capture(page, 'accommodation-details.png');
  await page.getByRole('button', { name: 'Open full accommodation photo gallery' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Reserve this stay' }).click();
  await expect(page).toHaveURL(/\/booking\/casa-della-luce/);

  await page.getByLabel('First name', { exact: true }).fill('Alex');
  await page.getByLabel('Last name', { exact: true }).fill('Morgan');
  await page.getByLabel('Email address', { exact: true }).fill('alex@example.com');
  await page.getByLabel('Phone number', { exact: true }).fill('+20 123 456 7890');
  await page
    .getByRole('checkbox', { name: /I understand this is a simulated reservation/ })
    .check();
  await capture(page, 'booking-process.png', true);
  await page.getByRole('button', { name: 'Confirm demo reservation', exact: true }).click();
  await expect(page).toHaveURL(/\/confirmation\//);
  await expect(page.getByRole('heading', { name: 'Your next chapter is booked.' })).toBeVisible();
  await expect(page.getByText(confirmationDate(futureDate(14)), { exact: true })).toBeVisible();
  await expect(page.getByText(confirmationDate(futureDate(18)), { exact: true })).toBeVisible();
  await capture(page, 'booking-confirmation.png');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your next chapter is booked.' })).toBeVisible();

  await page
    .getByRole('link', { name: /reservations/i })
    .last()
    .click();
  await expect(page).toHaveURL(/\/reservations/);
  await expect(page.getByRole('button', { name: 'Cancel reservation', exact: true })).toBeVisible();
  await capture(page, 'my-reservations.png');
  await page.getByRole('button', { name: 'Cancel reservation', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, cancel reservation', exact: true }).click();
  await expect
    .poll(async () =>
      page.evaluate((key) => {
        const raw = localStorage.getItem(key);
        return raw
          ? (JSON.parse(raw) as { reservations: { status: string }[] }).reservations[0]?.status
          : null;
      }, demoKey),
    )
    .toBe('canceled');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(errors).toEqual([]);
  expect(imageWarnings).toEqual([]);
});

test('invalid booking dates and incomplete guest details cannot create a reservation', async ({
  page,
}) => {
  await page.goto(
    `/stays/casa-della-luce?checkIn=${futureDate(14)}&checkOut=${futureDate(18)}&guests=2&rooms=1`,
  );
  await page.getByLabel('Check-out', { exact: true }).fill(futureDate(13));
  await expect(page.getByRole('alert')).toContainText('Check-out must be after check-in');
  await expect(page.getByRole('button', { name: 'Reserve this stay' })).toBeDisabled();
  await page.getByLabel('Check-out', { exact: true }).fill(futureDate(18));
  await page.getByRole('button', { name: 'Reserve this stay' }).click();
  await expect(page).toHaveURL(/\/booking\//);
  await page.getByRole('button', { name: 'Confirm demo reservation', exact: true }).click();
  await expect(page).toHaveURL(/\/booking\//);
  await expect(page.getByRole('alert')).toContainText('first and last name');
  const count = await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { reservations: unknown[] }).reservations.length : 0;
  }, demoKey);
  expect(count).toBe(0);
});

test('discovery filtering, sorting, pagination and URL persistence work', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.locator('app-property-card')).toHaveCount(6);
  await page.getByRole('combobox', { name: /Sort accommodations/ }).selectOption('price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  const firstCard = page.locator('app-property-card').first();
  await expect(firstCard).toContainText('Riad du Vent');
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.getByLabel('Villa', { exact: true }).check();
  await expect(page).toHaveURL(/type=Villa/);
  await expect(page.locator('app-property-card')).toHaveCount(3);
  await page.getByLabel('Pool', { exact: true }).check();
  await page.reload();
  await expect(page.getByLabel('Villa', { exact: true })).toBeChecked();
  await expect(page.getByLabel('Pool', { exact: true })).toBeChecked();
  await expect(page.locator('app-property-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Clear all', exact: true }).click();
  await expect(page.locator('app-property-card')).toHaveCount(6);
  await page.goto('/explore?destination=Atlantis');
  await expect(
    page.getByRole('heading', { name: 'Your next chapter is out there.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Explore all stays', exact: true }).click();
  await expect(page.locator('app-property-card')).toHaveCount(6);
  await expect(page.getByLabel('Where to?', { exact: true })).toHaveValue('');
});

test('mobile layout, navigation and keyboard focus remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Find my stay' })).toBeVisible();
  await capture(page, 'homepage-mobile.png', true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  const menu = page.getByRole('button', { name: /menu|navigation/i });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Find a stay', exact: true })
    .click();
  await expect(page).toHaveURL(/\/explore/);
  await page.getByRole('button', { name: /Filters/ }).click();
  await expect(page.getByRole('complementary', { name: 'Accommodation filters' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.goto('/stays/casa-della-luce');
  await expect(page.getByRole('heading', { name: 'Casa della Luce', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Reserve this stay' }).click();
  await expect(page.getByLabel('First name', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/reservations');
  await expect(page.getByRole('heading', { name: 'My reservations.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('tablet layouts keep search and room selection within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  for (const route of ['/', '/explore', '/stays/aegean-house']) {
    await page.goto(route);
    await expect(page.getByRole('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await expect(page.getByRole('button', { name: 'Reserve this stay' })).toBeEnabled();
});
