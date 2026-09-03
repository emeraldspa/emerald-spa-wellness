import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 844, height: 390 } });
await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const probe = await page.evaluate(() => {
  const q = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      top: Math.round(r.top),
      height: Math.round(r.height),
      bottom: Math.round(r.bottom),
      pt: cs.paddingTop,
      pb: cs.paddingBottom,
      mb: cs.marginBottom,
      fs: cs.fontSize,
      display: cs.display,
    };
  };
  return {
    section: q('section.relative'),
    inner: q('section.relative > div.relative'),
    topBlock: q('.hero-top'),
    extras: q('.hero-extras'),
    chip: q('.hero-extras .flex.justify-end'),
    panel: q('.hero-panel-mb'),
    h1: q('h1'),
    word: q('.hero-word'),
    matchMedia500: window.matchMedia('(max-height: 500px)').matches,
  };
});
console.log(JSON.stringify(probe, null, 2));
await browser.close();
