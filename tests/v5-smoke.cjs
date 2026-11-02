/* S.E.N.S.E. POLY V6 touchscreen/browser regression checks.
 * Tests existing 64-pattern launcher and the fixed-bottom keyboards while
 * synth/sequencer controls scroll independently on short landscape screens. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright-core');

async function main(){
  const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/snap/bin/chromium'].find(fs.existsSync);
  if(!chrome)throw new Error('Google Chrome/Chromium binary not found');
  const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
  fs.mkdirSync('screenshots',{recursive:true});
  const viewports=[['portrait',390,844],['small',360,700],['landscape',844,390],['landscape-small',740,360]];
  try{
    for(const [name,width,height] of viewports){
      const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto('file://'+path.resolve('index.html'),{waitUntil:'load'});
      assert.match(await page.title(),/V6/,'V6 layout must initialize');
      await page.locator('[data-tab="seq"]').click();
      assert.equal(await page.locator('.seq-grid .step').count(),32);
      assert.equal(await page.locator('[data-choose-bank]').count(),8);
      assert.equal(await page.locator('[data-choose-slot]').count(),8);
      await page.locator('[data-choose-bank="1"]').click();
      await page.locator('[data-choose-slot="2"]').click();
      assert.deepEqual(await page.evaluate(()=>[bank,slot]),[1,2],'B3 selected');
      assert.equal(await page.locator('#pattern-current').innerText(),'B3');
      assert.equal(await page.locator('[data-choose-bank="1"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('[data-choose-slot="2"]').getAttribute('aria-pressed'),'true');
      await page.locator('.seq-grid [data-step="31"]').click({force:true});
      assert.equal(await page.locator('#selected-name').innerText(),'32');
      await page.locator('.seq-key-deck [data-action="stepRec"]').click();
      assert.ok((await page.locator('.seq-key-deck [data-action="stepRec"]').getAttribute('class')).includes('recording'));
      const seq=await page.evaluate(()=>{
        const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
        const main=document.querySelector('.seq-v5-main');
        return {grid:rect('.seq-v5-overview .seq-grid'),studio:rect('.seq-v5-studio'),launcher:rect('.pattern-launcher'),
          deck:rect('.seq-key-deck'),white:rect('.seq-key-deck .key.white'),main:rect('.seq-v5-main'),
          scrollHeight:main.scrollHeight,clientHeight:main.clientHeight,scrollOverflow:getComputedStyle(main).overflowY,
          bodyW:document.documentElement.scrollWidth,bodyH:document.documentElement.scrollHeight};
      });
      assert.ok(seq.grid.width>200 && seq.grid.height>100,name+' grid usable');
      assert.ok(seq.launcher.width>180 && seq.launcher.height>20,name+' pattern selector visible');
      if(name.startsWith('landscape')){
        assert.ok(seq.studio.left>=seq.grid.right-5,'Editor is to the right of the grid');
        assert.ok(seq.deck.top>=seq.main.bottom-8,'Recording keyboard beneath scrollable sequencer');
        assert.ok(seq.deck.height>=118,'Recording keyboard dock must be >=118px high');
        assert.ok(seq.white.height>=70,'Playable white keys must have meaningful height');
        assert.ok(seq.deck.width>width*.88,'Recording keyboard should span instrument width');
        assert.equal(seq.scrollOverflow,'auto','Sequencer main should scroll vertically');
        assert.equal(await page.locator('.seq-key-keys .key').count(),24,'Two full octaves on sequencer keyboard');
        const before=seq.deck.top;
        const move=await page.evaluate(()=>{
          const area=document.querySelector('.seq-v5-main');
          area.scrollTop=60;
          return {top:area.scrollTop,deck:document.querySelector('.seq-key-deck').getBoundingClientRect().top};
        });
        assert.ok(move.top>0,'Sequencer content must scroll independently');
        assert.ok(Math.abs(move.deck-before)<2,'Sequencer keyboard must stay fixed while editing scrolls');
        await page.evaluate(()=>document.querySelector('.seq-v5-main').scrollTop=0);
      }
      await page.screenshot({path:'screenshots/'+name+'-sequencer.png'});
      await page.locator('[data-tab="synth"]').click();
      const visibleBanks=await page.evaluate(()=>[...document.querySelectorAll('.bank-panel')]
        .filter(x=>!x.classList.contains('hidden') && getComputedStyle(x).display!=='none')
        .map(x=>x.dataset.bankPanel));
      assert.deepEqual(visibleBanks,['osc'],'Only the selected synth control bank should be visible');
      const synth=await page.evaluate(()=>{
        const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
        const stage=document.querySelector('.synth-layout > .bank-stage');
        return {stage:rect('.synth-layout > .bank-stage'),keys:rect('.synth-layout > .performance-strip'),
          white:rect('.performance-strip .key.white'),mode:getComputedStyle(stage).overflowY,
          scrollHeight:stage.scrollHeight,clientHeight:stage.clientHeight};
      });
      if(!name.startsWith('landscape')){
        assert.equal(synth.mode,'auto','Portrait synth controls should also scroll independently');
      }
      if(name.startsWith('landscape')){
        assert.ok(synth.keys.top>=synth.stage.bottom-5,'Full-width synth piano below the controls');
        assert.ok(synth.keys.width>width*.88,'Synth piano should span instrument width');
        assert.ok(synth.keys.height>=105,'Synth piano dock must have playable height');
        assert.ok(synth.white.height>=52,'Synth white keys should be tall enough');
        assert.equal(synth.mode,'auto','Controls must scroll independently');
        assert.equal(await page.locator('.performance-keys .key').count(),24,'Two octaves on synth keyboard');
        const before=synth.keys.top;
        const scroll=await page.evaluate(()=>{
          const stage=document.querySelector('.synth-layout > .bank-stage');
          stage.scrollTop=100;
          return {scroll:stage.scrollTop,keyboard:document.querySelector('.performance-strip').getBoundingClientRect().top};
        });
        assert.ok(scroll.scroll>0,'Synth controls should actually scroll');
        assert.ok(Math.abs(before-scroll.keyboard)<2,'Piano must not move when control area scrolls');
        await page.locator('[data-bank-tab="filter"]').click();
        assert.equal(await page.evaluate(()=>document.querySelector('.bank-stage').scrollTop),0,'Changing synth banks resets scroll');
        const bankAfter=await page.evaluate(()=>[...document.querySelectorAll('.bank-panel')]
          .filter(x=>!x.classList.contains('hidden') && getComputedStyle(x).display!=='none')
          .map(x=>x.dataset.bankPanel));
        assert.deepEqual(bankAfter,['filter'],'Switching banks should hide the others');
      }
      await page.screenshot({path:'screenshots/'+name+'-synth.png'});
      assert.deepEqual(errors,[],'No JavaScript errors: '+errors.join(' | '));
      console.log(name,'PASS',JSON.stringify({seq,synth}));
      await page.close();
    }
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e.stack||e);process.exit(1)});
