/* Round 18 axe scan on the changed surfaces: home (products accordion),
   hydrotherapy article (new grid), specials (new page). Zero WCAG 2 A/AA
   violations is the gate. */
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  let bad = 0;
  for (const path of ['/', '/journal/first-time-hydrotherapy-what-to-expect', '/specials', '/venues', '/gallery']) {
    await page.goto(`http://localhost:3114${path}`, { waitUntil: 'networkidle' });
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const v = res.violations.filter((x) => x.impact !== 'minor');
    console.log(`${path}: ${v.length} violations`);
    v.forEach((x) => console.log('  -', x.id, x.nodes.length, 'nodes'));
    bad += v.length;
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
