# Oriva — design system

## Brand and creative direction

Oriva is an invented name inspired by **horizons and arrival**: the moment a place becomes a feeling. It represents considered discovery for independent travelers who value beautiful spaces, local character, and slower journeys. Its personality is quietly confident, warm, observant, and inviting. No trademark availability is claimed.

Three directions were considered before implementation:

| Direction                          | Typography                                      | Color / imagery                                          | Composition / feeling                                                                    |
| ---------------------------------- | ----------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| The slow travel journal — selected | Expressive Fraunces serif with readable DM Sans | Ivory, forest, citron; sunlit architecture and landscape | Oversized editorial headlines, immersive image spreads, fine rules; warm and exploratory |
| Architectural atlas                | Geometric sans with monospaced labels           | Chalk, graphite, rust; precise architectural crops       | Hard grids, numbering, sharp corners; analytical and restrained                          |
| Mediterranean atelier              | Soft serif with humanist sans                   | Sand, cobalt, terracotta; tactile details                | Layered collage and illustrated accents; playful and artisanal                           |

The journal direction gives the most useful balance of memorable hospitality storytelling and legible transaction design. Booking controls remain compact, conventional, and explicit.

## Color tokens

| CSS token                | HEX       | Role                                             |
| ------------------------ | --------- | ------------------------------------------------ |
| `--color-primary`        | #243F35   | Forest: primary actions, headings, dark sections |
| `--color-secondary`      | #61705D   | Olive: supporting visual identity                |
| `--color-accent`         | #D4E5AE   | Citron: highlights on forest, collection tags    |
| `--color-background`     | #F8F8F3   | Warm ivory page background                       |
| `--color-surface`        | #F0F1E8   | Alternate sections and form surfaces             |
| `--color-elevated`       | #FFFFFF   | Inputs, dialogs, search bar                      |
| `--color-text`           | #23362D   | Primary text                                     |
| `--color-text-secondary` | #566157   | Secondary text                                   |
| `--color-muted`          | #687166   | Metadata and supporting text                     |
| `--color-border`         | #DADDD2   | Rules, borders                                   |
| `--color-hover`          | #355548   | Primary hover                                    |
| `--color-success`        | #286140   | Success                                          |
| `--color-warning`        | #805C17   | Warning text on light surfaces                   |
| `--color-error`          | #A23429   | Invalid fields and errors                        |
| `--color-info`           | #325D72   | Informational text                               |
| `--color-overlay`        | #172B23B8 | Dialog backdrops                                 |

Use dark forest text on citron, white on forest, and primary/secondary text on ivory. Citron is a surface accent, never small text on white. Focus uses an offset forest outline. Disabled controls retain descriptive labels.

## Typography

**Fraunces** (SIL Open Font License) gives travel headlines a literary character; **DM Sans** (SIL Open Font License) supports compact booking interfaces. Fonts are self-hosted when available, with Georgia and system sans fallbacks. Font display is swap.

| Role               | Size                   | Weight | Line height / tracking  |
| ------------------ | ---------------------- | ------ | ----------------------- |
| Hero               | clamp(48px, 6vw, 88px) | 400    | 1.04 / -0.045em         |
| Display / H1       | clamp(38px, 4vw, 60px) | 400    | 1.1 / -0.035em          |
| H2                 | clamp(30px, 3vw, 44px) | 400    | 1.15 / -0.03em          |
| H3                 | 25px                   | 400    | 1.25 / -0.025em         |
| H4–H6              | 20 / 18 / 16px         | 500    | 1.3 / -0.01em           |
| Body               | 15px                   | 400    | 1.65 / normal           |
| Supporting         | 14px                   | 400    | 1.5 / normal            |
| Caption / metadata | 12px                   | 400    | 1.45 / 0.01em           |
| Eyebrow            | 11px                   | 600    | 1.4 / 0.14em, uppercase |
| Label / button     | 13px                   | 500    | 1.4 / 0.01em            |
| Price              | 22px                   | 600    | 1.2 / -0.035em          |

## Layout and geometry

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 112px. Container max width 1320px; desktop gutters 48px, tablet 32px, phone 20px. Grids use 24px gaps and 12 conceptual columns. Section spacing is 80px desktop and 48px mobile. Breakpoints: 600px, 900px, 1200px.

Images use 4–8px radii; panels 8px; pills 999px only for compact filters/tags. Borders are 1px. Search bar and dialog use a restrained 0 12px 40px #172B2312 shadow. Layers: header 20, popover 30, modal 50, toast 70. Sticky booking summaries begin below the navigation.

## Components and interaction

- **Navigation:** wordmark and original compass/sun mark, active link underline, labeled saved and reservation links. Mobile uses a disclosure button with `aria-expanded`.
- **Buttons:** forest solid primary, bordered secondary, underlined text link. Minimum 44px touch target. Hover shifts color; focus is visible; busy/disabled states explain the reason.
- **Search:** visible destination, native date inputs (keyboard and platform calendar support), bounded guest/room inputs, submit action. Dates and query travel in the URL.
- **Property cards:** landscape image, category/location metadata, serif title, rating, integer-cent based price, separate labeled favorite button. Link and favorite button never nest.
- **Filters and sort:** labeled controls, active chips, reset action, responsive disclosure panel; no filter silently fails. Results announce counts. Pagination uses real buttons and indicates current page.
- **Gallery:** asymmetrical photo spread with labeled full-screen dialog, Escape/backdrop close and native dialog focus management.
- **Forms:** labels above controls, associated inline error messages, `aria-invalid` where appropriate, typed reactive checkout form. No payment-card inputs.
- **Booking:** room selector, date range, guests and rooms, price breakdown, availability result, cancellation explanation and clearly labeled simulated confirmation.
- **Dialogs:** native `<dialog>` top layer, accessible name, focus containment and restored focus; explicit cancel/confirm actions.
- **Tabs:** reservation status is a set of filter buttons with `aria-pressed`, not incomplete ARIA tab widgets.
- **Feedback:** skeleton shimmer during repository loading; actionable errors with retry; illustrated empty state and reset/discovery action; polite live-region toast. Confirmation uses a distinct success marker and printable receipt.
- **Footer:** wordmark, discovery links, policies, demo disclosure, accessible reset demo action. Legal/information content opens a readable dialog.

## Motion

Fast 150ms, standard 240ms, reveal 500ms; ease cubic-bezier(.2,.7,.2,1). Images scale to 1.035 on hover; buttons change color; dialogs fade and translate 8px. Animate only opacity/transform for reveals. Reduced-motion removes animations, transforms and smooth scrolling. No auto-playing carousels or forced waits.

## Implementation and acceptance plan

1. Establish this brand, board and CSS tokens before main-page development.
2. Create strict standalone Angular architecture with lazy feature routes, injectable repository, signal state, typed domain contracts and versioned safe storage.
3. Implement discovery → property → typed checkout → local confirmation → reservation management, with persistent wishlist.
4. Verify filtering, half-open date overlaps, room inventory, capacity, integer-cent totals, creation/cancellation and storage with automated tests.
5. Build production output, inspect actual desktop/mobile browser rendering and complete journey, capture real screenshots, and document actual results.

Acceptance: all seven page types work, invalid bookings are prevented, cancellation frees inventory, URL filters survive refresh, empty/error states are useful, and no simulated reservation is represented as a real hotel booking.
