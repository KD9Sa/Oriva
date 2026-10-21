# Validation record

Verified on **21 October 2026** with Node.js 24.21.0, Angular 22.2.3, TypeScript 6.0, Vitest, and installed Microsoft Edge through Playwright.

## Automated verification

| Command                | Result                   | Coverage                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`             | 25 tests pass in 2 files | Strict calendar dates, DST arithmetic, date presentation, half-open overlaps, peak concurrent inventory, guests/rooms, exact cent totals, available room budget, sorting, storage validation and fallback, booking creation, idempotency, cancellation, wishlist, reset, repository error/retry |
| `npm run test:e2e`     | 5 browser journeys pass  | Full discovery → save/reload → gallery → checkout → confirmation/reload → reservations → cancellation; invalid dates and details; search filters/sort/pagination/URL refresh; mobile controls, keyboard focus, tablet layouts                                                                   |
| `npm run build`        | Pass, no warnings        | Optimized production compilation, strict TypeScript and Angular template checks, lazy route chunks, configured bundle budgets                                                                                                                                                                   |
| `npm run format:check` | Pass                     | Source, templates, CSS, tests, configuration, and Markdown formatting                                                                                                                                                                                                                           |

The browser suite explicitly uses `Africa/Cairo` to catch a date-only formatting regression. Booking dates must remain the same dates in the price summary, stored reservation, confirmation, and reservations list.

## Actual visual review

Real application captures are in `docs/assets/screenshots/`. They cover the desktop homepage (preview and full page), mobile homepage, search, accommodation details, checkout, confirmation, wishlist, and reservations. The browser suite regenerates these files. No illustration is represented as an application screenshot.

Desktop search was corrected after reviewing a fieldset legend that displaced its first radio option. Confirmation and checkout date formatting were corrected after real captures exposed a one-day timezone shift. Notification toasts are dismissed before final screenshots so receipt information remains visible.

Mobile (390 × 844), tablet (768 × 1024), and desktop (1440 × 1000) views were checked. Automated overflow assertions cover home, discovery, details, checkout, and reservations at relevant sizes. The mobile menu and filter disclosure, gallery Escape behavior, visible keyboard focus, and responsive search were exercised.

The original SVG design-system board was separately parsed, rendered in Edge, and visually inspected. Its raster preview is `docs/assets/design-system-board-preview.png`.

## Scope and limits

- This is a complete **frontend portfolio demo** using fictional accommodations and local inventory. No backend, hotel integration, authentication, payment processing, or booking emails are implemented.
- Browser storage can be cleared or altered, does not synchronize between devices, and cannot guarantee atomic inventory changes between tabs. A real reservation service must enforce authoritative inventory, pricing, access control, and transactions.
- The runtime has useful skeleton, empty, validation, and error/retry states. Unit tests exercise repository failure and storage fallback; these failures are not artificially injected into normal use.
- Tests use a Chromium browser. Independent Firefox, Safari, assistive-technology, WCAG certification, and Lighthouse audits were not performed. Semantic controls, focus styles, native dialog focus management, accessible form labels, live feedback, and reduced-motion CSS are implemented, but this is not a certification claim.
- Production output is ready for a static host with an index fallback for Angular routes. This delivery is local; no public deployment or GitHub push is claimed.

## Repeat the checks

```sh
npm ci
npm test
npm run build
npm run format:check
npm run test:e2e
```

The browser configuration detects installed Edge or Chrome on Windows. On another system, install the test browser with `node ./node_modules/playwright/cli.js install chromium`, or set `PLAYWRIGHT_EXECUTABLE_PATH`. The browser suite starts the local application automatically when port 4200 is not already serving it. `npm run screenshots` runs the same journeys and refreshes the documented captures.
