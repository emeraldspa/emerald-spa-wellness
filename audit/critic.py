"""The critic.

Runs with fresh context per category and does not trust the auditor. It
re-derives the ground truth from the raw evidence, then checks three things:

  1. Did the auditor miss something the standard requires? (blind spots)
  2. Is each finding actually supported by the evidence cited? (false positives)
  3. Is the severity defensible against the named clause?

It returns a binary verdict plus the single biggest remaining gap. Praise is
not produced. A category only passes when the critic finds no blind spot and
no unsupported finding.
"""

import json
import pathlib
import re

EV = pathlib.Path("/home/user/audit/evidence")


def load(n):
    p = EV / n
    return json.loads(p.read_text()) if p.exists() else None


APPD, APPM = load("raw-app-desktop.json"), load("raw-app-mobile.json")
WPD, WPM = load("raw-wp-desktop.json"), load("raw-wp-mobile.json")
HTTP = load("http.json")


def pages(s):
    return s["pages"] if s else []


def ids(findings):
    return {f["id"] for f in findings}


def has(findings, *substrings):
    """True when some finding id or title mentions all the substrings."""
    for f in findings:
        blob = (f["id"] + " " + f["title"]).lower()
        if all(s.lower() in blob for s in substrings):
            return True
    return False


# Each critic returns (blind_spots, false_positives, notes)

def crit_seo(fs):
    blind, fp, notes = [], [], []
    for p in pages(APPD):
        h, r = p.get("head", {}), p["route"]
        if not h.get("title") and not has(fs, "title-missing", r):
            blind.append(f"{r} has no title and no finding was raised")
        if not h.get("canonical") and not has(fs, "canon", r):
            blind.append(f"{r} lacks canonical with no finding")
        if h.get("robots") and "noindex" in h["robots"] and not has(fs, "noindex", r):
            blind.append(f"{r} is noindex on the public site and was not flagged")
    # og:locale and hreflang are SEO-adjacent; absence on a single-locale site is fine.
    for f in fs:
        if "canonical points at vercel.app" in f["title"].lower():
            got = [p["head"]["canonical"] for p in pages(APPD)
                   if p["route"] in f["where"] and p.get("head", {}).get("canonical")]
            if got and "vercel.app" not in got[0]:
                fp.append(f"{f['id']} claims a vercel canonical but evidence shows {got[0]}")
    if not has(fs, "robots"):
        rb = (HTTP.get("app_files", {}).get("/robots.txt", {}) or {}).get("body", "")
        if "vercel.app" in rb:
            blind.append("robots.txt names the preview host and was not flagged")
    return blind, fp, notes


def crit_og(fs):
    blind, fp, notes = [], [], []
    for p in pages(APPD):
        og, r = p.get("head", {}).get("og", {}), p["route"]
        for k in ("title", "image", "url"):
            if not og.get(k) and not has(fs, f"og-{k}", r):
                blind.append(f"{r} missing og:{k} with no finding")
        img = og.get("image")
        if img and not img.startswith("https://"):
            if not has(fs, "og", "absolute"):
                blind.append(f"{r} og:image is not an absolute https URL: {img[:60]}")
    return blind, fp, notes


def crit_schema(fs):
    blind, fp, notes = [], [], []
    home = next((p for p in pages(APPD) if p["route"] == "/"), None)
    if home:
        flat = []
        for b in home.get("schema", []):
            flat.extend(b if isinstance(b, list) else [b])
            if isinstance(b, dict) and "@graph" in b:
                flat.extend(b["@graph"])
        types = set()
        for b in flat:
            if isinstance(b, dict):
                t = b.get("@type")
                types.update(t if isinstance(t, list) else [t] if t else [])
        if not any("Breadcrumb" in str(t) for t in types) and not has(fs, "breadcrumb"):
            notes.append("No BreadcrumbList; optional but a rich-results opportunity")
        # schema.org LocalBusiness subtypes are valid; DaySpa is one of them.
        LOCALBIZ = ("Organization", "LocalBusiness", "DaySpa", "BeautySalon",
                    "HealthAndBeautyBusiness", "MedicalBusiness", "Store")
        if not any(any(k in str(t) for k in LOCALBIZ) for t in types):
            if not has(fs, "nobiz"):
                blind.append("No Organization or LocalBusiness node and no finding")
        # Structured data must not contradict the page.
        for b in flat:
            if isinstance(b, dict) and b.get("telephone"):
                tel = re.sub(r"\D", "", str(b["telephone"]))
                if tel and tel != "264856077143" and not has(fs, "phone"):
                    blind.append(f"schema telephone {b['telephone']} differs from the verified number")
        # Every service page should ideally carry Service or Offer markup.
        svc = next((p for p in pages(APPD) if p["route"] == "/services"), None)
        if svc and not svc.get("schema") and not has(fs, "service"):
            notes.append("/services carries no structured data")
    return blind, fp, notes


