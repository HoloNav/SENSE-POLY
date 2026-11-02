/* S.E.N.S.E. POLY V5 — Quick Pattern Launcher / Landscape studio.
   UI-only enhancement. Preserves V4 audio, step recording, synth parameters,
   localStorage project format and the existing pattern-switch behavior. */
'use strict';
(() => {
  if (typeof VARIANT !== 'string' || VARIANT !== 'A') return;
  const panel = document.querySelector('.seq-view .seq-panel');
  const keys = panel?.querySelector('.seq-key-deck');
  const preset = panel?.querySelector('.seq-preset-bar');
  const label = panel?.querySelector('.full-grid-label');
  const grid = panel?.querySelector('#grid');
  const modes = panel?.querySelector('.seq-modes');
  const panels = [...(panel?.querySelectorAll('.seq-subpanel') || [])];
  if (!panel || !keys || !preset || !label || !grid || !modes || panels.length !== 3) {
    console.warn('S.E.N.S.E. POLY V5: original sequencer layout not found.');
    return;
  }

  // Reflow existing controls rather than cloning them; IDs and event handlers
  // remain unique, and keyboard / LIVE REC retain their existing behavior.
  const main = document.createElement('div');
  main.className = 'seq-v5-main';
  const overview = document.createElement('div');
  overview.className = 'seq-v5-overview';
  overview.append(label,grid);
  const studio = document.createElement('div');
  studio.className = 'seq-v5-studio';

  const launcher = document.createElement('section');
  launcher.className = 'pattern-launcher';
  launcher.setAttribute('aria-label','Quick pattern selector');
  launcher.innerHTML = `
    <div class="pattern-row pattern-banks">
      <span class="pattern-row-label">BANK</span>
      ${Array.from({length:8},(_,i)=>`<button type="button" class="pattern-pick" data-choose-bank="${i}" aria-label="Select bank ${String.fromCharCode(65+i)}" aria-pressed="false">${String.fromCharCode(65+i)}<i class="pattern-led"></i></button>`).join('')}
    </div>
    <div class="pattern-row pattern-slots">
      <span class="pattern-row-label">PATTERN</span>
      ${Array.from({length:8},(_,i)=>`<button type="button" class="pattern-pick" data-choose-slot="${i}" aria-label="Select pattern ${i+1}" aria-pressed="false">${i+1}<i class="pattern-led"></i></button>`).join('')}
    </div>
    <div class="pattern-footer"><span id="pattern-current">A1</span><span>8 BANKS × 8 PATTERNS</span></div>`;

  studio.append(preset,launcher,modes,...panels);
  main.append(overview,studio);
  panel.insertBefore(main,keys);

  const originalRefreshSeq = refreshSeq;
  function paintLauncher() {
    const slots = launcher.querySelectorAll('[data-choose-slot]');
    const banks = launcher.querySelectorAll('[data-choose-bank]');
    banks.forEach((btn,i)=>{
      const active = bank === i;
      btn.classList.toggle('selected',active);
      btn.classList.toggle('occupied',patterns.slice(i*8,i*8+8).some(p=>p.steps.slice(0,p.length).some(s=>!s.rest)));
      btn.setAttribute('aria-pressed',String(active));
    });
    slots.forEach((btn,i)=>{
      const active = slot === i;
      const p = patterns[bank*8+i];
      btn.classList.toggle('selected',active);
      btn.classList.toggle('occupied',p.steps.slice(0,p.length).some(s=>!s.rest));
      btn.setAttribute('aria-pressed',String(active));
    });
    const current = launcher.querySelector('#pattern-current');
    if(current)current.textContent = `${String.fromCharCode(65+bank)}${slot+1}` + (dirty?' · EDITED':'');
  }
  refreshSeq = function() {
    originalRefreshSeq();
    paintLauncher();
  };
  launcher.addEventListener('click',e=>{
    const b=e.target.closest('.pattern-pick');
    if(!b)return;
    e.preventDefault();
    e.stopPropagation();
    const targetBank=b.dataset.chooseBank!==undefined?Number(b.dataset.chooseBank):bank;
    const targetSlot=b.dataset.chooseSlot!==undefined?Number(b.dataset.chooseSlot):slot;
    if(targetBank===bank && targetSlot===slot)return;
    const wasPlaying=isPlaying;
    // Preserve the established V3/V4 behavior: changing pattern stops
    // playback rather than causing an abrupt mid-note change.
    const bankSelect=document.querySelector('#bank'),slotSelect=document.querySelector('#slot');
    bankSelect.value=targetBank;
    slotSelect.value=targetSlot;
    slotSelect.dispatchEvent(new Event('change',{bubbles:true}));
    if(typeof refreshDials==='function')refreshDials();
    showStatus(`PATTERN ${String.fromCharCode(65+targetBank)}${targetSlot+1} ${wasPlaying?'· PRESS PLAY':'· READY'}`);
    paintLauncher();
  });
  paintLauncher();

  const logo=document.querySelector('.logo small');
  if(logo)logo.textContent='HOLONAV · ORBITAL SYNTHESIS / V5';
  const foot=document.querySelector('.meta-foot span');
  if(foot)foot.textContent='HOLONAV / S.E.N.S.E. POLY · V5 · BROWSER PREVIEW';
  document.title='S.E.N.S.E. POLY — HoloNav V5 Pattern Studio';
})();