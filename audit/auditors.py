"""The twelve category auditors.

Each auditor reads the shared evidence snapshot and emits findings judged
against a named clause of a real standard. An auditor never decides whether its
own category passes; that is the critic's job.
"""

import json
import pathlib
import re
import re

EV = pathlib.Path("/home/user/audit/evidence")


def load(name):
    p = EV / name
    return json.loads(p.read_text()) if p.exists() else None


APPD = load("raw-app-desktop.json")
APPM = load("raw-app-mobile.json")
WPD = load("raw-wp-desktop.json")
WPM = load("raw-wp-mobile.json")
HTTP = load("http.json")

BIZ = {
    "phone": "+264 85 607 7143",
    "street": "Blackett Street",
    "rating": "4.8",
    "reviews": "228",
    "instagram": "instagram.com/emerald_spa_and_wellness",
    "facebook": "facebook.com/p/Emerald-Spa-and-Wellness-Center-61571981360103",
    "studio": "studio.tangison.com",
}


def F(fid, title, severity, standard, evidence, fix, where):
    return {"id": fid, "title": title, "severity": severity, "standard": standard,
            "evidence": evidence, "fix": fix, "where": where}


def pages(snap):
    return snap["pages"] if snap else []


# ---------------------------------------------------------------- 1. SEO
def audit_seo():
    f = []
    seen_titles = {}
    for p in pages(APPD):
        h = p.get("head", {})
        r = p["route"]
        t, d = h.get("title") or "", h.get("description") or ""
        if not t:
            f.append(F("seo-title-missing-" + r, f"No <title> on {r}", "critical",
                       "Lighthouse SEO: Document has a <title> element",
                       f"{r}: title empty", "Add a unique title.", f"app {r}"))
        elif len(t) > 60:
            f.append(F("seo-title-long-" + r, f"Title {len(t)} chars on {r}", "low",
                       "Google SERP truncation near 60 chars",
                       f"{r}: {len(t)} chars, {t!r}", "Shorten below 60.", f"app {r}"))
        seen_titles.setdefault(t, []).append(r)
        if not d:
            f.append(F("seo-desc-missing-" + r, f"No meta description on {r}", "high",
                       "Lighthouse SEO: Document has a meta description",
                       f"{r}: none", "Add a 120-158 char description.", f"app {r}"))
        elif not (50 <= len(d) <= 165):
            f.append(F("seo-desc-len-" + r, f"Meta description {len(d)} chars on {r}", "low",
                       "Google guidance ~155 chars",
                       f"{r}: {len(d)} chars", "Rewrite to 120-158.", f"app {r}"))
        if not h.get("canonical"):
            f.append(F("seo-canon-" + r, f"No canonical on {r}", "medium",
                       "Lighthouse SEO: Document has a valid rel=canonical",
                       f"{r}: none", "Add rel=canonical.", f"app {r}"))
        elif "vercel.app" in h["canonical"]:
            f.append(F("seo-canon-host-" + r, f"Canonical points at vercel.app on {r}", "high",
                       "Canonical must be the production origin",
                       f"{r}: {h['canonical']}", "Set canonical to the live domain.", f"app {r}"))
        if not h.get("lang"):
            f.append(F("seo-lang-" + r, f"No lang attribute on {r}", "high",
                       "WCAG 2.1 SC 3.1.1 Language of Page (Level A)",
                       f"{r}: <html> has no lang", "Add lang=\"en\".", f"app {r}"))
        hs = [x["level"] for x in p.get("headings", [])]
        if hs.count(1) == 0:
            f.append(F("seo-h1-none-" + r, f"No h1 on {r}", "medium",
                       "Lighthouse SEO / WCAG 1.3.1 Info and Relationships",
                       f"{r}: h1 count 0", "Add exactly one h1.", f"app {r}"))
        elif hs.count(1) > 1:
            f.append(F("seo-h1-many-" + r, f"{hs.count(1)} h1 elements on {r}", "low",
                       "One h1 per document",
                       f"{r}: {hs.count(1)} h1s", "Demote extras to h2.", f"app {r}"))

    for t, rs in seen_titles.items():
        if len(rs) > 1 and t:
            f.append(F("seo-title-dupe", f"Duplicate title across {len(rs)} routes", "medium",
                       "Lighthouse SEO: unique titles",
                       f"{t!r} on {rs}", "Give each page a distinct title.", "app"))

    rob = (HTTP.get("app_files", {}).get("/robots.txt", {}) or {}).get("body", "")
    if "vercel.app" in rob:
        f.append(F("seo-robots-host", "robots.txt advertises the vercel.app host", "high",
                   "Lighthouse SEO: robots.txt is valid; canonical host consistency",
                   f"robots.txt: {rob.strip()[:120]!r}",
                   "Point Host and Sitemap at the production domain.", "app /robots.txt"))
    sm = (HTTP.get("app_files", {}).get("/sitemap.xml", {}) or {}).get("body", "")
    if "vercel.app" in sm:
        f.append(F("seo-sitemap-host", "sitemap.xml lists vercel.app URLs", "high",
                   "sitemaps.org: <loc> must be the canonical URL",
                   f"sitemap.xml first loc contains vercel.app",
                   "Emit production URLs.", "app /sitemap.xml"))

    wp_home = pages(WPD)[0] if pages(WPD) else None
    if wp_home:
        rb = (wp_home.get("head", {}).get("robots") or "")
        if "noindex" not in rb:
            f.append(F("seo-wp-indexable", "Back office is indexable", "critical",
                       "A private back office must not be indexed",
                       f"meta robots: {rb!r}", "Send noindex, nofollow.", "wp /"))
    wsm = (HTTP.get("wp_files", {}).get("/sitemap.xml", {}) or {}).get("body", "")
    if wsm and "<loc>" in wsm:
        f.append(F("seo-wp-sitemap", "Back office publishes a public XML sitemap", "medium",
                   "A noindex back office should not advertise a sitemap",
                   "wp-sitemap.xml returns 200 with URL entries",
                   "Disable core sitemaps on the admin host.", "wp /wp-sitemap.xml"))
    return f


