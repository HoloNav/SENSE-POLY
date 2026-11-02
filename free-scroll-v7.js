/* S.E.N.S.E. POLY V7 — free-scroll page / one fixed keyboard dock.
 * Presentation-only enhancement: move the existing, event-wired keyboards,
 * never clone them. Leave the audio engine and pattern data untouched. */
'use strict';
(() => {
  if (typeof VARIANT !== 'string' || VARIANT !== 'A') return;

  const synthKeys = document.querySelector('.synth-layout > .performance-strip');
  const seqKeys = document.querySelector('.seq-panel > .seq-key-deck');
  const transport = document.querySelector('.transport-dock');
  const nav = document.querySelector('.instrument > .workspace-tabs');
  const main = document.querySelector('.seq-panel .seq-v5-main');
  const studio = document.querySelector('.seq-panel .seq-v5-studio');
  const preset = studio?.querySelector('.seq-preset-bar');
  const launcher = studio?.querySelector('.pattern-launcher');
  const overview = main?.querySelector('.seq-v5-overview');

  if (!synthKeys || !seqKeys || !transport || !nav ||
      !main || !studio || !preset || !launcher || !overview) {
    console.error('S.E.N.S.E. POLY V7: expected V5/V6 controls were not found.');
    return;
  }

  // The transport is deliberately normal document content in V7.
  // Its Play/Stop/Panic and tempo dial keep their original event bindings.
  nav.after(transport);

  // Bank / pattern selection should sit above the 32-step overview.
  const patternControls = document.createElement('section');
  patternControls.className = 'v7-pattern-controls';
  patternControls.setAttribute('aria-label','Pattern selector');
  patternControls.append(preset,launcher);
  main.insertBefore(patternControls,overview);

  // Move original two keyboard modules into ONE permanently mounted dock.
  // No duplicate IDs, and existing pointer / audio / record handlers survive.
  const dock = document.createElement('aside');
  dock.className = 'v7-keyboard-dock';
  dock.setAttribute('aria-label','Fixed performance keyboard');
  synthKeys.dataset.v7Workspace = 'synth';
  seqKeys.dataset.v7Workspace = 'seq';
  dock.append(synthKeys,seqKeys);
  document.body.appendChild(dock);

  function showKeyboard(name) {
    synthKeys.classList.toggle('hidden', name !== 'synth');
    seqKeys.classList.toggle('hidden', name !== 'seq');
    dock.dataset.workspace = name;
  }

  const previousSwitchWorkspace = switchWorkspace;
  switchWorkspace = function(name) {
    previousSwitchWorkspace(name);
    showKeyboard(name);
    // Switching tabs starts at their top, while ordinary document scrolling
    // remains unlocked and the dock stays in place.
    window.scrollTo(0,0);
  };
  showKeyboard(document.querySelector('.workspace-screen:not(.hidden)')?.dataset.workspace || 'synth');

  const tagline=document.querySelector('.logo small');
  if(tagline)tagline.textContent='HOLONAV · FREE-SCROLL STUDIO / V7';
  const footer=document.querySelector('.meta-foot span');
  if(footer)footer.textContent='HOLONAV / S.E.N.S.E. POLY · V7 · FIXED KEYS / FREE PAGE';
  document.title='S.E.N.S.E. POLY — HoloNav V7 Free-Scroll Studio';
})();
