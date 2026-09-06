"""Round 18: remove the treatment-room asset everywhere (client: 'completely
out of the code base') and generate the missing venue-party-8-1600.jpg that
the group-spa-day house story needs for cards and OG previews."""
import json
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# 1. Drop the registry entry.
reg_path = 'src/data/images.json'
with open(reg_path) as f:
    reg = json.load(f)
removed = reg.pop('treatment-room', None)
assert removed, 'treatment-room missing from registry'
with open(reg_path, 'w') as f:
    json.dump(reg, f, indent=2)
    f.write('\n')
print('registry entry removed')

# 2. Delete every treatment-room file on disk.
deleted = []
for name in sorted(os.listdir('public/media')):
    if name.startswith('treatment-room'):
        os.remove(os.path.join('public/media', name))
        deleted.append(name)
print('deleted files:', deleted)

# 3. venue-party-8-1600.jpg from the kept original webp (JPEG for WhatsApp /
#    Facebook scrapers and the journal card regex, same pattern as the other
#    house-story sources).
src = Image.open('public/media/venue-party-8.webp').convert('RGB')
w, h = src.size
if w > 1600:
    src = src.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
src.save('public/media/venue-party-8-1600.jpg', 'JPEG', quality=85, optimize=True, progressive=True)
print('venue-party-8-1600.jpg written:', src.size, os.path.getsize('public/media/venue-party-8-1600.jpg'), 'bytes')

# 4. Sanity: no remaining references anywhere in src/.
import subprocess
out = subprocess.run(['grep', '-rn', 'treatment-room', 'src'], capture_output=True, text=True)
print('remaining src references:', repr(out.stdout.strip()))