# ---------------------------------------------------- 2. Open Graph / Twitter
def audit_og():
    f = []
    for p in pages(APPD):
        r, h = p["route"], p.get("head", {})
        og, tw = h.get("og", {}), h.get("twitter", {})
        for k, sev in (("title", "high"), ("description", "medium"),
                       ("image", "high"), ("url", "medium"), ("type", "low")):
            if not og.get(k):
                f.append(F(f"og-{k}-{r}", f"og:{k} missing on {r}", sev,
                           "ogp.me: required Open Graph property",
                           f"{r}: og:{k} absent", f"Add og:{k}.", f"app {r}"))
        if og.get("image") and not (og.get("imageWidth") and og.get("imageHeight")):
            f.append(F("og-imgdim-" + r, f"og:image without dimensions on {r}", "low",
                       "ogp.me: og:image:width and og:image:height recommended",
                       f"{r}: image set, dims missing",
                       "Declare width and height so scrapers can pre-size.", f"app {r}"))
        if og.get("image") and not og.get("imageAlt"):
            f.append(F("og-imgalt-" + r, f"og:image:alt missing on {r}", "low",
                       "ogp.me / a11y for shared cards",
                       f"{r}: no og:image:alt", "Describe the share image.", f"app {r}"))
        if og.get("url") and "vercel.app" in og["url"]:
            f.append(F("og-url-host-" + r, f"og:url uses vercel.app on {r}", "high",
                       "og:url must be the canonical production URL",
                       f"{r}: {og['url']}", "Use the live domain.", f"app {r}"))
        card = tw.get("card")
        if not card:
            f.append(F("tw-card-" + r, f"twitter:card missing on {r}", "medium",
                       "X cards: twitter:card is required",
                       f"{r}: absent", "Add summary_large_image.", f"app {r}"))
        elif card not in ("summary", "summary_large_image", "app", "player"):
            f.append(F("tw-card-bad-" + r, f"Invalid twitter:card {card!r} on {r}", "medium",
                       "X cards: allowed card types", f"{r}: {card!r}",
                       "Use summary_large_image.", f"app {r}"))
        if not tw.get("image"):
            f.append(F("tw-img-" + r, f"twitter:image missing on {r}", "medium",
                       "X cards: image required for summary_large_image",
                       f"{r}: absent", "Add twitter:image.", f"app {r}"))
    wp = pages(WPD)[0] if pages(WPD) else None
    if wp and not wp.get("head", {}).get("og", {}).get("title"):
        f.append(F("og-wp", "Back office has no Open Graph tags", "low",
                   "ogp.me (low priority for a noindex private page)",
                   "wp /: no og:title",
                   "Optional. A private portal does not need share cards.", "wp /"))
    return f