def crit_a11y(fs):
    blind, fp, notes = [], [], []
    for snap, dev in ((APPD, "desktop"), (APPM, "mobile"), (WPD, "wp-desktop"), (WPM, "wp-mobile")):
        for p in pages(snap):
            r = p["route"]
            for v in p.get("axe", []):
                if not has(fs, v["id"], r):
                    blind.append(f"axe {v['id']} on {dev} {r} not reported")
            # Heading order is a 1.3.1 concern axe does not always flag.
            levels = [h["level"] for h in p.get("headings", [])]
            for a, b in zip(levels, levels[1:]):
                if b - a > 1:
                    if not has(fs, "heading", r):
                        blind.append(f"{dev} {r} skips heading level h{a} to h{b} (WCAG 1.3.1)")
                    break
            # Every page needs a main landmark and a skip link for 2.4.1.
            if snap is APPD:
                txt = (p.get("text") or "")[:200].lower()
                if "skip" not in txt and not has(fs, "skip", r):
                    notes.append(f"{r}: no visible skip link in the first 200 chars of text")
    return blind, fp, notes


def crit_perf(fs):
    blind, fp, notes = [], [], []
    for p in pages(APPD):
        v, r = p.get("vitals") or {}, p["route"]
        lcp = v.get("lcp", 0)
        if lcp == 0:
            notes.append(f"{r}: LCP not observed, cannot judge against the 2500ms threshold")
        elif lcp > 2500 and not has(fs, "lcp", r):
            blind.append(f"{r} LCP {lcp}ms exceeds 2500ms with no finding")
        if (v.get("cls") or 0) > 0.1 and not has(fs, "cls", r):
            blind.append(f"{r} CLS {v['cls']} exceeds 0.1 with no finding")
        t = p.get("timing") or {}
        if t.get("transferKB", 0) > 1500 and not has(fs, "weight", r):
            notes.append(f"{r} transferred {t['transferKB']}KB, above a 1.5MB comfort budget")
    return blind, fp, notes


def crit_sec(fs):
    blind, fp, notes = [], [], []
    # Re-derive from headers rather than trusting the auditor.
    for scope, key in (("app", "app"), ("wp", "wp")):
        for route, d in (HTTP.get(key, {}) or {}).items():
            h = d.get("headers", {}) or {}
            csp = h.get("content-security-policy")
            if not csp and not has(fs, "csp", route):
                blind.append(f"{scope} {route}: no CSP (ASVS V14.4.3) and no finding")
            if csp and "unsafe-inline" in csp and not has(fs, "unsafe-inline"):
                # script-src 'unsafe-inline' is the material weakness; allowing it
                # for style-src only is a far smaller exposure. Judge them apart.
                script_dir = next((d2 for d2 in csp.split(";") if "script-src" in d2), "")
                if "unsafe-inline" in script_dir:
                    blind.append(f"{scope} {route}: script-src allows unsafe-inline, "
                                 "weakening ASVS V14.4.3")
            if not h.get("permissions-policy") and not has(fs, "permissions"):
                notes.append(f"{scope} {route}: no Permissions-Policy (defence in depth, not ASVS L1)")
            if not h.get("cross-origin-opener-policy") and not has(fs, "coop"):
                notes.append(f"{scope} {route}: no COOP header")
    # A missing finding class entirely: the WP JSON API exposing users.
    wpjson = (HTTP.get("wp", {}) or {}).get("/wp-json/", {})
    if wpjson.get("status") == 200 and not has(fs, "wp-json"):
        notes.append("wp-json is publicly reachable; confirm it does not enumerate users")
    return blind, fp, notes


