import { chromium } from 'playwright';
const b = await chromium.launch({args:['--no-sandbox']});
const pg = await b.newPage({viewport:{width:1400,height:1000}, locale:'en-US'});
await pg.goto('https://www.google.com/maps/place/?q=place_id:ChIJMz_giNgbCxwRWGhl8RUYV2I', {waitUntil:'domcontentloaded', timeout:60000});
await pg.waitForTimeout(9000);
// open the photos grid
const photoBtn = pg.locator('button:has-text("See photos"), button[aria-label*="Photo"]').first();
if(await photoBtn.count()){ await photoBtn.click().catch(()=>{}); await pg.waitForTimeout(7000); }
for(let i=0;i<8;i++){ await pg.mouse.wheel(0,1400); await pg.waitForTimeout(1200); }
const urls = await pg.evaluate(()=>{
  const out=new Set();
  document.querySelectorAll('img').forEach(i=>{ if(i.src&&/googleusercontent|ggpht/.test(i.src)) out.add(i.src); });
  document.querySelectorAll('[style*="background-image"]').forEach(e=>{
    const m=getComputedStyle(e).backgroundImage.match(/url\("?([^")]+)"?\)/);
    if(m&&/googleusercontent|ggpht/.test(m[1])) out.add(m[1]);
  });
  return [...out];
});
console.log('google photo urls found:', urls.length);
urls.slice(0,40).forEach(u=>console.log(' ', u.slice(0,110)));
await pg.screenshot({path:'/home/user/qa/gphotos.png'});
await b.close();