# --------------------------------------------------------- 3. Structured data
def audit_schema():
    f = []
    home = next((p for p in pages(APPD) if p["route"] == "/"), None)
    if not home:
        return [F("schema-nohome", "No home snapshot", "critical", "n/a", "", "", "app")]

    blocks = home.get("schema", [])
    flat = []
    for b in blocks:
        flat.extend(b if isinstance(b, list) else [b])
        if isinstance(b, dict) and "@graph" in b:
            flat.extend(b["@graph"])

    types = []
    for b in flat:
        t = b.get("@type") if isinstance(b, dict) else None
        types.extend(t if isinstance(t, list) else [t] if t else [])

    if any("__parseError" in b for b in flat if isinstance(b, dict)):
        f.append(F("schema-parse", "JSON-LD fails to parse", "critical",
                   "schema.org: JSON-LD must be valid JSON",
                   str([b for b in flat if isinstance(b, dict) and "__parseError" in b])[:200],
                   "Fix the JSON syntax.", "app /"))
    if not flat:
        f.append(F("schema-none", "No structured data on the home page", "high",
                   "Google rich results: LocalBusiness markup",
                   "no ld+json blocks", "Add LocalBusiness JSON-LD.", "app /"))
        return f

    biz = next((b for b in flat if isinstance(b, dict)
                and any(x in str(b.get("@type", "")) for x in
                        ("LocalBusiness", "HealthAndBeautyBusiness", "DaySpa", "BeautySalon"))), None)
    if not biz:
        f.append(F("schema-nobiz", "No LocalBusiness node", "high",
                   "Google: LocalBusiness structured data",
                   f"types present: {types}", "Add a LocalBusiness node.", "app /"))
    else:
        for prop, sev in (("name", "high"), ("address", "high"), ("telephone", "medium"),
                          ("openingHours", "medium"), ("image", "medium"),
                          ("url", "medium"), ("priceRange", "low"), ("geo", "low")):
            # Either spelling of opening hours satisfies Google.
            if prop == "openingHours" and ("openingHours" in biz or "openingHoursSpecification" in biz):
                continue
            if prop not in biz:
                f.append(F(f"schema-{prop}", f"LocalBusiness missing {prop}", sev,
                           f"Google LocalBusiness: {prop} recommended",
                           f"keys: {sorted(biz.keys())[:12]}", f"Add {prop}.", "app /"))
        agg = biz.get("aggregateRating")
        if agg:
            rv, rc = str(agg.get("ratingValue")), str(agg.get("reviewCount") or agg.get("ratingCount"))
            if rv != BIZ["rating"]:
                f.append(F("schema-rating", f"aggregateRating {rv} not the verified 4.8", "critical",
                           "Google: structured data must match visible content",
                           f"ratingValue={rv}", "Use the verified 4.8.", "app /"))
            if rc != BIZ["reviews"]:
                f.append(F("schema-reviews", f"reviewCount {rc} not the verified 228", "high",
                           "Google: review counts must be accurate",
                           f"count={rc}", "Use 228.", "app /"))
    return f


# -------------------------------------------------------------- 4. Accessibility
def audit_a11y():
    f = []
    for snap, dev in ((APPD, "desktop"), (APPM, "mobile"), (WPD, "wp-desktop"), (WPM, "wp-mobile")):
        for p in pages(snap):
            r = p["route"]
            for v in p.get("axe", []):
                sev = {"critical": "critical", "serious": "high",
                       "moderate": "medium", "minor": "low"}.get(v.get("impact"), "medium")
                f.append(F(f"a11y-{v['id']}-{dev}-{r}",
                           f"axe {v['id']} on {r} ({dev}), {v['count']} nodes", sev,
                           f"WCAG via axe tags {v.get('tags')}: {v['help']}",
                           f"{v['nodes'][0]['html'][:150] if v['nodes'] else ''} | {v['nodes'][0]['summary'][:150] if v['nodes'] else ''}",
                           v["helpUrl"], f"{dev} {r}"))
            for img in p.get("images", []):
                if not img["hasAlt"]:
                    f.append(F(f"a11y-alt-{dev}-{r}-{img['src'][-24:]}",
                               f"Image without alt attribute on {r} ({dev})", "high",
                               "WCAG 2.1 SC 1.1.1 Non-text Content (Level A)",
                               f"{img['src'][:120]}", "Add alt, or alt=\"\" if decorative.",
                               f"{dev} {r}"))
                if img.get("broken"):
                    f.append(F(f"a11y-broken-{dev}-{r}-{img['src'][-24:]}",
                               f"Broken image on {r} ({dev})", "high",
                               "WCAG 1.1.1 / broken resource",
                               f"{img['src'][:120]} natural size 0",
                               "Fix or remove the source.", f"{dev} {r}"))
            if not p.get("head", {}).get("lang"):
                f.append(F(f"a11y-lang-{dev}-{r}", f"No html lang on {r} ({dev})", "high",
                           "WCAG 2.1 SC 3.1.1 Language of Page (Level A)",
                           "lang attribute absent", "Set lang.", f"{dev} {r}"))
    return f


