/* Round 11 QA sweep: all routes, multiple widths, overflow + key content. */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3100';
const ROUTES = [
  '/', '/book', '/book-bulk', '/brand', '/gallery', '/journal',
  '/journal/first-time-hydrotherapy-what-to-expect', '/pay', '/privacy',
  '/promotions', '/services', '/sitemap', '/team', '/terms', '/venues',
  '/visit', '/vouchers', '/whatsapp',
];
const WIDTHS = [320, 390, 768, 1024, 1440];

const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];
const consoleErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

let checks = 0;
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 800 });
    const resp = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (resp.status() !== 200) {
      failures.push(`${route} @${width}: HTTP ${resp.status()}`);
      continue;
    }
    await page.waitForTimeout(350);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scroll: doc.scrollWidth, client: doc.clientWidth };
    });
    if (overflow.scroll > overflow.client + 1) {
      failures.push(`${route} @${width}: horizontal overflow ${overflow.scroll}>${overflow.client}`);
    }
    checks++;
  }
}

// Content assertions on the home page
await page.setViewportSize({ width: 1366, height: 768 });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
const home = await page.evaluate(() => document.body.innerText);
const contentChecks = [
  ['tagline caps', /Relax the body, Renew the mind, Rejuvenate the soul/.test(home)],
  ['no Restore', !/\bRestore\b/.test(home)],
  ['no Balance word', !/\bBalance\b/.test(home)],
  ['no Glow word', !/\bGlow\b/.test(home)],
  ['no Book in Bulk', !/book in bulk/i.test(home)],
  ['has Group booking', /Group booking/i.test(home)],
  ['no review date 2026 in reviews', !/Aug 2[0-9], 2026|Aug [0-9], 2026/.test(home)],
];
for (const [name, pass] of contentChecks) {
  if (!pass) failures.push(`home content: ${name}`);
  checks++;
}

await browser.close();

console.log(`Routes x widths checks: ${checks}`);
console.log(`Console errors: ${consoleErrors.length}`);
consoleErrors.slice(0, 5).forEach((e) => console.log('  console:', e.slice(0, 140)));
if (failures.length) {
  console.log(`FAILURES (${failures.length}):`);
  failures.forEach((f) => console.log('  ' + f));
  process.exit(1);
} else {
  console.log('ALL CLEAN');
}
