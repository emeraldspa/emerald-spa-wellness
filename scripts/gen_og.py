from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

photo = Image.open('/home/user/repo/public/media/reception-lounge-1600.avif').convert('RGB')
photo = photo.resize((1200, 630), Image.LANCZOS)

overlay = Image.new('RGB', (1200, 630), (6, 61, 49))
overlay = overlay.point(lambda x: int(x * 0.62))
mask = Image.new('L', (1200, 630), 0)
d = ImageDraw.Draw(mask)
d.rectangle([0, 0, 1200, 630], fill=160)
mask = mask.filter(ImageFilter.GaussianBlur(18))
card = Image.composite(photo, overlay, mask)

band = Image.new('RGB', (1200, 260), (5, 48, 39))
band_mask = Image.new('L', (1200, 260), 0)
bd = ImageDraw.Draw(band_mask)
for y in range(260):
    bd.line([(0, y), (1200, y)], fill=int(255 * (y / 260) ** 1.4))
band_mask = band_mask.filter(ImageFilter.GaussianBlur(6))
card.paste(band, (0, 370), band_mask)

d = ImageDraw.Draw(card)
d.polygon([(120, 180), (220, 280), (120, 380), (20, 280)], fill=(8, 116, 82))
d.polygon([(120, 180), (220, 280), (120, 280)], fill=(117, 224, 186))
d.line([(120, 168), (236, 280), (120, 392), (4, 280), (120, 168)], fill=(117, 224, 186), width=3)

def font(size):
    for path in ('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',
                 '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'):
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()

f_title = font(58)
f_sub = font(27)
f_meta = font(20)

d.text((120, 505), "Emerald Spa & Wellness Centre", font=f_title, fill=(247, 245, 241))
d.text((122, 572), "Quiet luxury in the heart of Windhoek West  •  Rated 4.8 from 228 reviews", font=f_sub, fill=(191, 232, 213))
d.text((122, 606), "7 Blackett Street, Windhoek West  •  +264 85 607 7143", font=f_meta, fill=(148, 190, 170))
card.save('/home/user/repo/public/og-image.png', 'PNG', optimize=True)
print("og-image.png:", os.path.getsize('/home/user/repo/public/og-image.png') // 1024, "KB")