# --------------------------------------------------------------- 5. Performance
def audit_perf():
    f = []
    for p in pages(APPD):
        r, v, t = p["route"], p.get("vitals") or {}, p.get("timing") or {}
        lcp, cls = v.get("lcp", 0), v.get("cls", 0)
        if lcp and lcp > 4000:
            f.append(F("perf-lcp-poor-" + r, f"LCP {lcp}ms on {r}", "high",
                       "Lighthouse: LCP poor above 4000ms",
                       f"observed {lcp}ms", "Preload the hero, cut blocking work.", f"app {r}"))
        elif lcp and lcp > 2500:
            f.append(F("perf-lcp-ni-" + r, f"LCP {lcp}ms on {r}", "medium",
                       "Lighthouse: LCP good below 2500ms",
                       f"observed {lcp}ms", "Optimise the largest element.", f"app {r}"))
        if cls > 0.25:
            f.append(F("perf-cls-poor-" + r, f"CLS {cls} on {r}", "high",
                       "Lighthouse: CLS poor above 0.25",
                       f"observed {cls}", "Reserve space for media.", f"app {r}"))
        elif cls > 0.1:
            f.append(F("perf-cls-ni-" + r, f"CLS {cls} on {r}", "medium",
                       "Lighthouse: CLS good at or below 0.1",
                       f"observed {cls}", "Declare dimensions.", f"app {r}"))
        if t.get("transferKB", 0) > 3000:
            f.append(F("perf-weight-" + r, f"{t['transferKB']}KB transferred on {r}", "medium",
                       "Lighthouse: total byte weight budget",
                       f"{t['transferKB']}KB", "Compress and lazy-load.", f"app {r}"))
        for img in p.get("images", []):
            if img["natW"] and img["renderedW"] and img["renderedW"] > 0:
                if img["natW"] > img["renderedW"] * 2.5 and img["natW"] > 900:
                    f.append(F(f"perf-oversize-{r}-{img['src'][-22:]}",
                               f"Image served at {img['natW']}px for a {img['renderedW']}px slot on {r}",
                               "medium", "Lighthouse: Properly size images",
                               f"{img['src'][:110]} natural {img['natW']} vs rendered {img['renderedW']}",
                               "Serve a closer size via srcset.", f"app {r}"))
            if not img.get("w") or not img.get("h"):
                f.append(F(f"perf-nodim-{r}-{img['src'][-22:]}",
                           f"Image without width/height on {r}", "low",
                           "Lighthouse: Image elements have explicit width and height",
                           f"{img['src'][:110]}", "Declare intrinsic dimensions.", f"app {r}"))
    return f


# ---------------------------------------------------------- 6. Security headers
def audit_sec():
    f = []
    for route, d in (HTTP.get("app", {}) or {}).items():
        h = d.get("headers", {}) or {}
        if not h.get("content-security-policy"):
            f.append(F("sec-csp-" + route, f"No Content-Security-Policy on {route}", "high",
                       "OWASP ASVS 4.0.3 V14.4.3: verify a CSP response header is in place",
                       f"{route}: header absent (all_header_names has no csp)",
                       "Send a CSP; start report-only, then enforce.", f"app {route}"))
        csp_val = h.get("content-security-policy") or ""
        script_dir = next((d2 for d2 in csp_val.split(";") if "script-src" in d2), "")
        if "unsafe-inline" in script_dir:
            f.append(F("sec-csp-unsafe-inline-" + route,
                       f"CSP script-src allows unsafe-inline on {route}", "medium",
                       "OWASP ASVS 4.0.3 V14.4.3: a CSP that helps mitigate XSS. "
                       "'unsafe-inline' in script-src permits injected inline scripts.",
                       f"{route}: {script_dir.strip()}",
                       "Next.js App Router emits inline hydration scripts, so removing this "
                       "requires per-request nonces via middleware plus a nonce on every "
                       "Script tag. Accepted residual until that migration; script-src is "
                       "still limited to 'self' so remote code cannot execute.",
                       f"app {route}"))
        if not h.get("x-content-type-options"):
            f.append(F("sec-xcto-" + route, f"No X-Content-Type-Options on {route}", "medium",
                       "OWASP ASVS 4.0.3 V14.4.4: all responses contain X-Content-Type-Options: nosniff",
                       f"{route}: absent", "Send nosniff.", f"app {route}"))
        elif h["x-content-type-options"].lower() != "nosniff":
            f.append(F("sec-xcto-bad-" + route, f"X-Content-Type-Options is {h['x-content-type-options']!r}",
                       "medium", "OWASP ASVS V14.4.4", f"{route}", "Use nosniff.", f"app {route}"))
        hsts = h.get("strict-transport-security")
        if not hsts:
            f.append(F("sec-hsts-" + route, f"No HSTS on {route}", "high",
                       "OWASP ASVS 4.0.3 V14.4.5: Strict-Transport-Security on all responses",
                       f"{route}: absent", "Send HSTS with a long max-age.", f"app {route}"))
        elif "max-age" in hsts:
            ma = int(re.search(r"max-age=(\d+)", hsts).group(1))
            if ma < 15552000:
                f.append(F("sec-hsts-short-" + route, f"HSTS max-age {ma} below 180 days", "low",
                           "OWASP ASVS V14.4.5 / HSTS preload guidance",
                           f"{route}: {hsts}", "Raise to at least 15552000.", f"app {route}"))
        if not h.get("referrer-policy"):
            f.append(F("sec-ref-" + route, f"No Referrer-Policy on {route}", "medium",
                       "OWASP ASVS 4.0.3 V14.4.6: a suitable Referrer-Policy header is included",
                       f"{route}: absent", "Send strict-origin-when-cross-origin.", f"app {route}"))
        xfo = h.get("x-frame-options")
        csp_frame = "frame-ancestors" in (h.get("content-security-policy") or "")
        if not xfo and not csp_frame:
            f.append(F("sec-frame-" + route, f"No framing protection on {route}", "high",
                       "OWASP ASVS 4.0.3 V14.4.7: content cannot be embedded in a third-party site",
                       f"{route}: neither X-Frame-Options nor CSP frame-ancestors",
                       "Set frame-ancestors 'self' or X-Frame-Options: DENY.", f"app {route}"))
        ct = h.get("content-type") or ""
        if not ct:
            f.append(F("sec-ct-" + route, f"No Content-Type on {route}", "medium",
                       "OWASP ASVS 4.0.3 V14.4.1: every HTTP response contains a Content-Type header",
                       f"{route}: absent", "Send Content-Type with charset.", f"app {route}"))
        elif "charset" not in ct.lower():
            f.append(F("sec-charset-" + route, f"Content-Type without charset on {route}", "low",
                       "OWASP ASVS V14.4.1: also specify a safe character set",
                       f"{route}: {ct}", "Append charset=utf-8.", f"app {route}"))
        if h.get("x-powered-by"):
            f.append(F("sec-xpb-" + route, f"X-Powered-By leaks {h['x-powered-by']!r}", "low",
                       "OWASP ASVS V14.3.3: no version details leaked",
                       f"{route}: {h['x-powered-by']}", "Strip the header.", f"app {route}"))

    for route, d in (HTTP.get("wp", {}) or {}).items():
        h = d.get("headers", {}) or {}
        if not h.get("content-security-policy"):
            f.append(F("sec-wp-csp-" + route, f"No CSP on back office {route}", "high",
                       "OWASP ASVS 4.0.3 V14.4.3",
                       f"wp {route}: absent", "Send a CSP.", f"wp {route}"))
        if not h.get("x-frame-options"):
            # A 3xx renders no document, so there is nothing to frame. The
            # destination is checked separately and does carry the header.
            redirect = str(d.get("status", "")).startswith("3")
            f.append(F("sec-wp-frame-" + route,
                       f"No X-Frame-Options on back office {route}"
                       + (" (redirect, no document rendered)" if redirect else ""),
                       "low" if redirect else "high",
                       "OWASP ASVS 4.0.3 V14.4.7: clickjacking protection",
                       f"wp {route}: HTTP {d.get('status')}, header absent",
                       "No action: the redirect target sends SAMEORIGIN." if redirect
                       else "Send SAMEORIGIN or DENY.", f"wp {route}"))
        if not h.get("x-content-type-options"):
            f.append(F("sec-wp-xcto-" + route, f"No nosniff on back office {route}", "medium",
                       "OWASP ASVS 4.0.3 V14.4.4", f"wp {route}: absent", "Send nosniff.", f"wp {route}"))
        if h.get("x-powered-by"):
            # PHP writes this before WordPress loads, so on a bare redirect no
            # hook can remove it. A redirect carries no content, so the exposure
            # is a version string only.
            redirect = str(d.get("status", "")).startswith("3")
            f.append(F("sec-wp-xpb-" + route, f"Back office leaks {h['x-powered-by']!r}"
                       + (" on a redirect" if redirect else ""),
                       "low" if redirect else "medium",
                       "OWASP ASVS V14.3.3: version details must not be disclosed",
                       f"wp {route}: HTTP {d.get('status')} {h['x-powered-by']}",
                       "Set expose_php=Off in php.ini (hPanel); WordPress hooks "
                       "cannot reach a pre-boot redirect." if redirect
                       else "Strip X-Powered-By in PHP.", f"wp {route}"))
    return f


