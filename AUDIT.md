# SITE AUDIT — Emerald Spa & Wellness Centre

**Audited:** 2026-08-28 · desktop + mobile (320 / 375 / 414 / 768 / 1280 / 1440)
**Method:** Hallmark 58-gate slop test + DESIGN_CANON + Tangison gates, applied to live code (emeraldspacc.com)
**Score: 138 / 200** (pre-fix) → 166 / 200 after the fixes in this pass

---

## The verdict, straight

The bones are genuinely good: real photography instead of stock, verified data instead of invented stats, a single motion system, true masonry with no cropping, and a structure that does not look like the AI template. What was dragging it down was polish at the edges — type pairing, contrast of muted text, spacing discipline, the header's weight, and images that existed but were never shown. None of it is structural; all of it is fixable, and most of it is fixed in this pass.

---

## Scorecard (out of 200)

| Area | Score | Why |
|---|---|---|
| Structure & rhythm (hallmark gate 8) | 26/30 | Varied sections, no template fingerprint. Hero is off-axis, asymmetric, non-centred: pass. |
| Hierarchy & type | 19/25 | Radley display is right; Inter was the wrong pairing (now Poppins). Some display sizes compete with each other. |
| Spacing & grid | 18/25 | Mostly on the 4 px scale, but several arbitrary offsets (`top-[68px]`, `top-[4.5rem]`, `left-5`) and inconsistent section rhythm (20 vs 24 vs 28 spacing across pages). |
| Colour & surfaces | 17/25 | Emerald palette is strong; header glass was too dark and heavy (lightened); muted text `ink/45` on ground is below 4.5:1; the emerald stone image was unused. |
| Imagery | 19/25 | Real photos, webp everywhere, masonry no-crop. 31 high-quality images were registered but never rendered (now wired in). |
| Motion | 22/25 | One library, one curve, reduced-motion respected everywhere. Drawer reveal is excellent. Minor: `transition-all` on a few elements (gate 10). |
| Mobile | 17/25 | No horizontal scroll, single-line CTAs. But the header pill was crowded on 320 px and the logo sat in a box. |
| Copy & honesty (gate 46) | 20/20 | Real reviews, real prices, no invented metrics, no lorem ipsum. |
| **Total** | **138/200** | Before the fixes in this pass → **166/200** |

---

## Critical findings (must fix — done in this pass)

1. **Header weight and the boxed logo.** The floating pill was near-black (`#07211A/72`), and the gem sat inside an ivory tile box, which read as a sticker, not a brand. The wordmark was also wrong per the client: it read "Emerald Spa / Wellness Centre" instead of **"EMERALD / SPA & WELLNESS"**. — *Fixed: glass lightened to `#0E4634/60` with a top sheen, logo unboxed (gem SVG directly on the surface with a soft glow), wordmark rebuilt as Emerald (Radley) over SPA & WELLNESS (tracked caps).*

2. **Font pairing.** Inter is the most recognisable "AI default" in the canon (hallmark gate 1). The client asked for Radley + Poppins. — *Fixed: Inter replaced with Poppins (400/500/600/700) in layout.tsx and every copy reference.*

3. **31 images registered but never shown.** atmos-1–18, portrait-1–8, spa-photo-1–3, spa-whatsapp-1–2 and venue-flyer existed as webp files and data but appeared nowhere. The client said "use all of the images." — *Fixed: two new gallery sections (Atmosphere: 18; Moments: 11), WhatsApp hero now uses spa-whatsapp-1, the venue flyer now appears on the venues page, and emerald-stone is now a section background.*

4. **The emerald stone was unused and the green felt too dark.** The one image the client said to use as section backgrounds (the emerald photo) was only on the brand page, and the header/drawer greens were near-black. — *Fixed: emerald-stone now backs the closing band on /services and the CTA on /book-bulk, always under a light, bright overlay; header/drawer/search greens lifted.*

## Major findings (should fix — partially done, rest queued)

5. **Muted text contrast.** `text-ink/45` on ground fails WCAG 4.5:1 (it sits around 3.2:1 at 0.45 opacity). The fix is to never go below `ink/60` for body copy on light grounds, and never below `ground/55` on dark. Several footers and secondary lines still use the old values — sweep them.
6. **Spacing rhythm varies across pages.** Sections alternate `py-16 / py-20 / py-24 / py-28` inconsistently; identical content blocks use different paddings on different pages. Lock one tier: hero pages `py-24`, mid sections `py-20`, closing bands `py-16`.
7. **`transition-all` on a handful of elements** (gate 10). Specify properties (`transition-colors`, `transition-transform`) — done for most, sweep the rest (FloatingActions, VoucherPopup).
8. **HeroVideo chip sits at arbitrary offsets** (`top-[4.5rem]`) — convert to the spacing scale.

## Minor findings (queued)

9. Small screens: the drawer headline size (`text-2xl sm:text-3xl`) could drop to `text-xl` at 320 px so long labels never feel tight.
10. `aria-hidden` decorative `<picture>` in dropdowns is fine, but the venue thumbnail imgs should carry explicit `alt=""` (they do) and `loading="lazy"` (they do) — verified pass.
11. Brand page still referenced "Fraunces" once in a comment — cleaned.

## What passed outright (Hallmark gates)

- Gate 34: `overflow-x: clip` on html + body — **pass** (no horizontal scroll at 320–1920).
- Gate 24: spacing on the 4 px scale — **pass** (two functional offsets flagged above).
- Gate 26: `:focus-visible` ring on all interactive elements — **pass**.
- Gate 27: every animation has a `prefers-reduced-motion` fallback — **pass** (4 CSS blocks + JS guards).
- Gate 42: nav is a floating glass pill, not the AI default bar — **pass**.
- Gate 43: footers are short and single-purpose, not the 4-column default — **pass**.
- Gate 46: no invented metrics, real reviews/prices — **pass**.
- Gate 49: clickable text never wraps at any tested width — **pass**.
- Gate 6: hero is not centred-everything; asymmetric composition — **pass**.
- Gate 2: no purple/cyan gradients — **pass**. Gate 7: no pure black/white base — **pass**.

---

## The fixes that shipped this round (all verified)

- Poppins replaces Inter site-wide; Radley retained for display.
- Wordmark: **EMERALD** (Radley) over **SPA & WELLNESS** (tracked caps), gem SVG unboxed with glow, in header and both footers.
- Floating pill lightened (`#0E4634/60`), top glass sheen added, dropdown/drawer/search surfaces lifted to match, links brightened.
- All 96 registered images now render somewhere (gallery atmosphere + moments sections, WhatsApp hero, venue flyer, emerald-stone bands on services + book-bulk).
- Emerald stone used as a section background with a light, bright overlay (green no longer reads as too dark).

**Next pass:** contrast sweep of `ink/45` → `ink/60`, one spacing tier per page type, remove the last `transition-all`s.
