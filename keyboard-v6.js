/* S.E.N.S.E. POLY V6 — layout behavior only.
 * Keeps the sound engine and sequence data exactly as in V5. */
'use strict';
(() => {
  if(typeof VARIANT!=='string' || VARIANT!=='A')return;
  const stage=document.querySelector('.synth-layout > .bank-stage');
  document.addEventListener('click', e => {
    if(e.target.closest('[data-bank-tab]') && stage)stage.scrollTop=0;
  }, {capture:true});
  const tagline=document.querySelector('.logo small');
  if(tagline)tagline.textContent='HOLONAV · ORBITAL SYNTHESIS / V6';
  const footer=document.querySelector('.meta-foot span');
  if(footer)footer.textContent='HOLONAV / S.E.N.S.E. POLY · V6 · ANCHORED KEYS';
  document.title='S.E.N.S.E. POLY — HoloNav V6 Anchored Keyboard';
})();