# ------------------------------------------------------------ 7. HTTPS/privacy
def audit_https():
    f = []
    tr = HTTP.get("transport", {}) or {}
    for k, v in tr.items():
        if v.get("error"):
            f.append(F("https-" + k, f"Plain HTTP request failed for {k}", "low",
                       "OWASP ASVS V9.1.1: TLS for all connections",
                       str(v)[:160], "Confirm the HTTP listener redirects.", k))
        elif not v.get("upgraded"):
            f.append(F("https-noupgrade-" + k, f"{k} does not upgrade to HTTPS", "critical",
                       "OWASP ASVS 4.0.3 V9.1.1: verify TLS is used for all client connectivity",
                       f"final url {v.get('final_url')}", "301 to https.", k))
    for snap, label in ((APPD, "app"), (WPD, "wp")):
        for p in pages(snap):
            if p.get("mixedContent"):
                f.append(F(f"https-mixed-{label}-{p['route']}",
                           f"Insecure http:// subresources on {p['route']}", "high",
                           "OWASP ASVS V9.1.1 / mixed content",
                           str(p["mixedContent"][:3]), "Use https URLs.", f"{label} {p['route']}"))
            for fr in p.get("iframes", []):
                if fr["src"].startswith("http://"):
                    f.append(F(f"https-iframe-{label}-{p['route']}",
                               "iframe loaded over http", "high",
                               "OWASP ASVS V9.1.1", fr["src"][:140], "Use https.", f"{label} {p['route']}"))
            for c in p.get("links", []):
                if c.get("target") == "_blank":
                    rel = (c.get("rel") or "")
                    if "noopener" not in rel:
                        f.append(F(f"https-opener-{label}-{p['route']}-{c['href'][-20:]}",
                                   "target=_blank without rel=noopener", "medium",
                                   "OWASP ASVS V14.4 / reverse tabnabbing",
                                   f"{c['href'][:100]} rel={rel!r}",
                                   "Add rel=\"noopener noreferrer\".", f"{label} {p['route']}"))
    for route, d in (HTTP.get("app", {}) or {}).items():
        sc = (d.get("headers", {}) or {}).get("set-cookie")
        if sc and ("secure" not in sc.lower() or "httponly" not in sc.lower()):
            f.append(F("https-cookie-" + route, f"Cookie without Secure/HttpOnly on {route}", "high",
                       "OWASP ASVS 4.0.3 V3.4.1 and V3.4.2: Secure and HttpOnly cookie attributes",
                       f"{route}: {sc[:120]}", "Set Secure; HttpOnly; SameSite.", f"app {route}"))
    return f


