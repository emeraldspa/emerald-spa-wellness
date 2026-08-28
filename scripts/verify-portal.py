"""Verify the admin.emeraldspacc.com portal with Scrapling, per its documented API.

Two fetchers, on purpose:

  Fetcher / FetcherSession  - curl_cffi backed, impersonates a real Chrome TLS
                              fingerprint. This is what tells us what the CDN
                              hands a plain visitor.
  DynamicFetcher            - real Playwright Chromium. This proves the page
                              actually renders and the slideshow script runs,
                              which an HTTP fetch alone cannot show.

Docs: https://github.com/D4Vinci/Scrapling
"""

from scrapling.fetchers import Fetcher, FetcherSession, DynamicFetcher
import time

URL = "https://admin.emeraldspacc.com/"
BUST = f"{URL}?v={int(time.time())}"

PASS, FAIL, WARN = "PASS", "FAIL", "WARN"


def line(status, label, detail=""):
    print(f"  [{status}] {label}" + (f" - {detail}" if detail else ""))


def check_markers(page, label):
    """A Scrapling response IS a Selector, so page.css works directly."""
    portal = page.css(".emx-portal")
    slides = page.css(".emx-slide")
    logo = page.css(".emx-logo::attr(src)").get() or ""
    title = (page.css("title::text").get() or "").strip()
    quote = (page.css(".emx-quote blockquote::text").get() or "").strip()
    notice = (page.css(".emx-notice p strong::text").get() or "").strip()
    public = page.css('a[href*="emeraldspacc.com"]::attr(href)').getall()

    print(f"\n{label}")
    line(PASS if portal else FAIL, "portal present", f"{len(portal)} root node(s)")
    line(PASS if len(slides) == 6 else FAIL, "slideshow", f"{len(slides)} slides")
    line(PASS if "lockup-stacked-dark" in logo else FAIL, "logo", logo.rsplit("/", 1)[-1] or "none")
    line(PASS if quote else FAIL, "quote", quote)
    line(PASS if notice.startswith("Restricted") else FAIL, "legal notice", notice)
    line(PASS if any("//emeraldspacc.com" in h for h in public) else FAIL,
         "links to public site")
    print(f"        title: {title}")
    return bool(portal) and len(slides) == 6


print("=" * 66)
print("SCRAPLING VERIFICATION - admin.emeraldspacc.com")
print("=" * 66)

# 1. What a plain visitor gets, no cache buster, real Chrome fingerprint.
with FetcherSession(impersonate="chrome", stealthy_headers=True) as s:
    bare = s.get(URL)
    fresh = s.get(BUST)

print(f"\n--- HTTP status: bare {bare.status} | cache-busted {fresh.status} ---")

bare_hdr = {k.lower(): v for k, v in bare.headers.items()}
fresh_hdr = {k.lower(): v for k, v in fresh.headers.items()}
print(f"bare   cache-control: {bare_hdr.get('cache-control')}")
print(f"bare   hcdn-status  : {bare_hdr.get('x-hcdn-cache-status')}  age={bare_hdr.get('age')}")
print(f"fresh  cache-control: {fresh_hdr.get('cache-control')}")
print(f"fresh  hcdn-status  : {fresh_hdr.get('x-hcdn-cache-status')}  age={fresh_hdr.get('age')}")

bare_ok = check_markers(bare, "BARE URL (what an edge-cached visitor sees)")
fresh_ok = check_markers(fresh, "ORIGIN (cache bypassed)")

# 2. Prove it renders and the slideshow actually cycles, in a real browser.
print("\nDYNAMIC RENDER (Playwright Chromium via DynamicFetcher)")
page = DynamicFetcher.fetch(BUST, headless=True, network_idle=True)
line(PASS if page.status == 200 else FAIL, "loaded", str(page.status))
line(PASS if page.css(".emx-portal") else FAIL, "portal rendered")
line(PASS if len(page.css(".emx-slide")) == 6 else FAIL,
     "slides in DOM", str(len(page.css(".emx-slide"))))
active = page.css(".emx-slide.is-on")
line(PASS if len(active) == 1 else FAIL, "exactly one active slide", str(len(active)))

# 3. Every photograph and the logo must actually resolve.
print("\nASSET REACHABILITY")
# Slide photographs live in inline background-image styles, the logo in src.
imgs = []
for st in page.css(".emx-slide::attr(style)").getall():
    if "url('" in st:
        imgs.append(st.split("url('", 1)[1].split("'", 1)[0])
logo_src = page.css(".emx-logo::attr(src)").get()
if logo_src:
    imgs.append(logo_src)
seen, bad = [], 0
for u in imgs:
    if u in seen:
        continue
    seen.append(u)
    r = Fetcher.get(u)
    if r.status != 200:
        bad += 1
    print(f"  [{PASS if r.status == 200 else FAIL}] {r.status}  {u.rsplit('/', 1)[-1]}")
line(PASS if seen and bad == 0 else FAIL, "all assets 200", f"{len(seen)} files, {bad} bad")

print("\n" + "=" * 66)
print(f"ORIGIN SERVES THE PORTAL : {'YES' if fresh_ok else 'NO'}")
print(f"BARE URL SERVES PORTAL   : {'YES' if bare_ok else 'NO (stale edge cache)'}")
print("=" * 66)
