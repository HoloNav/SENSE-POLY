/* Browser-level regression checks for S.E.N.S.E. POLY V5.
 * Exercises both Samsung-sized orientations without touching audio DSP. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const { chromium }=require('playwright-core');

async function test() {
  const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/snap/bin/chromium'].find(fs.existsSync);
  if(!chrome)throw new Error('Chromium/Google Chrome missing from runner');
  const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
  fs.mkdirSync('screenshots',{recursive:true});
  try {
    for(const [name,width,height] of [['portrait',390,844],['small',360,700],['landscape',844,390]]) {
      const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto('file://'+path.resolve('index.html'),{waitUntil:'load'});
      await page.locator('[data-tab="seq"]').click();
      assert.equal(await page.locator('.seq-grid .step').count(),32,'All 32 steps should exist');
      assert.equal(await page.locator('[data-choose-bank]').count(),8,'Eight bank buttons');
      assert.equal(await page.locator('[data-choose-slot]').count(),8,'Eight pattern buttons');
      await page.locator('[data-choose-bank="1"]').click();
      await page.locator('[data-choose-slot="2"]').click();
      assert.deepEqual(await page.evaluate(()=>[bank,slot]),[1,2],'B3 must be selected');
      assert.equal(await page.locator('#pattern-current').innerText(),'B3');
      assert.equal(await page.locator('[data-choose-bank="1"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('[data-choose-slot="2"]').getAttribute('aria-pressed'),'true');
      await page.locator('.seq-grid [data-step="31"]').click({force:true});
      assert.equal(await page.locator('#selected-name').innerText(),'32');
      await page.locator('.seq-key-deck [data-action="stepRec"]').click();
      assert.equal(await page.locator('.seq-key-deck [data-action="stepRec"]').getAttribute('class').then(x=>x.includes('recording')),true);
      const dims=await page.evaluate(()=>{
        const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
        return {grid:rect('.seq-v5-overview .seq-grid'),studio:rect('.seq-v5-studio'),
         launcher:rect('.pattern-launcher'),keyboard:rect('.seq-key-deck'),main:rect('.seq-v5-main'),bodyW:document.documentElement.scrollWidth,bodyH:document.documentElement.scrollHeight};
      });
      assert.ok(dims.grid.width>200 && dims.grid.height>100,name+' step grid is usable');
      assert.ok(dims.launcher.height>20 && dims.launcher.width>180,name+' pattern buttons are visible');
      assert.ok(dims.keyboard.height>35,name+' sequencer keyboard is visible');
      if(name==='landscape') {
        assert.ok(dims.studio.left>=dims.grid.right-5,'Landscape pattern editor should be to the right of grid');
        assert.ok(dims.keyboard.top>=dims.grid.bottom-8,'Landscape keyboard should be below grid');
      }
      await page.screenshot({path:'screenshots/'+name+'-sequencer.png'});
      await page.locator('[data-tab="synth"]').click();
      if(name==='landscape') {
        const synth=await page.evaluate(()=>{
          const b=document.querySelector('.synth-layout > .bank-stage').getBoundingClientRect();
          const k=document.querySelector('.synth-layout > .performance-strip').getBoundingClientRect();
          return {bankRight:b.right,keysLeft:k.left,keysHeight:k.height};
        });
        assert.ok(synth.keysLeft>=synth.bankRight-10,'Landscape synth keyboard must be beside controls');
        assert.ok(synth.keysHeight>100,'Landscape synth keyboard must be taller than the old strip');
      }
      await page.screenshot({path:'screenshots/'+name+'-synth.png'});
      assert.deepEqual(errors,[],'No browser JavaScript errors: '+errors.join(' | '));
      console.log(name,'PASS',JSON.stringify(dims));
      await page.close();
    }
  } finally { await browser.close(); }
}
test().catch(e=>{console.error(e.stack||e);process.exit(1)});