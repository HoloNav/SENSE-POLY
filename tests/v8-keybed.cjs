/* S.E.N.S.E. POLY V8 / Signature keybed browser checks.
   All tests run locally inside GitHub Actions against the committed HTML.
   Verifies dimensions, labels, three octaves, scroll, tab swap, octave shift.
*/
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright-core');

async function main(){
  const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/snap/bin/chromium'].find(fs.existsSync);
  if(!chrome)throw Error('Chrome / Chromium not found');
  const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
  fs.mkdirSync('screenshots',{recursive:true});
  try {
    for(const [name,width,height] of [['portrait',390,844],['small',360,700],['landscape',844,390],['landscape-small',740,360]]) {
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
      const errs=[];
      page.on('pageerror',e=>errs.push(e.message));
      await page.goto('file://'+path.resolve('index.html'),{waitUntil:'load'});
      assert.match(await page.title(),/V8/);
      const dims=async() => await page.evaluate(()=>{
        const k=document.querySelector('.v7-keyboard-dock .performance-strip:not(.hidden) .keyboard, .v7-keyboard-dock .seq-key-deck:not(.hidden) .keyboard');
        const rail=k.parentElement;
        const whites=[...k.querySelectorAll('.key.white')];
        const blacks=[...k.querySelectorAll('.key.black')];
        const rect=e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,top:r.top}};
        return {
          keyCount:k.querySelectorAll('.key').length,whiteCount:whites.length,blackCount:blacks.length,
          labels:[...k.querySelectorAll('.sense-key-label')].map(x=>x.textContent),
          start:k.dataset.rangeFrom,end:k.dataset.rangeTo,
          white:rect(whites[0]),black:rect(blacks[0]),
          keybed:rect(k),rail:rect(rail),scrollWidth:rail.scrollWidth,clientWidth:rail.clientWidth,scrollLeft:rail.scrollLeft,
          dock:rect(document.querySelector('.v7-keyboard-dock')),
          scrollY:window.scrollY,docHeight:document.scrollingElement.scrollHeight,
          dockPosition:getComputedStyle(document.querySelector('.v7-keyboard-dock')).position
        };
      });
      const expectDims=async(label) => {
        const d=await dims();
        assert.equal(d.keyCount,37,label+' should show three octaves + high C');
        assert.equal(d.whiteCount,22,label+' should have 22 white keys');
        assert.equal(d.blackCount,15,label+' should have 15 black keys');
        assert.equal(d.labels.length,37,label+' every key must have a label');
        assert.equal(d.labels[0],'C3');
        assert.equal(d.labels[21],'C6','labels should include octave end C');
        assert.ok(d.labels.includes('C#3') && d.labels.includes('F#5'),label+' labeled accidentals');
        assert.equal(d.start,'48');
        assert.equal(d.end,'84');
        assert.equal(d.white.width,54,'ACID-style 54px white key proportions');
        assert.equal(d.black.width,29,'ACID-style 29px black key proportions');
        assert.ok(Math.abs(d.white.height-132)<2,label+' 132px key height');
        assert.ok(d.black.height>65 && d.black.height<96,label+' black keys around 62% high');
        assert.equal(d.keybed.width,1188,label+' 22 white keys × 54px');
        assert.ok(d.rail.width>width*.8,label+' rail spans viewport');
        assert.ok(d.scrollWidth>d.clientWidth+60,label+' long piano scrolls horizontally');
        assert.equal(d.dockPosition,'fixed',label+' only piano remains pinned');
        return d;
      };
      const synth=await expectDims('synth');
      const firstTop=synth.dock.top;
      await page.evaluate(()=>{window.scrollTo(0,150);document.querySelector('.performance-keys').scrollLeft=125;});
      const scrolling=await dims();
      assert.ok(scrolling.scrollY>50,'main document must scroll');
      assert.ok(Math.abs(scrolling.dock.top-firstTop)<2,'fixed keyboard cannot move vertically');
      assert.ok(scrolling.scrollLeft>=100,'horizontal piano must be scrollable');

      // The same piano geometry should follow the sequencer without recreating
      // step/event handlers or losing access to existing recording buttons.
      await page.locator('[data-tab="seq"]').click();
      const seq=await expectDims('sequencer');
      assert.equal(seq.white.width,synth.white.width);
      assert.equal(seq.white.height,synth.white.height);
      assert.equal(await page.locator('.seq-grid .step').count(),32);
      assert.equal(await page.locator('[data-choose-slot]').count(),8);
      assert.equal(await page.locator('[data-choose-bank]').count(),8);
      await page.locator('.seq-key-deck [data-action="stepRec"]').click();
      assert.ok((await page.locator('.seq-key-deck [data-action="stepRec"]').getAttribute('class')).includes('recording'),'step record button remains usable');
      await page.screenshot({path:'screenshots/v8-'+name+'-keybed-seq.png'});

      await page.locator('.seq-key-deck [data-action="octaveUp"]').click();
      const shifted=await page.evaluate(()=>({
        from:document.querySelector('.seq-key-deck .keyboard').dataset.rangeFrom,
        to:document.querySelector('.seq-key-deck .keyboard').dataset.rangeTo,
        label:document.querySelector('#seq-octave-readout')?.textContent,
        count:document.querySelectorAll('.seq-key-deck .sense-key-label').length
      }));
      assert.equal(shifted.from,'60','octave up must start C4');
      assert.equal(shifted.to,'96','octave up must end C7');
      assert.equal(shifted.count,37);
      assert.match(shifted.label||'',/C4.*C7/);
      await page.locator('[data-tab="synth"]').click();
      const synthShifted=await page.evaluate(()=>({
        from:document.querySelector('.performance-strip .keyboard').dataset.rangeFrom,
        label:document.querySelector('#octave-readout')?.textContent
      }));
      assert.equal(synthShifted.from,'60','two tabs must share the octave control');
      assert.match(synthShifted.label||'',/C4.*C7/);
      await page.screenshot({path:'screenshots/v8-'+name+'-keybed-synth.png'});
      assert.deepEqual(errs,[],'Browser JS errors: '+errs.join(' | '));
      console.log(name,'PASS',JSON.stringify({white:synth.white,black:synth.black,keybedWidth:synth.keybed.width,scrollWidth:synth.scrollWidth,scrollY:scrolling.scrollY,seqWhite:seq.white,shifted}));
      await page.close();
    }
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e.stack||e);process.exit(1)});
