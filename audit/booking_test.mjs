/**
 * Functional test of the booking and contact flows.
 *
 * The forms critic noted that no <form> element exists on any route, so the
 * flows could not be judged from static evidence. This drives them for real:
 * the booking proxy must return the venue's booking app, the WhatsApp builder
 * must compose a valid wa.me deep link, and the voucher chooser must respond.
 */
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.argv[2] || 'https://emerald-spa-wellness.vercel.app';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const results = [];

function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${name}${detail ? ' - ' + detail : ''}`);
}

// 1. Booking route renders a working embed served from our own origin.
await page.goto(BASE + '/book', { waitUntil: 'networkidle', timeout: 60000 });
const frames = page.frames().filter(f => f !== page.mainFrame());
check('/book loads', true, `${frames.length} frame(s)`);

const iframeEl = await page.$('iframe');
if (iframeEl) {
  const src = await iframeEl.getAttribute('src');
  check('booking iframe is same-origin (platform name hidden)',
        !!src && !src.startsWith('http'), `src=${src}`);
  const cf = await iframeEl.contentFrame();
  if (cf) {
    await page.waitForTimeout(3500);
    const txt = (await cf.locator('body').innerText().catch(() => '')) || '';
    check('booking embed rendered content', txt.trim().length > 40,
          `${txt.trim().length} chars`);
    check('booking embed shows treatments',
          /book|service|treatment|massage|select/i.test(txt),
          txt.trim().slice(0, 60).replace(/\n/g, ' '));
  } else {
    check('booking iframe reachable', false, 'no content frame');
  }
} else {
  check('booking iframe present', false, 'no iframe on /book');
}

// 2. The booking proxy endpoint itself answers.
const proxy = await page.request.get(
  BASE + '/api/booking/a/emerald-spa-wellness-centre-windhoek-blackett-street-awio4ik8/booking?allOffer=true',
  { timeout: 45000 });
check('booking proxy responds 200', proxy.status() === 200, `status ${proxy.status()}`);
const body = await proxy.text();
check('booking proxy returns the venue page', /emerald/i.test(body),
      `${body.length} bytes`);

// 3. No visitor-facing copy names the platform.
const bookText = await page.locator('body').innerText();
check('booking page never names the platform', !/fresha/i.test(bookText));

// 4. WhatsApp builder composes a real deep link on the verified number.
await page.goto(BASE + '/whatsapp', { waitUntil: 'networkidle', timeout: 60000 });
const chips = page.locator('button[aria-pressed]');
const n = await chips.count();
check('whatsapp chips render', n > 0, `${n} options`);
if (n > 0) {
  await chips.nth(0).click();
  await page.waitForTimeout(250);
  const pressed = await chips.nth(0).getAttribute('aria-pressed');
  check('chip selection updates aria-pressed', pressed === 'true', `aria-pressed=${pressed}`);
}
const wa = await page.locator('a[href*="wa.me"]').first().getAttribute('href').catch(() => null);
check('wa.me link present on the verified number',
      !!wa && wa.includes('264856077143'), wa ? wa.slice(0, 90) : 'none');
check('wa.me link carries a prefilled message', !!wa && /[?&]text=/.test(wa));

// 5. Voucher chooser responds to input.
await page.goto(BASE + '/vouchers', { waitUntil: 'networkidle', timeout: 60000 });
const vBtns = page.locator('button');
const vCount = await vBtns.count();
check('voucher controls render', vCount > 0, `${vCount} buttons`);
const vWa = await page.locator('a[href*="wa.me"]').first().getAttribute('href').catch(() => null);
check('voucher page offers a real contact route', !!vWa, vWa ? vWa.slice(0, 70) : 'none');

// Record what a visitor can actually do on /book when the embed is blank.
await page.goto(BASE + '/book', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(20000);
const fallbackRoutes = await page.$$eval('a', as => as
  .map(a => ({ t: a.textContent.trim().slice(0, 30), h: a.href }))
  .filter(l => /^tel:|wa\.me|fresha\.com/.test(l.h)));
fs.writeFileSync('/home/user/audit/evidence/booking-fallback.json',
  JSON.stringify(fallbackRoutes, null, 1));
check('fallback offers a phone route', fallbackRoutes.some(r => r.h.startsWith('tel:')));
check('fallback offers WhatsApp', fallbackRoutes.some(r => r.h.includes('wa.me')));
check('fallback offers a direct booking link',
      fallbackRoutes.some(r => r.h.includes('fresha.com')));
await page.screenshot({ path: '/home/user/audit/shots/book-fallback.png' });

fs.writeFileSync('/home/user/audit/evidence/booking.json', JSON.stringify(results, null, 1));

await browser.close();
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('FAILURES: ' + failed.map(f => f.name).join(' | '));
  process.exitCode = 1;
}
