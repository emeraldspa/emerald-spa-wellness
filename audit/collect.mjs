/**
 * Deep evidence collection for the Emerald audit.
 *
 * One pass per (site x device) that gathers everything the twelve category
 * auditors need, so findings are judged against a single consistent snapshot
 * rather than a dozen separate page loads that may disagree.
 *
 * Writes /home/user/audit/evidence/raw-<site>-<device>.json
 */
import { chromium, devices } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';

const SITES = {
  app: {
    base: 'https://emerald-spa-wellness.vercel.app',
    routes: ['/', '/services', '/gallery', '/visit', '/team', '/vouchers',
             '/book', '/brand', '/sitemap', '/privacy', '/terms', '/whatsapp'],
  },
  wp: {
    base: 'https://admin.emeraldspacc.com',
    routes: ['/'],
    bust: true,
  },
};

const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
  mobile: { ...devices['iPhone 13'] },
};

const site = process.argv[2];
const device = process.argv[3];
const cfg = SITES[site];
const dev = DEVICES[device];

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ ...dev, ignoreHTTPSErrors: false });
const out = { site, device, base: cfg.base, when: new Date().toISOString(), pages: [] };

for (const route of cfg.routes) {
  const url = cfg.base + route + (cfg.bust ? `?cb=${Date.now()}` : '');
  const page = await ctx.newPage();
  const errors = [];
  const failedReq = [];
  const consoleWarns = [];

  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 300));
    if (m.type() === 'warning') consoleWarns.push(m.text().slice(0, 200));
  });
  page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 300)));
  page.on('requestfailed', r => failedReq.push(`${r.failure()?.errorText} ${r.url().slice(0, 160)}`));

  const rec = { route, url };
  let resp;
  try {
    resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    rec.fatal = String(e).slice(0, 200);
    out.pages.push(rec);
    await page.close();
    continue;
  }

  rec.status = resp.status();
  rec.headers = resp.headers();
  rec.timing = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    if (!n) return null;
    return {
      ttfb: Math.round(n.responseStart),
      domContentLoaded: Math.round(n.domContentLoadedEventEnd),
      load: Math.round(n.loadEventEnd),
      transferKB: Math.round((n.transferSize || 0) / 1024),
    };
  });

  // Largest Contentful Paint and Cumulative Layout Shift, observed for real.
  rec.vitals = await page.evaluate(() => new Promise(res => {
    let lcp = 0, cls = 0;
    try {
      new PerformanceObserver(l => { for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime); })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(l => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) { /* older engines */ }
    setTimeout(() => res({ lcp: Math.round(lcp), cls: Math.round(cls * 1000) / 1000 }), 2500);
  }));

  // Scroll to trigger lazy loading, then settle.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);

  rec.head = await page.evaluate(() => {
    const meta = n => document.querySelector(`meta[name="${n}"]`)?.content || null;
    const prop = p => document.querySelector(`meta[property="${p}"]`)?.content || null;
    return {
      title: document.title,
      titleLen: document.title.length,
      description: meta('description'),
      descriptionLen: (meta('description') || '').length,
      robots: meta('robots'),
      viewport: meta('viewport'),
      themeColor: meta('theme-color'),
      canonical: document.querySelector('link[rel=canonical]')?.href || null,
      manifest: document.querySelector('link[rel=manifest]')?.href || null,
      favicon: document.querySelector('link[rel=icon]')?.href || null,
      lang: document.documentElement.lang || null,
      dir: document.documentElement.dir || null,
      charset: document.characterSet,
      og: {
        title: prop('og:title'), description: prop('og:description'),
        image: prop('og:image'), url: prop('og:url'), type: prop('og:type'),
        siteName: prop('og:site_name'), locale: prop('og:locale'),
        imageWidth: prop('og:image:width'), imageHeight: prop('og:image:height'),
        imageAlt: prop('og:image:alt'),
      },
      twitter: {
        card: meta('twitter:card'), title: meta('twitter:title'),
        description: meta('twitter:description'), image: meta('twitter:image'),
        site: meta('twitter:site'), imageAlt: meta('twitter:image:alt'),
      },
      hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')]
        .map(l => ({ lang: l.hreflang, href: l.href })),
    };
  });

  rec.schema = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => {
      try { return JSON.parse(s.textContent); } catch (e) { return { __parseError: String(e).slice(0, 120) }; }
    }));

  rec.headings = await page.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .map(h => ({ level: +h.tagName[1], text: h.textContent.trim().slice(0, 80) })));

  rec.images = await page.evaluate(() =>
    [...document.querySelectorAll('img')].map(i => ({
      src: (i.currentSrc || i.src || '').slice(0, 180),
      alt: i.getAttribute('alt'),
      hasAlt: i.hasAttribute('alt'),
      w: i.getAttribute('width'), h: i.getAttribute('height'),
      natW: i.naturalWidth, natH: i.naturalHeight,
      renderedW: Math.round(i.getBoundingClientRect().width),
      renderedH: Math.round(i.getBoundingClientRect().height),
      loading: i.getAttribute('loading'),
      decoding: i.getAttribute('decoding'),
      broken: i.complete && i.naturalWidth === 0,
    })));

  rec.links = await page.evaluate(() =>
    [...document.querySelectorAll('a')].map(a => ({
      href: a.href, text: a.textContent.trim().slice(0, 60),
      target: a.getAttribute('target'), rel: a.getAttribute('rel'),
      ariaLabel: a.getAttribute('aria-label'),
    })));

  rec.forms = await page.evaluate(() =>
    [...document.querySelectorAll('form')].map(f => ({
      action: f.getAttribute('action'), method: f.getAttribute('method'),
      novalidate: f.hasAttribute('novalidate'),
      fields: [...f.querySelectorAll('input,select,textarea')].map(el => {
        const id = el.id;
        const lab = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : el.closest('label');
        return {
          tag: el.tagName.toLowerCase(), type: el.type || null, name: el.name || null,
          required: el.required, autocomplete: el.getAttribute('autocomplete'),
          hasLabel: !!lab, labelText: lab ? lab.textContent.trim().slice(0, 40) : null,
          ariaLabel: el.getAttribute('aria-label'),
          ariaDescribedby: el.getAttribute('aria-describedby'),
          inputmode: el.getAttribute('inputmode'), pattern: el.getAttribute('pattern'),
        };
      }),
      buttons: [...f.querySelectorAll('button,input[type=submit]')]
        .map(b => ({ type: b.type, text: (b.textContent || b.value || '').trim().slice(0, 40) })),
    })));

  rec.iframes = await page.evaluate(() =>
    [...document.querySelectorAll('iframe')].map(f => ({
      src: (f.src || '').slice(0, 200), title: f.getAttribute('title'),
      sandbox: f.getAttribute('sandbox'), loading: f.getAttribute('loading'),
      w: Math.round(f.getBoundingClientRect().width),
      h: Math.round(f.getBoundingClientRect().height),
    })));

  // Touch targets, excluding anything genuinely hidden.
  rec.smallTargets = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('a,button,[role=button],input,select')) {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (!r.width || !r.height) continue;
      if (s.opacity === '0' || s.visibility === 'hidden' || s.display === 'none') continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (el.className && String(el.className).includes('sr-only')) continue;
      if (r.height < 44 || r.width < 44) {
        out.push({
          text: (el.textContent || '').trim().slice(0, 30),
          tag: el.tagName.toLowerCase(),
          w: Math.round(r.width), h: Math.round(r.height),
          cls: String(el.className || '').slice(0, 60),
        });
      }
    }
    return out;
  });

  // Lighthouse flags body text under 12px as illegible on mobile.
  rec.smallText = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('p,li,span,a,td,dd,dt,figcaption')) {
      if (!el.textContent.trim()) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const px = parseFloat(cs.fontSize);
      if (px && px < 12) {
        out.push({ px: Math.round(px * 10) / 10, tag: el.tagName.toLowerCase(),
                   text: el.textContent.trim().slice(0, 30) });
      }
    }
    return out.slice(0, 20);
  });

  rec.layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    docHeight: document.body.scrollHeight,
  }));

  rec.text = await page.evaluate(() => document.body.innerText.slice(0, 20000));

  rec.mixedContent = await page.evaluate(() =>
    [...document.querySelectorAll('[src],[href]')]
      .map(e => e.getAttribute('src') || e.getAttribute('href'))
      .filter(u => u && u.startsWith('http://')).slice(0, 20));

  rec.inlineHandlers = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('*')) {
      for (const a of el.attributes) if (a.name.startsWith('on')) n++;
    }
    return n;
  });

  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  rec.axe = axe.violations.map(v => ({
    id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
    tags: v.tags.filter(t => t.startsWith('wcag')),
    nodes: v.nodes.slice(0, 4).map(n => ({
      html: n.html.slice(0, 200), target: n.target.join(' '),
      summary: (n.failureSummary || '').slice(0, 260),
    })),
    count: v.nodes.length,
  }));
  rec.axePasses = axe.passes.length;
  rec.axeIncomplete = axe.incomplete.map(i => ({ id: i.id, count: i.nodes.length }));

  rec.errors = errors;
  rec.failedRequests = failedReq;
  rec.consoleWarns = consoleWarns.slice(0, 10);

  const safe = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
  const shot = `/home/user/audit/shots/${site}-${device}-${safe}.png`;
  await page.screenshot({ path: shot, fullPage: false });
  rec.screenshot = shot;

  out.pages.push(rec);
  await page.close();
  console.log(`  ${site}/${device} ${route.padEnd(12)} ${rec.status} axe=${rec.axe.length} err=${errors.length} tap=${rec.smallTargets.length} ovf=${rec.layout.overflow}`);
}

await browser.close();
fs.writeFileSync(`/home/user/audit/evidence/raw-${site}-${device}.json`, JSON.stringify(out, null, 1));
console.log(`written raw-${site}-${device}.json (${out.pages.length} pages)`);
