# PHOTOSHOOT PLAN — Services + Hero video

**Purpose:** new photography for the services menu (so every treatment family has a real, current photo on the site) and a new desktop hero video background.

**How this maps to the site:** the photos become webp images registered in `images.json` (slugs below). Give files meaningful names — `shoot-{slug}.jpg` — and drop them in a filebin like before. I will convert, register, and place them.

---

## 1. Golden rules for the whole shoot

- **Aspect mix for masonry:** roughly half 4:3 landscape (`4096×3072` or `3000×2250`), half 3:4 portrait (`3072×4096` / `2250×3000`). This is what gives the gallery its rhythm with zero cropping.
- **Never crop in camera:** shoot the full scene; the site shows images at natural aspect.
- **Light:** soft window light or a diffused LED panel. No harsh shadows across faces. Evening shoots: warm 2800–3500K for the lounge, neutral 5000K for treatment rooms.
- **Real detail, not stock:** the products, towels, tools and machines that are actually used. Guests may appear; get signed model release forms (names will be used only with consent).
- **Shoot in RAW + JPG.** Provide the JPGs (large, q90+) in the bin; I convert to webp.
- **Backup the bin before it expires** (previous bins expire ~6 days).

## 2. Shot list by service family (slugs in brackets = where they go)

### Massages (12 menu items) — `shoot-massage-*`
1. **Aromatherapy:** oil bottle + hands pressing into back, soft steam. (1 landscape)
2. **Back & Neck:** therapist's hands on shoulders, face-down guest, head rest visible. (1 landscape)
3. **Deep Tissue:** forearms working the back, warm-toned light. (1 landscape)
4. **Hot Stone (also in add-ons):** hot stones laid along the spine, stones in the therapist's hand. (1 landscape, 1 portrait detail)
5. **Face Massage:** fingers at temples, eyes closed, sheet pulled to chin. (1 portrait)
6. **Group/Besties (promotions):** two massage beds side by side, two therapists, laughing guests. (1 landscape — also used by Besties packages)
7. **Massage room wide:** the bed, robe, folded towels, candle — empty-room beauty shot. (1 landscape)

### Body treatments (4) — `shoot-body-*`
1. **Body Scrub:** scrub being applied to a forearm/shoulder, bowl of scrub close. (1 portrait)
2. **Shower suite:** the scrub shower with water running, marble/stone interior. (1 landscape)
3. **Vajacial:** tasteful, consultation-style shot — therapist gloved hands, product, fully draped. (1 portrait)

### Facials & skincare (9) — `shoot-facial-*`
1. **Deep Cleanse:** extraction/cleansing in progress, guest eyes closed, towel headband. (1 portrait)
2. **Brightening Peel:** peel being brushed on the cheek with a fan brush. (1 portrait detail)
3. **Anti-aging / LED:** LED panel over the face, purple glow, guest relaxed. (1 landscape)
4. **Dermaplaning (add-on):** the blade stroke on the cheek, close-up of the instrument. (1 portrait detail)
5. **BioMedical products in use:** the actual DermHydrix / NanoZyme / serum bottles next to the bed + being applied. (1 landscape, 1 portrait — feeds the Products strip)

### Foot care (6) — `shoot-foot-*`
1. **Foot massage:** therapist massaging a guest's foot, basin of warm water nearby. (1 landscape)
2. **Foot scrub with cuticle work:** close-up of the work on a foot, products visible. (1 portrait)
3. **Foot peel / pedicure station:** the basin + pedicure chair, neat tools. (1 landscape)

### Eyebrow care (4) — `shoot-brow-*`
1. **Brow lamination:** brush-through stroke on a brow, close-up. (1 portrait)
2. **Brow shaping & tint:** tint applied with a precise brush, client face visible (released). (1 portrait)

### Lashes (10) — `shoot-lash-*`
1. **Classic set finished:** closed eye, full lash set, macro. (1 portrait — this is the money shot)
2. **Hybrid/Volume set:** open eye looking down, lash texture visible. (1 portrait)
3. **Lash bed wide:** client reclined, therapist working under the lamp. (1 landscape)

### Nails (12) — `shoot-nail-*`
1. **Manicure in progress:** filing at the table, tools laid out. (1 landscape)
2. **3D nail art / gel overlay finished:** hands on a neutral cloth, ring light. (1 portrait)

