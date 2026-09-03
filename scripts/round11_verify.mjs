/*
  Round 11 verification: hero fit at multiple resolutions, hero words,
  carousel without captions, reviews without dates, gallery 4:3 frames,
  journal article 4:3 frame.
*/
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3100';
const OUT = '/home/z/my-project/download/screenshots-round11';
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop-1366x768', width: 1366, height: 768 },
  { name: 'laptop-1440x900', width: 1440, height: 900 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'landscape-844x390', width: 844, height: 390 },
];

const results = [];

function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`);
}

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
  });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);

  // 1. Hero fits: hero section bottom edge vs viewport height
  const heroBox = await page.evaluate(() => {
    const section = document.querySelector('section.relative');
    const r = section.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, height: r.height, vh: window.innerHeight, scrollY: window.scrollY };
  });
  check(
    `hero-fit ${vp.name}`,
    heroBox.scrollY === 0 && heroBox.bottom <= heroBox.vh + 1,
    `hero bottom ${Math.round(heroBox.bottom)} vs vh ${heroBox.vh}`,
  );

  // Screenshot of the hero
  await page.screenshot({ path: `${OUT}/hero-${vp.name}.png` });

  // Scroll past hero; the hero must not exceed the viewport on load
  if (vp.name === 'desktop-1366x768') {
    // 2. Hero words + stats visible (geometry: stats chip below header)
    const words = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText.trim().split('\n') : [];
    });
    check(
      'hero-words desktop',
      JSON.stringify(words) === JSON.stringify(['Relax', 'Renew', 'Rejuvenate']),
      words.join(' / '),
    );

    const chip = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('p'));
      const stat = els.find((e) => e.textContent.trim() === '+93');
      if (!stat) return null;
      const r = stat.getBoundingClientRect();
      return { top: r.top };
    });
    check(
      'counter-visible desktop',
      Boolean(chip && chip.top > 100),
      `stat top ${chip ? Math.round(chip.top) : 'not found'}px (header ~90px)`,
    );
  }

  // 3. Carousel has no figcaption
  const captionCount = await page.evaluate(() => {
    const car = document.querySelector('ul[aria-label*="Photographs"]');
    if (!car) return -1;
    return car.querySelectorAll('figcaption').length;
  });
  check(`carousel-captions ${vp.name}`, captionCount === 0, `captions: ${captionCount}`);

  // 4. Review dates removed
  const dateHits = await page.evaluate(() => {
    const caps = Array.from(document.querySelectorAll('blockquote figcaption'));
    return caps.filter((c) => /\d{4}|Aug|Sep|Mon|Tue|Wed|Thu|Fri|Sat|Sun/.test(c.textContent)).length;
  });
  check(`review-dates ${vp.name}`, dateHits === 0, `figcaptions with dates: ${dateHits}`);

  await page.close();
}

// 5. Gallery 4:3 frames
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(`${BASE}/gallery`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const frames = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs
      .filter((i) => i.className.includes('aspect'))
      .slice(0, 8)
      .map((i) => ({ w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height) }));
  });
  const all43 = frames.every((f) => Math.abs(f.w / f.h - 4 / 3) < 0.05);
  check('gallery-4x3 desktop', all43 && frames.length > 0, JSON.stringify(frames.slice(0, 3)));
  await page.screenshot({ path: `${OUT}/gallery-desktop.png`, fullPage: false });
  await page.evaluate(() => document.querySelectorAll('section[id="hydrotherapy"]')[0]?.scrollIntoView());
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/gallery-hydro-section.png` });
  await page.close();
}

// 6. Journal article frame
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const resp = await page.goto(`${BASE}/journal/first-time-hydrotherapy-what-to-expect`, { waitUntil: 'networkidle' });
  check('journal-article-200', resp.status() === 200, `status ${resp.status()}`);
  await page.waitForTimeout(1000);
  const frame = await page.evaluate(() => {
    const img = document.querySelector('article img');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), ratio: (r.width / r.height).toFixed(2) };
  });
  check(
    'journal-4x3',
    Boolean(frame && Math.abs(parseFloat(frame.ratio) - 4 / 3) < 0.05),
    frame ? `${frame.w}x${frame.h} ratio ${frame.ratio}` : 'no img',
  );
  await page.screenshot({ path: `${OUT}/journal-article.png` });
  await page.close();
}

await browser.close();

const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} checks passed`);
fs.writeFileSync(`${OUT}/round11_results.json`, JSON.stringify(results, null, 2));
process.exit(fails.length ? 1 : 0);