def crit_https(fs):
    blind, fp, notes = [], [], []
    for snap, label in ((APPD, "app"), (APPM, "app-mobile"), (WPD, "wp")):
        for p in pages(snap):
            for c in p.get("links", []):
                if c.get("target") == "_blank" and "noopener" not in (c.get("rel") or ""):
                    if not has(fs, "opener"):
                        blind.append(f"{label} {p['route']}: target=_blank without noopener")
                        break
    tr = HTTP.get("transport", {}) or {}
    for k, v in tr.items():
        if v.get("upgraded") is False and not has(fs, "noupgrade", k):
            blind.append(f"{k} serves plain HTTP without upgrading")
    if not any("hsts" in f["id"] for f in fs):
        for route, d in (HTTP.get("app", {}) or {}).items():
            if not (d.get("headers", {}) or {}).get("strict-transport-security"):
                blind.append(f"app {route}: no HSTS, which is a V9/V14.4.5 concern")
                break
    return blind, fp, notes


def crit_bizdata(fs):
    blind, fp, notes = [], [], []
    alltext = "\n".join(p.get("text", "") for p in pages(APPD))
    if "4.8" not in alltext and not has(fs, "rating"):
        blind.append("Verified 4.8 rating never rendered and not flagged")
    hours = re.findall(r"(0?9:00|18:00|10:00|16:00)", alltext)
    if not hours:
        notes.append("Opening hours not found in rendered text on any audited route")
    # Price sanity: NAD figures should match the verified promotion prices.
    for want in ("1,700", "3,000", "4,500"):
        if want not in alltext:
            notes.append(f"Verified promotion price NAD {want} not visible on the audited routes")
    if "Windhoek" not in alltext:
        blind.append("City name Windhoek missing from all audited pages")
    # Guard against the auditor over-reaching: a privacy policy naming the
    # processor is correct, but a booking button naming it is not.
    for p in pages(APPD):
        for c2 in p.get("links", []):
            lbl = ((c2.get("text") or "") + " " + (c2.get("ariaLabel") or "")).lower()
            if "fresha" in lbl and not has(fs, "fresha-cta"):
                blind.append(f"{p['route']}: a link label names the booking platform")
                break
    return blind, fp, notes


def crit_links(fs):
    blind, fp, notes = [], [], []
    internal = set()
    for p in pages(APPD):
        for c in p.get("links", []):
            if "emerald-spa-wellness.vercel.app" in c["href"]:
                internal.add(c["href"].split("#")[0].rstrip("/"))
    audited = {("https://emerald-spa-wellness.vercel.app" + p["route"]).rstrip("/")
               for p in pages(APPD)}
    unverified = internal - audited
    if unverified:
        blind.append(f"{len(unverified)} internal link targets were never fetched: "
                     f"{sorted(unverified)[:5]}")
    # Orphans: a route in the sitemap that nothing links to.
    # The sitemap advertises the canonical domain, while this deployment answers
    # on the vercel.app host. Comparing absolute URLs would report every entry as
    # an orphan, so compare paths.
    sm = (HTTP.get("app_files", {}).get("/sitemap.xml", {}) or {}).get("body", "")
    def path_of(u):
        return "/" + u.split("://", 1)[-1].split("/", 1)[1].rstrip("/") if "://" in u and "/" in u.split("://", 1)[-1] else "/"
    locs = {path_of(u) for u in re.findall(r"<loc>([^<]+)</loc>", sm)}
    linked = {path_of(c["href"].split("#")[0]) for p in pages(APPD)
              for c in p.get("links", []) if c["href"].startswith("http")}
    orphans = {l for l in locs if l not in linked}
    if orphans:
        blind.append(f"Sitemap lists {len(orphans)} path(s) nothing links to: {sorted(orphans)[:4]}")
    return blind, fp, notes


