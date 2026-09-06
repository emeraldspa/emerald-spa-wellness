/* Round 18 nav spill check: Specials joined the inline header row, so the
   row must still fit at every desktop width (Round 14 root cause was exactly
   this row spilling). Measures horizontal overflow of the header pill content
   and captures screenshots of the changed surfaces. */
const { chromium } = require('playwright');

const VIEWPORTS = [
  [1024, 768], [1152, 800], [1280, 800], [1366, 768], [1440, 900], [1536, 864], [1920, 1080],
];

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const failures = [];
  for (const [width, height] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('http://localhost:3114/', { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const header = document.querySelector('header') ?? document.body;
      const spill = [];
      let worst = 0;
      header.querySelectorAll('*').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.right > window.innerWidth + 0.5 && b.width > 0) {
          const over = Math.round(b.right - window.innerWidth);
          if (over > worst) worst = over;
          if (spill.length < 3) spill.push(`${el.tagName}.${String(el.className).slice(0, 40)} +${over}px`);
        }
      });
      const doc = document.documentElement;
      return { worst, spill, docScroll: doc.scrollWidth - doc.clientWidth };
    });
    const status = r.worst > 0 || r.docScroll > 0 ? 'SPILL' : 'ok';
    if (status === 'SPILL') failures.push({ width, ...r });
    console.log(`${width}px: ${status} (worst +${r.worst}px, docScroll +${r.docScroll}px)${r.spill.length ? ' :: ' + r.spill.join(' | ') : ''}`);
    await page.close();
  }

  // Screenshots of the changed surfaces at 1440 and 390.
  for (const [w, h, name] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    for (const [path, file] of [
      ['/journal/first-time-hydrotherapy-what-to-expect', `r18_hydro_${name}`],
      ['/specials', `r18_specials_${name}`],
      ['/', `r18_products_${name}`],
    ]) {
      await page.goto(`http://localhost:3114${path}`, { waitUntil: 'networkidle' });
      if (path === '/') {
        await page.locator('#products').scrollIntoViewIfNeeded();
        await page.waitForTimeout(900);
        // open the first accordion for the shot
        const d = page.locator('#products details').first();
        await d.locator('summary').click().catch(() => {});
        await page.waitForTimeout(300);
      }
      await page.screenshot({ path: `/home/z/my-project/emerald-spa-wellness/audit-shots/${file}.png`, fullPage: false });
    }
    await page.close();
  }
  await browser.close();
  if (failures.length) { console.log('FAILURES:', JSON.stringify(failures, null, 1)); process.exit(1); }
  console.log('ALL CLEAR');
})();
