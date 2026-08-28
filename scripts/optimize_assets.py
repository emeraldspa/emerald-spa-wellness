"""Optimize every asset in public/ :
- hero videos: re-encode h264 crf 30 (faststart, same resolution)
- ambience audio: 48kHz mono aac 64kbps
- JPGs > 220KB: progressive q80
- WebPs > 220KB: regenerate from JPG source at q72
- AVIFs > 220KB: regenerate from JPG source at q55
- large PNGs: quantize/compress
Prints before/after per file.
"""
import os, re, subprocess, sys, shutil
from PIL import Image
import imageio_ffmpeg

ROOT = '/home/user/repo/public'
TMP = '/home/user/repo/.asset_tmp'
os.makedirs(TMP, exist_ok=True)
FF = imageio_ffmpeg.get_ffmpeg_exe()
log = []

def size(p): return os.path.getsize(p)

def human(n):
    return f"{n/1024:.0f} KB" if n < 1024*1024 else f"{n/1024/1024:.2f} MB"

# ---------- videos ----------
def transcode(src, dst, extra, crf=30):
    cmd = [FF, '-y', '-i', src, '-c:v', 'libx264', '-crf', str(crf), '-preset', 'slow',
           '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an'] + extra + [dst]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FFMPEG FAIL", src, r.stderr[-400:]); return
    a, b = size(src), size(dst)
    log.append((src, a, b))

transcode(f'{ROOT}/media/hero-desktop.mp4', TMP + '/hero-desktop-new.mp4', [])
transcode(f'{ROOT}/media/hero-mobile.mp4', TMP + '/hero-mobile-new.mp4', [])
for f in ('hero-desktop', 'hero-mobile'):
    src = f'{ROOT}/media/{f}.mp4'; tmp = f'{TMP}/{f}-new.mp4'
    if os.path.exists(tmp):
        shutil.move(tmp, src)

# audio: 28s ambience, 96kHz stereo aac -> 48kHz mono aac 64k
cmd = [FF, '-y', '-i', f'{ROOT}/media/ambience.m4a', '-c:a', 'aac', '-b:a', '64k',
       '-ar', '48000', '-ac', '1', TMP + '/ambience-new.m4a']
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode == 0 and os.path.exists(TMP + '/ambience-new.m4a'):
    a, b = size(f'{ROOT}/media/ambience.m4a'), size(TMP + '/ambience-new.m4a')
    log.append((f'{ROOT}/media/ambience.m4a', a, b))
    os.replace(TMP + '/ambience-new.m4a', f'{ROOT}/media/ambience.m4a')

# ---------- images ----------
def img_src_for(webp_or_avif_path):
    """Find the jpg/png source for a derived image by stem."""
    base = os.path.splitext(webp_or_avif_path)[0]            # .../hanging-chair-1600
    stem = base.rsplit('-', 1)[0]                            # hanging-chair
    for ext in ('.jpg', '.jpeg', '.png'):
        cand = stem + ext
        if os.path.exists(cand):
            return cand
    # try full base name as source (e.g. lockup png -> same-name .png)
    for ext in ('.png', '.jpg'):
        cand = base + ext
        if os.path.exists(cand):
            return cand
    return None

def optimize_image(path, fmt):
    before = size(path)
    if fmt == 'jpg':
        im = Image.open(path)
        if im.mode in ('RGBA', 'P'): im = im.convert('RGB')
        im.save(TMP + '/opt.jpg', 'JPEG', quality=80, optimize=True, progressive=True)
        after = size(TMP + '/opt.jpg')
        if after < before:
            os.replace(TMP + '/opt.jpg', path); log.append((path, before, after))
        else:
            os.remove(TMP + '/opt.jpg'); log.append((path, before, before))
    elif fmt == 'webp':
        src = img_src_for(path)
        if not src: return
        im = Image.open(src)
        if im.mode in ('RGBA', 'P'): im = im.convert('RGBA')
        im.save(TMP + '/opt.webp', 'WEBP', quality=72, method=6)
        after = size(TMP + '/opt.webp')
        if after < before:
            os.replace(TMP + '/opt.webp', path); log.append((path, before, after))
        else:
            os.remove(TMP + '/opt.webp'); log.append((path, before, before))
    elif fmt == 'avif':
        src = img_src_for(path)
        if not src: return
        im = Image.open(src)
        if im.mode in ('RGBA', 'P'): im = im.convert('RGBA')
        im.save(TMP + '/opt.avif', 'AVIF', quality=55, speed=6)
        after = size(TMP + '/opt.avif')
        if after < before:
            os.replace(TMP + '/opt.avif', path); log.append((path, before, after))
        else:
            os.remove(TMP + '/opt.avif'); log.append((path, before, before))
    elif fmt == 'png':
        im = Image.open(path)
        if im.mode in ('RGB',):
            im = im.convert('P', palette=Image.ADAPTIVE, colors=256)
            im.save(TMP + '/opt.png', 'PNG', optimize=True)
        elif im.mode in ('RGBA', 'LA'):
            im.save(TMP + '/opt.png', 'PNG', optimize=True)
        else:
            im.save(TMP + '/opt.png', 'PNG', optimize=True)
        after = size(TMP + '/opt.png')
        if after < before:
            os.replace(TMP + '/opt.png', path); log.append((path, before, after))
        else:
            os.remove(TMP + '/opt.png'); log.append((path, before, before))

for dirpath, _, files in os.walk(ROOT):
    for f in files:
        p = os.path.join(dirpath, f)
        try:
            sz = size(p)
            if f.lower().endswith('.jpg') and sz > 220_000:
                optimize_image(p, 'jpg')
            elif f.lower().endswith('.webp') and sz > 220_000:
                optimize_image(p, 'webp')
            elif f.lower().endswith('.avif') and sz > 220_000:
                optimize_image(p, 'avif')
            elif f.lower().endswith('.png') and sz > 80_000:
                optimize_image(p, 'png')
        except Exception as e:
            print("ERR", p, str(e)[:80])

# ---------- summary ----------
total_before = total_after = 0
print(f"\n{'file':64s} {'before':>10s} {'after':>10s} {'saved':>8s}")
for path, b, a in log:
    total_before += b; total_after += a
    print(f"{path.replace(ROOT+'/',''):64s} {human(b):>10s} {human(a):>10s} {human(b-a):>8s}")
if total_before:
    print(f"\nTOTAL: {human(total_before)} -> {human(total_after)}  (saved {human(total_before-total_after)})")
