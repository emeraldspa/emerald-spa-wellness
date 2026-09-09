"""Branded OG images (1200x630) for every Emerald special.

Each card is built from the client's own photography: a full-bleed photo on
the left, a deep emerald panel on the right carrying the package name, price
and the booking line. Radley + Poppins, the site's type pairing. Output goes
to og_specials/ as JPG (quality 82), ready to upload to WordPress media.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

REPO = "/home/z/my-project/emerald-spa-wellness"
MEDIA = f"{REPO}/public/media"
OUT = "/home/z/my-project/scripts/og_specials"
FONTS = "/home/z/my-project/scripts/fonts"
os.makedirs(OUT, exist_ok=True)

W, H = 1200, 630
PANEL_X = 640

INK = (10, 46, 36)
EMERALD = (6, 63, 49)
EMERALD_DEEP = (4, 40, 32)
GOLD = (212, 175, 55)
GOLD_SOFT = (235, 208, 148)
CREAM = (247, 245, 241)
MINT = (183, 226, 205)

SPECIALS = [
    {
        "slug": "massage-package-for-two",
        "photo": "wine-pair-1600.webp",
        "name": "Massage Package\nfor Two",
        "price": "N$ 1 700",
        "meta": "2 guests  ·  2 hours",
    },
    {
        "slug": "squad-package",
        "photo": "garden-lounge-guests-1600.webp",
        "name": "(S)quad\nPackage",
        "price": "N$ 3 000",
        "meta": "4 guests  ·  Afternoon",
    },
    {
        "slug": "sisterhood-brotherhood",
        "photo": "venue-party-8-1600.jpg",
        "name": "Sisterhood &\nBrotherhood",
        "price": "N$ 4 500",
        "meta": "6 guests  ·  Celebration",
    },
    {
        "slug": "christmas-grace",
        "photo": "candlescape-1200.webp",
        "name": "Christmas Grace\nPackage",
        "price": "N$ 2 400",
        "meta": "For 2  ·  December",
    },
    {
        "slug": "new-year-renewal",
        "photo": "hydrotherapy-soak-1600.webp",
        "name": "New Year\nRenewal",
        "price": "N$ 1 700",
        "meta": "1 guest  ·  Half day",
    },
    {
        "slug": "valentines-for-two",
        "photo": "robe-garden-seat-1600.webp",
        "name": "Valentine's\nfor Two",
        "price": "N$ 1 900",
        "meta": "2 guests  ·  February",
    },
    {
        "slug": "mothers-day-pamper",
        "photo": "facial-treatment-1600.webp",
        "name": "Mother's Day\nPamper",
        "price": "N$ 1 500",
        "meta": "1 guest  ·  May",
    },
    {
        "slug": "independence-retreat",
        "photo": "serenity-garden-1600.webp",
        "name": "Independence\nRetreat",
        "price": "N$ 2 100",
        "meta": "2 guests  ·  March",
    },
    {
        "slug": "midweek-escape",
        "photo": "garden-reading-1600.webp",
        "name": "Midweek\nEscape",
        "price": "N$ 950",
        "meta": "1 guest  ·  Tue to Thu",
    },
]

def font(path, size):
    return ImageFont.truetype(os.path.join(FONTS, path), size)

def gem(d, cx, cy, r, fill_main, fill_hi, stroke):
    d.polygon([(cx, cy - r), (cx + r * 0.9, cy), (cx, cy + r), (cx - r * 0.9, cy)], fill=fill_main,
              outline=stroke)
    d.polygon([(cx, cy - r), (cx + r * 0.9, cy), (cx, cy)], fill=fill_hi)

for sp in SPECIALS:
    photo = Image.open(os.path.join(MEDIA, sp["photo"])).convert("RGB")

    # Cover-crop the photo into the left region.
    pw, ph = PANEL_X, H
    scale = max(pw / photo.width, ph / photo.height)
    resized = photo.resize((int(photo.width * scale) + 1, int(photo.height * scale) + 1), Image.LANCZOS)
    left = (resized.width - pw) // 2
    top = (resized.height - ph) // 2
    photo = resized.crop((left, top, left + pw, top + ph))

    # Right panel: deep emerald with soft radial gold + mint blooms.
    panel = Image.new("RGB", (W - pw, H), EMERALD_DEEP)
    pd = ImageDraw.Draw(panel, "RGBA")
    pd.ellipse([220, -140, 640, 220], fill=(212, 175, 55, 34))
    pd.ellipse([-160, 380, 240, 760], fill=(26, 115, 87, 60))
    panel = panel.filter(ImageFilter.GaussianBlur(2))

    card = Image.new("RGB", (W, H))
    card.paste(photo, (0, 0))
    card.paste(panel, (pw, 0))

    # Gentle scrim over the photo's right edge so the seam blends.
    scrim = Image.new("L", (80, H), 0)
    sd = ImageDraw.Draw(scrim)
    for x in range(80):
        sd.line([(x, 0), (x, H)], fill=int(255 * (x / 80) ** 1.2))
    dark = Image.new("RGB", (80, H), EMERALD_DEEP)
    card.paste(dark, (pw - 80, 0), scrim)

    d = ImageDraw.Draw(card)
    # Gold hairline at the seam.
    d.line([(PANEL_X, 0), (PANEL_X, H)], fill=(212, 175, 55, 160), width=2)

    ox = PANEL_X + 56
    gem(d, ox + 14, 86, 17, (8, 116, 82), (117, 224, 186), (117, 224, 186))

    d.text((ox + 44, 68), "EMERALD", font=font("font0.ttf", 21), fill=CREAM)
    d.text((ox + 44, 94), "SPA & WELLNESS CENTRE", font=font("font1.ttf", 11), fill=MINT)

    f_name = font("font2.ttf", 52)
    y = 190
    for line in sp["name"].split("\n"):
        d.text((ox, y), line, font=f_name, fill=CREAM)
        y += 62

    d.line([(ox, y + 6), (ox + 74, y + 6)], fill=GOLD, width=2)

    d.text((ox, y + 34), sp["price"], font=font("font0.ttf", 40), fill=GOLD_SOFT)
    d.text((ox, y + 92), sp["meta"].upper(), font=font("font1.ttf", 15), fill=MINT)

    d.text((ox, H - 66), "7 Blackett Street, Windhoek North",
           font=font("font1.ttf", 14), fill=(148, 190, 170))
    d.text((ox, H - 44), "+264 81 607 7143  ·  emeraldspacc.com",
           font=font("font1.ttf", 14), fill=(148, 190, 170))

    out_path = os.path.join(OUT, f"og-{sp['slug']}.jpg")
    card.save(out_path, "JPEG", quality=82, optimize=True)
    print(out_path, os.path.getsize(out_path) // 1024, "KB")
