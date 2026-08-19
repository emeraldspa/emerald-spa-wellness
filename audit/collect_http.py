"""HTTP-layer evidence via Scrapling, for what a browser cannot show.

Security headers, redirect behaviour, robots.txt and sitemap.xml, TLS reachability
and the raw bytes of every internal link are gathered here with a real Chrome
TLS fingerprint, so the security and links auditors judge the same traffic a
visitor's browser would generate.
"""

import json
import pathlib
import re
import time

from scrapling.fetchers import Fetcher

OUT = pathlib.Path("/home/user/audit/evidence")
APP = "https://emerald-spa-wellness.vercel.app"
WP = "https://admin.emeraldspacc.com"

APP_ROUTES = ["/", "/services", "/gallery", "/visit", "/team", "/vouchers",
              "/book", "/brand", "/sitemap", "/privacy", "/terms", "/whatsapp"]

SEC_HEADERS = [
    "content-security-policy", "strict-transport-security", "x-content-type-options",
    "x-frame-options", "referrer-policy", "permissions-policy", "content-type",
    "cross-origin-opener-policy", "cross-origin-resource-policy",
    "x-xss-protection", "cache-control", "set-cookie", "server", "x-powered-by",
]


def grab(url, bust=False):
    u = url + (("&" if "?" in url else "?") + f"cb={int(time.time()*1000)}" if bust else "")
    try:
        # Do not follow redirects: the hop's own headers are what we are judging.
        r = Fetcher.get(u, stealthy_headers=True, timeout=45, follow_redirects=False)
    except Exception as e:
        return {"url": url, "error": str(e)[:200]}
    h = {k.lower(): v for k, v in r.headers.items()}
    return {
        "url": url,
        "status": r.status,
        "headers": {k: h.get(k) for k in SEC_HEADERS},
        "all_header_names": sorted(h.keys()),
        "bytes": len(r.body or b""),
        "html_head": str(r)[:1500] if r.status == 200 else "",
    }


data = {"when": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "app": {}, "wp": {}}

print("APP pages")
for route in APP_ROUTES:
    d = grab(APP + route)
    data["app"][route] = d
    print(f"  {route:12s} {d.get('status')} csp={'Y' if d.get('headers',{}).get('content-security-policy') else 'N'} "
          f"hsts={'Y' if d.get('headers',{}).get('strict-transport-security') else 'N'}")

print("WP")
for route in ["/", "/wp-login.php", "/wp-admin/", "/wp-json/", "/portal/"]:
    d = grab(WP + route, bust=(route == "/"))
    data["wp"][route] = d
    print(f"  {route:14s} {d.get('status')}")

# robots.txt and sitemap.xml on both hosts
print("robots and sitemaps")
for label, base in (("app", APP), ("wp", WP)):
    for path in ("/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/site.webmanifest"):
        try:
            r = Fetcher.get(base + path, stealthy_headers=True, timeout=30)
            # Non-HTML responses need the raw body; str() yields Scrapling's repr.
            raw = r.body
            if isinstance(raw, bytes):
                raw = raw.decode("utf-8", "replace")
            body = raw[:4000] if r.status == 200 else ""
            data.setdefault(label + "_files", {})[path] = {"status": r.status, "body": body}
            print(f"  {label:3s} {path:22s} {r.status} {len(body)}b")
        except Exception as e:
            data.setdefault(label + "_files", {})[path] = {"error": str(e)[:120]}

# HTTP to HTTPS upgrade and apex behaviour
print("transport")
for label, url in (("app_http", "http://emerald-spa-wellness.vercel.app/"),
                   ("wp_http", "http://admin.emeraldspacc.com/")):
    try:
        r = Fetcher.get(url, stealthy_headers=True, timeout=30, follow_redirects=True)
        data.setdefault("transport", {})[label] = {
            "final_url": str(r.url), "status": r.status,
            "upgraded": str(r.url).startswith("https://"),
        }
        print(f"  {label:9s} -> {r.status} {str(r.url)[:60]}")
    except Exception as e:
        data.setdefault("transport", {})[label] = {"error": str(e)[:160]}
        print(f"  {label:9s} error {str(e)[:80]}")

(OUT / "http.json").write_text(json.dumps(data, indent=1))
print(f"\nwritten http.json")