### Hair removal (12) — `shoot-wax-*`
1. **Waxing in progress:** strip applied on an arm (fully professional, modest framing). (1 landscape)
2. **Post-treatment soothing:** balm applied after waxing. (1 portrait)

### Hydrotherapy (3) — `shoot-hydro-*`
1. **Soak in use:** guest in the tub, candles, steam, eyes closed. (1 portrait, 1 landscape)
2. **Tub prepared:** the tub filled, towels rolled, petals or candles — no guest. (1 landscape)

### Kiddie's corner (4) — `shoot-kids-*`
1. **Mini facial on a young guest:** child reclined, gentle, parent presence implied, fully released. (1 portrait)
2. **Kiddie manicure:** small hands at the nail table, bright and playful. (1 portrait)

### Refreshments (3) — `shoot-sip-*`
1. **Snack platter + sparkling water in the garden.** (1 landscape)
2. **Glass of wine / whisky on the lounge table, low warm light.** (1 portrait)

### The venue (also feeds /venues) — `shoot-venue-*`
1. **Garden set for a celebration:** long table, candles, string lights, dusk. (1 landscape — hero candidate for /venues)
2. **Lounge styled for a party:** sofas, low tables, drinks. (1 landscape)

## 3. Quantity summary

| Family | Shots |
|---|---|
| Massage | 7 |
| Body | 3 |
| Facial | 5 |
| Foot | 3 |
| Brow | 2 |
| Lash | 3 |
| Nail | 2 |
| Wax | 2 |
| Hydro | 2 |
| Kids | 2 |
| Refreshments | 2 |
| Venue | 2 |
| **Total** | **~35 shots** (≈18 landscape + ≈17 portrait) |

This covers every service family with at least one current photo, plus replacements for the weakest existing images.

---

## 3b. Team portraits (clean pictures of the team)

The team page needs one clean, consistent portrait per professional (Laurensia, Daivienn, Diana, Shanice Khadijah, Merie-Ann (Lulu), plus a fresh Founder & CEO portrait of Evelyne Mulilo if the current one can be improved).

- **Format:** 4:5 portrait, plain or softly blurred spa background (no props in frame), face well lit, looking at camera, warm neutral backdrop (marble or off-white wall).
- **Consistency:** same distance (head and shoulders, chin above the bottom third), same light direction, same backdrop across the whole set.
- **Naming:** `team-{slug}.jpg` where slug matches each member (laurensia, daivienn, diana, shanice-khadijah, merie-ann-lulu, evelyne-mulilo).
- Include the signed release; these portraits are shown publicly on the site.

## 4. Hero video — replace desktop, keep the current one on mobile

The site currently plays one video on both desktop and mobile. The plan:

- **Desktop (≥ 768 px): NEW clip.** Shoot one 10–14 s clip, 16:9, 4K (3840×2160) at 24 or 30 fps, no audio needed (the site plays it muted).
  - Suggested move: start on the garden at golden hour → slow glide through the door → reception with the logo softly in view → drift toward a treatment room with candles — or one continuous slow push-in through the lounge. The key is **one unbroken, calm motion**, no cuts, no zoom punch-ins.
  - Keep camera on a gimbal or dolly; movement must be slow and even (it sits behind the hero text).
  - Expose for the highlights; the site adds a dark emerald veil over the top, so slightly brighter is better.
  - Name it `hero-desktop.mp4` (and provide a poster frame `hero-desktop-poster.jpg`).
- **Mobile (< 768 px): KEEP the current clip** (`hero-mobile.mp4`) — it is already framed for a vertical/portrait phone and works.
- **Deliverable to me:** the raw mp4 (or mov) + poster frame in the same filebin as the photos. I will transcode to 1080p h264 + webm, extract/convert the poster to webp, and wire the responsive swap in `HeroVideo.tsx`.

---

## 5. Handover checklist

- [ ] All JPGs named with the slugs above (`shoot-massage-1.jpg`, …)
- [ ] Model releases collected for any visible guest
- [ ] `hero-desktop.mp4` + `hero-desktop-poster.jpg` included
- [ ] Bin link shared (files will be converted to webp, then the originals can be kept in `/home/user/assets/raw/`)