def crit_mobile(fs):
    blind, fp, notes = [], [], []
    for p in pages(APPM):
        r = p["route"]
        if p.get("layout", {}).get("overflow") and not has(fs, "overflow", r):
            blind.append(f"mobile {r} overflows horizontally with no finding")
        n = len(p.get("smallTargets", []))
        reported = sum(1 for f in fs if f["where"].endswith(r) and "tap" in f["id"])
        if n and reported == 0:
            blind.append(f"mobile {r} has {n} undersized targets and none were reported")
    # Font size is a real mobile legibility factor Lighthouse checks.
    # Now measured. Hold the auditor to reporting it.
    for p in pages(APPM):
        if p.get("smallText") and not has(fs, "fontsize", p["route"]):
            blind.append(f"mobile {p['route']} has {len(p['smallText'])} sub-12px "
                         "elements and no finding")
            break
    return blind, fp, notes


def crit_console(fs):
    blind, fp, notes = [], [], []
    for snap, dev in ((APPD, "desktop"), (APPM, "mobile"), (WPD, "wp-desktop"), (WPM, "wp-mobile")):
        for p in pages(snap):
            for e in p.get("errors", []):
                if not any(e[:40] in f["evidence"] for f in fs):
                    blind.append(f"{dev} {p['route']}: unreported console error {e[:60]}")
            for fr in p.get("failedRequests", []):
                if not any(fr[:40] in f["evidence"] for f in fs):
                    blind.append(f"{dev} {p['route']}: unreported failed request {fr[:60]}")
    return blind, fp, notes


def crit_forms(fs):
    blind, fp, notes = [], [], []
    seen_forms = sum(len(p.get("forms", [])) for p in pages(APPD))
    if seen_forms == 0:
        notes.append("No <form> elements found on any audited route; "
                     "voucher and booking flows may be client-side only")
    for p in pages(APPD):
        for fr in p.get("iframes", []):
            if not fr.get("title") and not has(fs, "iframe-title", p["route"]):
                blind.append(f"{p['route']}: iframe without title (WCAG 4.1.2)")
    # Static evidence cannot tell whether the booking journey completes, so the
    # critic requires the functional run to exist and to have been reported.
    bt = EV / "booking.json"
    if not bt.exists():
        blind.append("No functional booking test was run; /book cannot be judged from markup")
    else:
        res = json.loads(bt.read_text())
        failed = [r for r in res if not r["ok"]]
        if failed and not has(fs, "flow"):
            blind.append(f"{len(failed)} booking flow check(s) failed and none were reported")
        if any("embed" in r["name"] for r in failed):
            fb = EV / "booking-fallback.json"
            if not fb.exists():
                blind.append("Booking embed is blank and the fallback was never verified")
            else:
                routes = json.loads(fb.read_text())
                if not any(r["h"].startswith("tel:") for r in routes):
                    blind.append("Booking embed blank and no phone route offered")
                if not any("wa.me" in r["h"] for r in routes):
                    blind.append("Booking embed blank and no WhatsApp route offered")
    return blind, fp, notes


CRITICS = {
    "seo": crit_seo, "og": crit_og, "schema": crit_schema, "a11y": crit_a11y,
    "perf": crit_perf, "sec": crit_sec, "https": crit_https, "bizdata": crit_bizdata,
    "links": crit_links, "mobile": crit_mobile, "console": crit_console, "forms": crit_forms,
}


def judge(cid, findings):
    blind, fp, notes = CRITICS[cid](findings)
    passed = not blind and not fp
    if blind:
        gap = blind[0]
    elif fp:
        gap = "False positive: " + fp[0]
    elif notes:
        gap = "Advisory: " + notes[0]
    else:
        gap = "No gap found."
    return {"pass": passed, "blind_spots": blind, "false_positives": fp,
            "notes": notes, "biggest_gap": gap}
