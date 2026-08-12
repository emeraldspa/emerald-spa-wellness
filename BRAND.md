# BRAND

## Framework source

Structure follows COLLINS, `wearecollins.com`, whose stylesheet was fetched and
parsed directly. The brief named `wearecolins.com`, which does not resolve.

Borrowed: serif display against neutral grotesk, off-white ground with near
black ink, one saturated signal colour, clamped grid padding, and the easing
ladder. Not borrowed: their orange, their licensed fonts, their copy, their
layouts.

## Colour

Every value is sampled from `emerald-spa-symbol-full-color.svg`.

Emerald, from the gemstone facets:
`#EAF6F1` `#C7E9DA` `#75E0BA` `#087452` `#0A5A45` `#07503D` `#063F31` `#063D2F`

Rose gold, from the orbital ring gradients:
`#FFF0A4` `#FFE18A` `#F2C35E` `#F1C35D` `#C77B36` `#A75D31` `#7B3D20` `#7A3B20`

Ground `#F7F5F1`. Ink `#07211A`.

Contrast rule: text on ground never falls below `ink/65`, measured at 5.16:1.
Anything lighter failed AA and was removed.

## Typography

Display: Fraunces. Line height 0.92, letter spacing -0.022em.
Interface: Inter. Eyebrows uppercase at 0.6875rem, 0.18em tracking.

## Logo

The client's real artwork, supplied as a logo package and preserved unmodified
at `assets/emerald-spa-logo-original.png`.

- `public/brand/lockup-stacked-dark.png`, cream wordmark, for dark grounds.
  This is the featured footer mark.
- `public/brand/lockup-stacked-light.png` and the horizontal pair for light
  grounds and header widths.
- `public/brand/symbol-photoreal.png`, transparent, for featured placements.
- `public/brand/symbol-full.svg` and `symbol-mark.svg` for vector use. The
  simplified mark is for small sizes only.
- `public/icons/`, favicon set at 16, 32, 48, 180, 192, 512, plus SVG and ICO.

Never stretch the mark non-uniformly, never redraw it, never recolour the gem
or the rings. Clear space of at least half the symbol height on every side.

Typeface flag carried over from the supplied manifest: the wordmark's exact
typeface could not be identified from the raster original, so the SVG wordmark
specifies Playfair Display with a serif fallback. Needs client verification if
the original vector is available.

## Motion

Purpose: signal reading order on first paint and on scroll entry. Motion never
carries meaning, so removing it costs nothing.

Hierarchy: headings clip-reveal from a masked wrapper. Supporting content fades
up 28px. Images scale to 1.03 on hover. Nothing else moves.

Timing: 0.28s interface response, 0.6s entrances, 0.7s heading reveals. Nothing
exceeds 0.9s. Stagger caps at 0.14s.

Easing: `cubic-bezier(0.22,1,0.36,1)` entrances,
`cubic-bezier(0.19,1,0.22,1)` hover transforms.

Frequency gate: every scroll entrance runs once and never replays. No
autoplaying carousel, no looping decoration, no parallax.

Engine: CSS for the hero because it holds LCP and must paint without waiting
for JavaScript. Framer Motion for scroll entrances below the fold only. No
second animation library was added.

Reduced motion: all transforms and animations removed, every element renders in
its final state. Verified with a reduced-motion browser context.

Performance budget: hero animates transform only, never opacity, so text paints
on the first frame. The hero video is deferred until idle and skipped entirely
under Data Saver or reduced motion.

## Imagery

Only real photographs of the premises. They are honest phone captures rather
than editorial photography, so layout gives them room and typography carries
the polish. The spa's promotional graphics are shown in their own section,
never mixed with room photography.

Delivery: AVIF and WebP at four widths with a JPEG fallback, dimensions always
declared, below-fold images lazy loaded.
