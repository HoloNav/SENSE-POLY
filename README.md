# S.E.N.S.E. POLY — HoloNav V8 Signature Keybed

**[Launch S.E.N.S.E. POLY V8](https://holonav.github.io/SENSE-POLY/?v=8)**

A Poly D-inspired browser synthesizer prototype with HoloNav's deep-space navy, cyan and violet interface. It is a functional Web Audio preview, not a circuit-accurate hardware emulation or native Android synthesizer.

## V8 — S.E.N.S.E. Keybed

A consistent playable piano design for future **S.E.N.S.E.** software instruments.

- **Three complete octaves plus ending C:** **C3–C6** (37 labeled semitone positions, 22 white keys and 15 black keys). Every key—including black keys—shows its note.
- **White keys:** 54 CSS px wide and 132 CSS px of visible playable height. **Black keys:** 29 CSS px wide and 62% tall. These fixed proportions stay identical on the SYNTH and SEQUENCER tabs.
- **ACID-08-style piano:** rounded lower key edges, ivory/graphite key faces and direct black-key overlays. S.E.N.S.E. POLY retains HoloNav cyan/violet accents when pressed.
- **Constant finger-friendly dimensions** across portrait and landscape; the full 1,188px keyboard is **horizontally scrollable** on narrower screens rather than squashed to fit.
- **Fixed bottom keyboard:** The rest of the entire page, including synth controls, pattern pads, workspaces and transport, continues to scroll normally.
- **Octave controls:** OCT + / – shift the same three-octave keyboard range in both workspaces. The visible range readouts update.
- No audio-engine, sequencer or recording logic was changed for V8.

See **[S.E.N.S.E. Keybed Design Standard](SENSE-KEYBED-SPEC.md)** for geometry and behaviors to keep consistent across future synth projects.

## Sequencing and recording

The sequencer still offers 32 steps visible together, **eight banks A–H** and **eight patterns per bank** (64 pattern memories). Changing patterns stops playback intentionally; press PLAY to start the selected pattern.

- **STEP REC:** Select a starting step, arm recording and tap piano notes. Each entered note advances the selected step.
- **LIVE REC:** Arm recording, press PLAY, then perform notes on the sequencer keyboard. They quantize to the running step. Held notes can set gates up to one step.
- Save via **MEMORY → SAVE PATTERN** to browser storage; export a JSON project for an independent backup.

These remain prototype recording functions rather than a full MIDI recorder.

## Source and verification

- `index.html` — original synth/audio/sequencer core
- `holonav.css` / `holonav.js` — HoloNav theme and sequencer key input
- `pattern-v5.css` / `pattern-v5.js` — 64-pattern selector
- `free-scroll-v7.css` / `free-scroll-v7.js` — normal page scrolling with keyboard dock
- `sense-keybed-v8.css` / `sense-keybed-v8.js` — **current signature keybed**
- `tests/v5-smoke.cjs` and `tests/v8-keybed.cjs` — Chrome tests at portrait 390×844 and 360×700, landscape 844×390 and 740×360, checking keyboard dimensions, labels, octave shifting, pattern controls and page scrolling

Previous V7 state is preserved as the GitHub branch `backup/v7-free-scroll-studio`.

Inspired by classic synth hardware workflows; unaffiliated with Behringer.
