/* S.E.N.S.E. POLY · HoloNav orbital interface V4
 * Adds a sequencer keyboard and visible record workflow without disturbing
 * the existing oscillator, filter, envelopes, pattern memory or audio DSP.
 */
'use strict';
(() => {
  if (typeof VARIANT !== 'string' || VARIANT !== 'A') return;
  const seqPanel = document.querySelector('.seq-view .seq-panel');
  if (!seqPanel) return;
  const keyboardPanel = document.createElement('section');
  keyboardPanel.className = 'seq-key-deck';
  keyboardPanel.setAttribute('aria-label', 'Sequencer keyboard and recording');
  keyboardPanel.innerHTML = `
    <div class="seq-key-top">
      <div class="seq-key-title"><strong>LIVE INPUT</strong><small>QUANTIZED NOTE CAPTURE</small></div>
      <button class="seq-action" data-action="octaveDown" aria-label="Keyboard octave down">− OCT</button>
      <span class="seq-octave" id="seq-octave-readout">C3 — B4</span>
      <button class="seq-action" data-action="octaveUp" aria-label="Keyboard octave up">+ OCT</button>
      <button class="seq-action rec-step" data-action="stepRec">STEP REC</button>
      <button class="seq-action rec-live" data-action="liveRec">● LIVE REC</button>
    </div>
    <div class="seq-key-keys"><div class="keyboard" data-keyboard="seq"></div></div>
    <div class="seq-record-status"><span class="rec-lamp" id="rec-lamp"></span><span id="seq-rec-status">READY · Tap STEP REC to enter notes, or LIVE REC + PLAY to overdub.</span></div>
  `;
  seqPanel.appendChild(keyboardPanel);

  const originalKeyboardMarkup = keyboardMarkup;
  keyboardMarkup = function(el) {
    originalKeyboardMarkup(el);
    const readout = document.querySelector('#seq-octave-readout');
    if (readout && el && el.dataset.keyboard === 'seq') {
      const narrow = window.innerWidth < 720;
      const start = narrow ? 48 + keyboardOctave * 12 : 48;
      const stop = narrow ? start + 23 : 84;
      readout.textContent = midiName(start) + ' — ' + midiName(stop);
    }
  };
  keyboardMarkup(keyboardPanel.querySelector('[data-keyboard="seq"]'));

  const liveHeld = new Map();
  const originalTouchNote = touchNote;
  touchNote = function(note,down) {
    if (down && !pressed.has(note) && modeRec === 'live' && isPlaying && playingStep >= 0) {
      const p = pattern();
      const step = Math.min(p.length - 1, playingStep);
      liveHeld.set(note, { stepRef:p.steps[step], start:performance.now(), seconds:seqInterval(p,step) });
    }
    originalTouchNote(note,down);
    if (!down && liveHeld.has(note)) {
      const recorded = liveHeld.get(note);
      liveHeld.delete(note);
      const duration = Math.max(0,performance.now() - recorded.start) / 1000;
      if (recorded.stepRef) {
        recorded.stepRef.gate = clamp(duration / recorded.seconds,0.1,1);
        dirty = true;
        refreshSeq();
      }
    }
  };

  const originalRefreshSeq = refreshSeq;
  refreshSeq = function() {
    originalRefreshSeq();
    const lamp = document.querySelector('#rec-lamp');
    const status = document.querySelector('#seq-rec-status');
    if (!status || !lamp) return;
    lamp.classList.toggle('armed',modeRec !== 'off');
    lamp.classList.toggle('capturing',modeRec === 'live' && isPlaying);
    status.textContent = modeRec === 'step'
      ? 'STEP REC ARMED · Tap a key to write a note and advance. REST inserts silence.'
      : modeRec === 'live'
        ? isPlaying
          ? '● RECORDING · Play notes into the current step. Hold to set gate length.'
          : '● LIVE REC ARMED · Press PLAY to begin quantized overdub.'
        : 'READY · STEP REC enters notes; LIVE REC + PLAY overdubs the loop.';
  };
  refreshSeq();

  // Brand cue: an instrument in the HoloNav navigation family, not a remade
  // copy of the hardware's wood-and-metal enclosure.
  const tagline = document.querySelector('.logo small');
  if (tagline) tagline.textContent = 'HOLONAV · DEEP SPACE SYNTHESIS / V4';
  const sigil = document.querySelector('.logo .sigil');
  if (sigil) { sigil.textContent = '◎'; sigil.setAttribute('aria-label','HoloNav orbital mark'); }
  const foot = document.querySelector('.meta-foot span');
  if (foot) foot.textContent = 'HOLONAV / S.E.N.S.E. POLY · V4 · BROWSER PREVIEW';
  document.title = 'S.E.N.S.E. POLY — HoloNav Orbital Interface V4';
})();