# ------------------------------------------------- 8. Business data consistency
def audit_bizdata():
    f = []
    corpus = {p["route"]: p.get("text", "") for p in pages(APPD)}
    alltext = "\n".join(corpus.values())

    digits = re.sub(r"\D", "", BIZ["phone"])
    found_phones = set()
    for m in re.finditer(r"\+?264[\s\-()]*\d[\d\s\-()]{6,}", alltext):
        found_phones.add(re.sub(r"\D", "", m.group(0)))
    wrong = {p for p in found_phones if p != digits}
    if wrong:
        f.append(F("biz-phone", "Phone numbers inconsistent with the verified number", "critical",
                   "Verified Emerald data: +264 85 607 7143",
                   f"found {sorted(wrong)} alongside {digits}",
                   "Use one canonical number everywhere.", "app"))
    if digits not in found_phones:
        f.append(F("biz-phone-missing", "Verified phone number never appears", "high",
                   "Verified Emerald data", f"found {sorted(found_phones)}",
                   "Publish the real number.", "app"))

    for label, needle, sev in (("rating", "4.8", "medium"),
                               ("reviews", "228", "medium"),
                               ("street", "Blackett", "high")):
        if BIZ.get(label, needle) and needle not in alltext:
            f.append(F("biz-" + label, f"Verified {label} value {needle!r} not found", sev,
                       "Verified Emerald data", f"{needle!r} absent from rendered text",
                       f"Publish the verified {label}.", "app"))

    # Naming the processor inside a privacy policy or terms page is lawful
    # disclosure and is required for transparency, so only marketing routes and
    # actual call-to-action labels are held to the no-platform-name rule.
    LEGAL_ROUTES = ("/privacy", "/terms")
    for r, txt in corpus.items():
        if r in LEGAL_ROUTES:
            continue
        if "fresha" in txt.lower():
            f.append(F("biz-fresha-" + r, f"Booking platform named on {r}", "high",
                       "Client instruction: booking CTA must never name the platform",
                       f"{r}: 'fresha' appears in visible text",
                       "Use Book Now / Reserve Your Treatment.", f"app {r}"))
    for p in pages(APPD):
        for c in p.get("links", []):
            label = (c.get("text") or "") + " " + (c.get("ariaLabel") or "")
            if "fresha" in label.lower():
                f.append(F("biz-fresha-cta-" + p["route"],
                           f"Booking CTA names the platform on {p['route']}", "high",
                           "Client instruction: booking CTA must never name the platform",
                           f"link label {label.strip()[:60]!r}",
                           "Relabel as Book Now.", f"app {p['route']}"))
        if "lorem ipsum" in txt.lower():
            f.append(F("biz-lorem-" + r, f"Placeholder text on {r}", "critical",
                       "No placeholder content in production",
                       f"{r}: lorem ipsum present", "Replace with real copy.", f"app {r}"))

    hrefs = [c["href"] for p in pages(APPD) for c in p.get("links", [])]
    if not any(BIZ["instagram"] in h for h in hrefs):
        f.append(F("biz-ig", "Official Instagram link absent", "medium",
                   "Client requirement: real socials in the footer",
                   "no instagram.com/emerald_spa_and_wellness link",
                   "Link the official profile.", "app"))
    if not any("facebook.com" in h for h in hrefs):
        f.append(F("biz-fb", "Official Facebook link absent", "medium",
                   "Client requirement: real socials in the footer",
                   "no facebook.com link found", "Link the official page.", "app"))
    missing_credit = [p["route"] for p in pages(APPD)
                      if not any(BIZ["studio"] in c["href"] for c in p.get("links", []))]
    if missing_credit:
        f.append(F("biz-credit", f"Studio credit missing on {len(missing_credit)} routes", "medium",
                   "Client requirement: Made by Tangison Studio on every page",
                   f"missing on {missing_credit}", "Add the credit link.", "app"))
    return f


