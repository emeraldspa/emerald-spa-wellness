/* Detail the gallery contrast violations: which selectors, what text. */
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3114/gallery', { waitUntil: 'networkidle' });
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const v = res.violations.find((x) => x.id === 'color-contrast');
  if (v) {
    v.nodes.forEach((n) => {
      console.log('selector:', n.target.join(' '));
      console.log('  summary:', n.failureSummary?.split('\n').slice(0, 3).join(' | '));
      console.log('  html:', n.html.slice(0, 160));
    });
  }
  await browser.close();
})();
