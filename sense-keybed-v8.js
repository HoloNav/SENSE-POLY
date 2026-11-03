/* S.E.N.S.E. POLY V8 — S.E.N.S.E. Signature Keybed
   Reusable keyboard geometry, note labels, three complete octaves.
   Music-engine and step/live-record callbacks stay owned by the original app.
   Based on the ACID-08 key styling and layout proportions, adapted for
   HoloNav's cyan/violet theme.
*/
'use strict';
(() => {
  if (typeof VARIANT !== 'string' || VARIANT !== 'A') return;
  const dock = document.querySelector('.v7-keyboard-dock');
  if (!dock || typeof keyboardMarkup !== 'function') return;

  const WHITE_WIDTH = 54;
  const BLACK_WIDTH = 29;
  const SEMITONES = 36; // C3..C6 inclusive: three complete octaves + end C
  const IS_BLACK = new Set([1,3,6,8,10]);

  // Replace the old 24-note rendering while retaining the existing
  // data-note attributes used by pointerdown and recording.
  keyboardMarkup = function(el) {
    if (!el) return;
    const from = 48 + keyboardOctave * 12; // default C3
    const to = from + SEMITONES;
    const white=[],black=[];
    let whiteIndex=0;
    for (let n=from;n<=to;n++) {
      const offset=n-from;
      const isBlack=IS_BLACK.has(offset % 12);
      const note=midiName(n);
      const aria='Play '+note;
      if (isBlack) {
        const x=whiteIndex*WHITE_WIDTH-BLACK_WIDTH/2;
        black.push(
          '<button type="button" class="key black sense-key" data-note="'+n+
          '" style="left:'+x+'px;width:'+BLACK_WIDTH+'px" aria-label="'+aria+
          '" title="'+aria+'"><span class="sense-key-label">'+note+'</span></button>'
        );
      } else {
        const x=whiteIndex*WHITE_WIDTH;
        white.push(
          '<button type="button" class="key white sense-key" data-note="'+n+
          '" style="left:'+x+'px;width:'+WHITE_WIDTH+'px" aria-label="'+aria+
          '" title="'+aria+'"><span class="sense-key-label">'+note+'</span></button>'
        );
        whiteIndex++;
      }
    }
    el.innerHTML=white.join('')+black.join('');
    el.style.width=(whiteIndex*WHITE_WIDTH)+'px';
    el.style.minWidth=(whiteIndex*WHITE_WIDTH)+'px';
    el.dataset.rangeFrom=String(from);
    el.dataset.rangeTo=String(to);
    el.dataset.keyCount=String(SEMITONES+1);
    const readout=el.closest('.seq-key-deck')?
      document.querySelector('#seq-octave-readout'):
      document.querySelector('#octave-readout');
    if (readout) readout.textContent=midiName(from)+' – '+midiName(to);
  };

  // Tell the performer they are using the same S.E.N.S.E. keybed,
  // no matter which instrument workspace is active.
  const titles=dock.querySelectorAll('.performance-keybar strong, .seq-key-title strong');
  titles.forEach(t=>{t.textContent='S.E.N.S.E. KEYBED';});
  dock.querySelectorAll('.keyboard').forEach(keyboardMarkup);
  dock.setAttribute('aria-label','S.E.N.S.E. signature three-octave keyboard');

  // Holding a note still plays it immediately. If the same gesture becomes
  // a horizontal swipe, silence that note and scroll the long keyboard.
  // We scroll manually because the existing engine captures key pointers.
  for(const rail of dock.querySelectorAll('.performance-keys,.seq-key-keys')) {
    let state=null;
    rail.addEventListener('pointerdown',e=>{
      const key=e.target.closest('.key');
      if(!key)return;
      state={id:e.pointerId,x:e.clientX,y:e.clientY,left:rail.scrollLeft,
        note:Number(key.dataset.note),dragging:false};
    },{capture:true,passive:true});
    rail.addEventListener('pointermove',e=>{
      if(!state || state.id!==e.pointerId)return;
      const dx=e.clientX-state.x,dy=e.clientY-state.y;
      if(!state.dragging && Math.abs(dx)>9 && Math.abs(dx)>Math.abs(dy)*1.1){
        state.dragging=true;
        if(typeof pressed!=='undefined' && pressed.has(state.note)){
          touchNote(state.note,false);
        }
      }
      if(state.dragging){
        if(e.cancelable)e.preventDefault();
        rail.scrollLeft=state.left-dx;
      }
    },{passive:false});
    const end=e=>{if(state && e.pointerId===state.id)state=null;};
    rail.addEventListener('pointerup',end,{capture:true});
    rail.addEventListener('pointercancel',end,{capture:true});
    rail.addEventListener('lostpointercapture',end,{capture:true});
  }

  const subtitle=document.querySelector('.logo small');
  if(subtitle)subtitle.textContent='HOLONAV · S.E.N.S.E. KEYBED / V8';
  const footer=document.querySelector('.meta-foot span');
  if(footer)footer.textContent='HOLONAV / S.E.N.S.E. POLY · V8 · SIGNATURE KEYBED';
  document.title='S.E.N.S.E. POLY — HoloNav V8 Signature Keybed';
})();