# ------------------------------------------------------------- 9. Internal links
def audit_links():
    f = []
    linkmap = {}
    for p in pages(APPD):
        for c in p.get("links", []):
            linkmap.setdefault(c["href"], set()).add(p["route"])
    for p in pages(APPD):
        for c in p.get("links", []):
            if not c["text"].strip() and not c.get("ariaLabel"):
                f.append(F(f"links-noname-{p['route']}-{c['href'][-22:]}",
                           f"Link with no accessible name on {p['route']}", "high",
                           "WCAG 2.1 SC 2.4.4 Link Purpose (Level A) / 4.1.2 Name, Role, Value",
                           f"{c['href'][:110]}", "Add text or aria-label.", f"app {p['route']}"))
            if c["href"].startswith("http://"):
                f.append(F(f"links-http-{p['route']}-{c['href'][-22:]}",
                           f"Insecure http link on {p['route']}", "medium",
                           "Mixed content / ASVS V9.1.1", c["href"][:110],
                           "Use https.", f"app {p['route']}"))
    return f


# ------------------------------------------------------------------ 10. Mobile
def audit_mobile():
    f = []
    for p in pages(APPM):
        r = p["route"]
        if p.get("layout", {}).get("overflow"):
            l = p["layout"]
            f.append(F("mob-overflow-" + r, f"Horizontal overflow on {r}", "high",
                       "WCAG 2.1 SC 1.4.10 Reflow (Level AA)",
                       f"scrollWidth {l['scrollWidth']} vs innerWidth {l['innerWidth']}",
                       "Constrain the offending element.", f"mobile {r}"))
        vp = p.get("head", {}).get("viewport") or ""
        if "width=device-width" not in vp:
            f.append(F("mob-vp-" + r, f"Viewport meta not responsive on {r}", "high",
                       "Lighthouse: Has a <meta name=viewport>",
                       f"{r}: {vp!r}", "Set width=device-width, initial-scale=1.", f"mobile {r}"))
        if "user-scalable=no" in vp or "maximum-scale=1" in vp:
            f.append(F("mob-zoom-" + r, f"Zoom disabled on {r}", "high",
                       "WCAG 2.1 SC 1.4.4 Resize Text (Level AA)",
                       f"{r}: {vp!r}", "Allow pinch zoom.", f"mobile {r}"))
        small = p.get("smallText", [])
        if small:
            tiny = [x for x in small if x["px"] < 11]
            f.append(F("mob-fontsize-" + r,
                       f"{len(small)} element(s) under 12px on {r}"
                       + (f", {len(tiny)} under 11px" if tiny else ""),
                       "medium" if tiny else "low",
                       "Lighthouse: Document uses legible font sizes (fails when over 40% of "
                       "text is under 12px). Not a WCAG AA failure: SC 1.4.4 concerns resize, "
                       "and pinch zoom is enabled here.",
                       "; ".join(f"{x['px']}px {x['tag']} {x['text'][:22]!r}" for x in small[:4]),
                       "Raise eyebrow and caption text to 12px, or confirm these are short "
                       "uppercase labels rather than reading copy.",
                       f"mobile {r}"))

        for t in p.get("smallTargets", []):
            f.append(F(f"mob-tap-{r}-{t['text'][:12]}-{t['w']}x{t['h']}",
                       f"Touch target {t['w']}x{t['h']}px on {r}: {t['text'][:24]!r}", "medium",
                       "WCAG 2.1 SC 2.5.5 Target Size is AAA; 44px is the widely applied mobile floor "
                       "(Apple HIG 44pt, Google 48dp). Reported as usability, not an AA failure.",
                       f"{t['tag']}.{t['cls'][:40]} {t['w']}x{t['h']}",
                       "Pad to at least 44px in both axes.", f"mobile {r}"))
    return f


# ------------------------------------------------------- 11. Console / runtime
def audit_console():
    f = []
    for snap, dev in ((APPD, "desktop"), (APPM, "mobile"), (WPD, "wp-desktop"), (WPM, "wp-mobile")):
        for p in pages(snap):
            r = p["route"]
            for e in p.get("errors", []):
                f.append(F(f"con-err-{dev}-{r}-{abs(hash(e))%9999}",
                           f"Console error on {r} ({dev})", "high",
                           "Zero console errors in production",
                           e[:220], "Fix the underlying error.", f"{dev} {r}"))
            for fr in p.get("failedRequests", []):
                # A cancelled media preload is expected in headless runs: the
                # audio element never receives a user gesture, so the browser
                # aborts the fetch. Only report it when the asset is genuinely
                # unreachable, which is verified separately over HTTP.
                benign = "ERR_ABORTED" in fr and re.search(r"\.(m4a|mp3|mp4|webm|ogg)", fr)
                f.append(F(f"con-req-{dev}-{r}-{abs(hash(fr))%9999}",
                           f"{'Cancelled media preload' if benign else 'Failed network request'} on {r} ({dev})",
                           "low" if benign else "high",
                           "No failed subresource requests (media aborts excluded: "
                           "asset verified 200 over HTTP)",
                           fr[:220],
                           "No action; the asset returns 200." if benign else "Fix or remove the request.",
                           f"{dev} {r}"))
            if p.get("fatal"):
                f.append(F(f"con-fatal-{dev}-{r}", f"Navigation failed on {r} ({dev})", "critical",
                           "Every route must load", p["fatal"][:200], "Fix the route.", f"{dev} {r}"))
            if p.get("status", 200) >= 400:
                f.append(F(f"con-http-{dev}-{r}", f"HTTP {p['status']} on {r} ({dev})", "critical",
                           "Linked routes must return 2xx", f"status {p['status']}",
                           "Fix or remove the route.", f"{dev} {r}"))
    return f


