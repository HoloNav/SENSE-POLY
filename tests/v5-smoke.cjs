/* S.E.N.S.E. POLY V7 regression suite:
 * only the keyboard dock is fixed; the whole page, controls, steps, pattern
 * picker and transport all scroll normally. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright-core');

async function main() {
  const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/snap/bin/chromium'].find(fs.existsSync);
  if(!chrome)throw Error('Chromium or Google Chrome not found');
  const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
  const viewports=[['portrait',390,844],['small',360,700],['landscape',844,390],['landscape-small',740,360]];
  fs.mkdirSync('screenshots',{recursive:true});
  try{
    for(const [name,width,height] of viewports) {
      const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('file://'+path.resolve('index.html'),{waitUntil:'load'});
      assert.match(await page.title(),/V7/,'V7 enhancements must load');
      const initial=await page.evaluate(()=>{
        const dock=document.querySelector('.v7-keyboard-dock');
        return {fixed:getComputedStyle(dock).position,
          transport:getComputedStyle(document.querySelector('.transport-dock')).position,
          bankOverflow:getComputedStyle(document.querySelector('.bank-stage')).overflowY,
          docHeight:document.scrollingElement.scrollHeight,visible:document.scrollingElement.clientHeight,
          dockTop:dock.getBoundingClientRect().top,
          dockWidth:dock.getBoundingClientRect().width,
          keyHeight:document.querySelector('.performance-strip .key.white').getBoundingClientRect().height,
          synthDisplay:getComputedStyle(document.querySelector('.performance-strip')).display,
          seqDisplay:getComputedStyle(document.querySelector('.seq-key-deck')).display};
      });
      assert.equal(initial.fixed,'fixed','Only keyboard dock is fixed');
      assert.notEqual(initial.transport,'fixed','Transport should flow with page');
      assert.equal(initial.bankOverflow,'visible','Synth bank must not have its own scroll viewport');
      assert.equal(initial.synthDisplay,'flex');
      assert.equal(initial.seqDisplay,'none');
      assert.ok(initial.dockWidth>width*.9,'Keyboard must span phone width');
      assert.ok(initial.keyHeight>=65,'Playable keys should be tall');
      assert.ok(initial.docHeight>initial.visible+50,'The document must be scrollable');

      const synthBefore=await page.evaluate(()=>({
        topbar:document.querySelector('.topbar').getBoundingClientRect().top,
        dock:document.querySelector('.v7-keyboard-dock').getBoundingClientRect().top
      }));
      const synthMove=await page.evaluate(()=>{
        window.scrollTo(0,210);
        return {y:window.scrollY,topbar:document.querySelector('.topbar').getBoundingClientRect().top,
          dock:document.querySelector('.v7-keyboard-dock').getBoundingClientRect().top};
      });
      assert.ok(synthMove.y>80,'Entire synth page must scroll');
      assert.ok(synthMove.topbar<synthBefore.topbar-80,'Synth controls/header should move with document');
      assert.ok(Math.abs(synthMove.dock-synthBefore.dock)<2,'Keyboard stays fixed while page moves');
      await page.locator('[data-bank-tab="filter"]').click();
      const visible=await page.evaluate(()=>[...document.querySelectorAll('.bank-panel')]
        .filter(el=>getComputedStyle(el).display!=='none')
        .map(el=>el.dataset.bankPanel));
      assert.deepEqual(visible,['filter'],'Only chosen synth control bank is displayed');
      assert.equal(await page.locator('.performance-keys .key').count(),24,'Two-octave synth keyboard');
      await page.screenshot({path:'screenshots/v7-'+name+'-synth.png'});

      await page.locator('[data-tab="seq"]').click();
      assert.equal(await page.locator('.seq-grid .step').count(),32,'32 steps on one page');
      assert.equal(await page.locator('[data-choose-bank]').count(),8,'Eight banks');
      assert.equal(await page.locator('[data-choose-slot]').count(),8,'Eight patterns per bank');
      const seq=await page.evaluate(()=>{
        const rect=el=>{const r=document.querySelector(el).getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
        return {grid:rect('.seq-grid'),panel:rect('.seq-panel'),dock:rect('.v7-keyboard-dock'),
          white:rect('.seq-key-deck .key.white'),picker:rect('.pattern-launcher'),
          mainOverflow:getComputedStyle(document.querySelector('.seq-v5-main')).overflowY,
          seqDisplay:getComputedStyle(document.querySelector('.seq-key-deck')).display,
          synthDisplay:getComputedStyle(document.querySelector('.performance-strip')).display,
          scrollHeight:document.scrollingElement.scrollHeight,clientHeight:document.scrollingElement.clientHeight};
      });
      assert.equal(seq.seqDisplay,'flex','Recording keyboard active on seq tab');
      assert.equal(seq.synthDisplay,'none','Synth keyboard hidden on seq tab');
      assert.ok(seq.grid.height>=250,'Full 32-pad grid should be generously sized');
      assert.ok(seq.grid.width>width*.9-30,'Grid should span page width');
      assert.ok(seq.white.height>=58,'Recording keyboard is playable');
      assert.ok(seq.picker.width>width*.88,'Pattern picker should have full-width buttons');
      assert.equal(seq.mainOverflow,'visible','Sequencer area should be freely scrollable with page');
      assert.ok(seq.scrollHeight>seq.clientHeight+50,'Sequencer document can scroll');
      await page.locator('[data-choose-bank="1"]').click();
      await page.locator('[data-choose-slot="2"]').click();
      assert.deepEqual(await page.evaluate(()=>[bank,slot]),[1,2],'B3 selected');
      assert.equal(await page.locator('#pattern-current').innerText(),'B3');
      await page.locator('.seq-grid [data-step="31"]').click();
      assert.equal(await page.locator('#selected-name').innerText(),'32');
      const dockY=await page.evaluate(()=>document.querySelector('.v7-keyboard-dock').getBoundingClientRect().top);
      const seqScroll=await page.evaluate(()=>{
        window.scrollTo(0,Math.max(250,document.scrollingElement.scrollHeight-window.innerHeight-20));
        return {y:window.scrollY,dock:document.querySelector('.v7-keyboard-dock').getBoundingClientRect().top,
          grid:document.querySelector('.seq-grid').getBoundingClientRect().top};
      });
      assert.ok(seqScroll.y>80,'Sequencer page must scroll');
      assert.ok(Math.abs(seqScroll.dock-dockY)<2,'Sequencer keyboard stays fixed while pads scroll');
      assert.ok(seqScroll.grid<seq.grid.top-80,'Sequencer pads move with the document');
      await page.locator('.seq-key-deck [data-action="stepRec"]').click();
      assert.ok((await page.locator('.seq-key-deck [data-action="stepRec"]').getAttribute('class')).includes('recording'),'STEP REC works in anchored keyboard');
      await page.screenshot({path:'screenshots/v7-'+name+'-sequencer.png'});
      assert.deepEqual(errors,[],'No JS errors: '+errors.join(' | '));
      console.log(name,'PASS',JSON.stringify({initial,seq,synthMove,seqScroll}));
      await page.close();
    }
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e.stack||e);process.exit(1);});
