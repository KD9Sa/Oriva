# Image, font, and identity sources

All accommodation names, descriptions, rates, ratings, reviews, hosts, and availability in Oriva are fictional demonstration data. Photography is **illustrative** and does not identify or promise an actual hotel or room. A photograph's real location may differ from the demo property's location.

Images are downloaded into `public/assets/images/`, so the finished application does not depend on a remote image service. The source URLs below make replacements straightforward. Images are resized at download (1920px hero, 1400px editorial, 1100px property images) and compressed; the application supplies alt text, stable aspect ratios, lazy loading, and an error fallback.

## Photography

Unsplash images are used under the [Unsplash License](https://unsplash.com/license). Pexels images are used under the [Pexels License](https://www.pexels.com/license/). No hotel logos or brand marks are reproduced.

| Local file      | Source                                                                                                                            | Intended visual                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `hero.jpg`      | [Unsplash original](https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff)                                                 | Santorini terraces and sea at sunset              |
| `stay-01.jpg`   | [Unsplash original](https://images.unsplash.com/photo-1613490493576-7fde63acd811)                                                 | Contemporary villa and pool                       |
| `stay-02.jpg`   | [Unsplash / Santorini](https://unsplash.com/photos/santorini-greece-yB6WFHbkX40)                                                  | White architecture, caldera and plunge pool       |
| `stay-03.jpg`   | [Unsplash original](https://images.unsplash.com/photo-1600596542815-ffad4c1539a9)                                                 | Light-filled contemporary home                    |
| `stay-04.jpg`   | [Alexander Psiuk / Unsplash](https://unsplash.com/photos/a-relaxing-courtyard-with-a-pool-and-wooden-door-m4F-2C_4Nbw)            | Moroccan courtyard, carved wood, foliage and pool |
| `stay-05.jpg`   | [Unsplash original](https://images.unsplash.com/photo-1571896349842-33c89424de2d)                                                 | Tropical resort pool                              |
| `stay-06.jpg`   | [Bor Jinson / Pexels](https://www.pexels.com/photo/traditional-tatami-room-setup-in-japan-ryokan-37067835/)                       | Traditional Japanese tatami dining room           |
| `stay-07.jpg`   | [Robert Bye / Unsplash](https://unsplash.com/photos/field-leads-to-a-house-lined-with-trees-lVJBOPjlYU0)                          | Tuscan country house and cypress-lined field      |
| `stay-08.jpg`   | [Unsplash original](https://images.unsplash.com/photo-1533105079780-92b9be482077)                                                 | Aegean island whitewashed steps and sea           |
| `stay-09.jpg`   | [Unsplash original](https://images.unsplash.com/photo-1542314831-068cd1dbfeeb)                                                    | Poolside architecture at dusk                     |
| `stay-10.jpg`   | [Unsplash original](https://images.unsplash.com/photo-1566073771259-6a8506099945)                                                 | Wooden tropical lodge and pool                    |
| `stay-11.jpg`   | [Chris Boland / Unsplash](https://unsplash.com/photos/a-large-green-landscape-with-a-body-of-water-in-the-background-e4sTXGYqsek) | Lake Como villa gardens                           |
| `stay-12.jpg`   | [Msaidi Art / Pexels](https://www.pexels.com/photo/serene-courtyard-pool-in-marrakech-riad-38787222/)                             | Moroccan green-tiled courtyard pool               |
| `editorial.jpg` | [Unsplash original](https://images.unsplash.com/photo-1516483638261-f4dbaf036963)                                                 | Cinque Terre village and the Italian coast        |

## Self-hosted fonts

- **Fraunces**, normal variable weight 400–500 and italic weight 400: [Google Fonts family](https://fonts.google.com/specimen/Fraunces), [source and license](https://github.com/google/fonts/tree/main/ofl/fraunces). Redistributed SIL Open Font License text: `public/assets/fonts/Fraunces-LICENSE.txt`.
- **DM Sans**, normal variable weight 400–700: [Google Fonts family](https://fonts.google.com/specimen/DM+Sans), [source and license](https://github.com/google/fonts/tree/main/ofl/dmsans). Redistributed SIL Open Font License text: `public/assets/fonts/DM-Sans-LICENSE.txt`.

Latin WOFF2 subsets are self-hosted in `public/assets/fonts/`; system/Georgia fallbacks cover characters outside those subsets. The original Google Fonts CSS response is retained as `sources.css` for provenance; application styles reference only the local font files.

## Original visual identity

`public/assets/logo.svg`, `public/favicon.svg`, and `docs/assets/design-system-board.svg` were created specifically for this project. The compass/sun emblem suggests direction and arrival. SVG keeps the identity crisp without a raster asset dependency. The invented name Oriva is a creative project name; trademark availability has not been investigated or claimed.