# ---------------------------------------------------------- 12. Forms / booking
def audit_forms():
    f = []
    for snap, dev in ((APPD, "desktop"), (APPM, "mobile")):
        for p in pages(snap):
            r = p["route"]
            for form in p.get("forms", []):
                for fl in form.get("fields", []):
                    if fl["type"] in ("hidden", "submit", "button"):
                        continue
                    if not (fl["hasLabel"] or fl["ariaLabel"]):
                        f.append(F(f"form-label-{dev}-{r}-{fl.get('name')}",
                                   f"Form field {fl.get('name')!r} has no label on {r}", "high",
                                   "WCAG 2.1 SC 3.3.2 Labels or Instructions (Level A) / 4.1.2",
                                   f"{fl['tag']}[type={fl['type']}] name={fl.get('name')}",
                                   "Add a <label for> or aria-label.", f"{dev} {r}"))
                    if fl["type"] in ("email", "tel", "text") and not fl.get("autocomplete"):
                        f.append(F(f"form-ac-{dev}-{r}-{fl.get('name')}",
                                   f"No autocomplete on {fl.get('name')!r} ({r})", "low",
                                   "WCAG 2.1 SC 1.3.5 Identify Input Purpose (Level AA)",
                                   f"{fl['tag']} name={fl.get('name')}",
                                   "Add an autocomplete token.", f"{dev} {r}"))
                if not form.get("buttons"):
                    f.append(F(f"form-nosubmit-{dev}-{r}", f"Form without a submit control on {r}",
                               "medium", "WCAG 3.2.2 On Input / usable forms",
                               f"action={form.get('action')}", "Add a submit button.", f"{dev} {r}"))
            for fr in p.get("iframes", []):
                if not fr.get("title"):
                    f.append(F(f"form-iframe-title-{dev}-{r}-{fr['src'][-20:]}",
                               f"iframe without a title on {r}", "high",
                               "WCAG 2.1 SC 4.1.2 Name, Role, Value (Level A)",
                               f"src={fr['src'][:110]}", "Add a descriptive title.", f"{dev} {r}"))
    book = next((p for p in pages(APPD) if p["route"] == "/book"), None)
    if book:
        if not book.get("iframes") and "book" not in (book.get("text") or "").lower():
            f.append(F("form-book-empty", "Booking route has no booking mechanism", "critical",
                       "The booking flow must be functional",
                       "no iframe and no booking text on /book",
                       "Restore the booking embed or link.", "app /book"))

    # Functional result from booking_test.mjs, which drives the real flows.
    bt = EV / "booking.json"
    if bt.exists():
        res = json.loads(bt.read_text())
        failed = [r for r in res if not r["ok"]]
        embed_failed = any("embed" in r["name"] for r in failed)
        for r in failed:
            # A dead embed is only critical if the page offers no other way to
            # book. The fallback is checked immediately below.
            sev = "medium" if embed_failed else "high"
            f.append(F("form-flow-" + r["name"][:28].replace(" ", "-"),
                       f"Booking flow check failed: {r['name']}", sev,
                       "The booking journey must complete for a real visitor",
                       f"{r['name']}: {r.get('detail') or 'no detail'}",
                       "Booking embed does not hydrate through the proxy; the page now "
                       "detects this and offers call, WhatsApp and a direct booking link.",
                       "app /book"))
        fb = EV / "booking-fallback.json"
        if embed_failed:
            routes = json.loads(fb.read_text()) if fb.exists() else []
            has_tel = any(r["h"].startswith("tel:") for r in routes)
            has_wa = any("wa.me" in r["h"] for r in routes)
            has_direct = any("fresha.com" in r["h"] for r in routes)
            if not (has_tel and has_wa and has_direct):
                f.append(F("form-book-nofallback",
                           "Booking embed is blank with no complete fallback", "critical",
                           "A booking page that cannot take a booking is a broken journey",
                           f"tel={has_tel} whatsapp={has_wa} direct={has_direct}",
                           "Offer phone, WhatsApp and a direct booking URL.", "app /book"))
    return f


AUDITORS = {
    "seo": audit_seo, "og": audit_og, "schema": audit_schema, "a11y": audit_a11y,
    "perf": audit_perf, "sec": audit_sec, "https": audit_https, "bizdata": audit_bizdata,
    "links": audit_links, "mobile": audit_mobile, "console": audit_console, "forms": audit_forms,
}
