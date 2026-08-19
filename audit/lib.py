"""Shared audit harness: state updates, evidence recording, page fetching.

Every finding must carry evidence that can be re-checked later, so findings are
written to disk as JSON alongside the raw response or screenshot they came from.
"""

import json
import pathlib
import subprocess
import time
from datetime import datetime, timezone

ROOT = pathlib.Path("/home/user/audit")
STATE = ROOT / "state.json"
EV = ROOT / "evidence"
SHOTS = ROOT / "shots"
REPORTS = ROOT / "reports"
for d in (EV, SHOTS, REPORTS):
    d.mkdir(parents=True, exist_ok=True)

WP = "https://admin.emeraldspacc.com"
APP = "https://emerald-spa-wellness.vercel.app"

SEVERITIES = ("critical", "high", "medium", "low")


# ---------- state ----------

def _load():
    return json.loads(STATE.read_text())


def _save(s):
    tmp = STATE.with_suffix(".tmp")
    tmp.write_text(json.dumps(s, indent=1))
    tmp.replace(STATE)


def log(msg):
    s = _load()
    ts = datetime.now(timezone.utc).strftime("%H:%M:%S")
    s.setdefault("log", []).append(f"<b>{ts}</b> {msg}")
    _save(s)
    print(f"[{ts}] {msg}", flush=True)


def phase(p, note=""):
    s = _load()
    s["phase"] = p
    if note:
        s["note"] = note
    _save(s)


def set_cat(cid, **kw):
    s = _load()
    for c in s["categories"]:
        if c["id"] == cid:
            c.update(kw)
    _save(s)


def tally(cid, findings):
    counts = {k: 0 for k in SEVERITIES}
    for f in findings:
        sev = f.get("severity", "low")
        if sev in counts:
            counts[sev] += 1
    set_cat(cid, **counts)
    return counts


# ---------- evidence ----------

def save_finding(cid, findings, round_no):
    p = EV / f"{cid}-r{round_no}.json"
    p.write_text(json.dumps(findings, indent=1))
    return p


def load_findings(cid, round_no):
    p = EV / f"{cid}-r{round_no}.json"
    return json.loads(p.read_text()) if p.exists() else []


def finding(fid, title, severity, standard, evidence, fix, where):
    """A finding is only useful if it names the clause it violates and the fix."""
    assert severity in SEVERITIES, severity
    return {
        "id": fid, "title": title, "severity": severity, "standard": standard,
        "evidence": evidence, "fix": fix, "where": where,
    }


# ---------- standards lookup ----------

def wcag(num):
    d = json.loads((ROOT / "standards/wcag21_aa.json").read_text())
    v = d.get(num)
    return f"WCAG 2.1 SC {num} {v['title']} (Level {v['level']})" if v else f"WCAG 2.1 SC {num}"


def asvs(shortcode):
    d = json.loads((ROOT / "standards/asvs_flat.json").read_text())
    for r in d:
        if r["id"] == shortcode:
            return f"OWASP ASVS 4.0.3 {shortcode}: {r['text'][:150]}"
    return f"OWASP ASVS 4.0.3 {shortcode}"


# ---------- fetching ----------

def scrapling_get(url, bust=True):
    """Fetch with a real Chrome TLS fingerprint. Returns the Scrapling page.

    Cache-busting matters on the WordPress host, whose CDN serves stale HTML.
    Never use `s` as the buster key: it is WordPress's reserved search param.
    """
    from scrapling.fetchers import Fetcher
    u = url
    if bust:
        u += ("&" if "?" in url else "?") + f"cb={int(time.time()*1000)}"
    return Fetcher.get(u, stealthy_headers=True)


def node(script, timeout=900):
    """Run a Playwright script from /home/user/web so node_modules resolves."""
    r = subprocess.run(["node", script], cwd="/home/user/web",
                       capture_output=True, text=True, timeout=timeout)
    return r.returncode, r.stdout, r.stderr
