# S.E.N.S.E. POLY — HoloNav Pattern Studio V5

**[Launch S.E.N.S.E. POLY](https://holonav.github.io/SENSE-POLY/)**

This is the **tabbed** HoloNav orbital-interface synth prototype, now with a one-touch pattern launcher and reworked Android landscape views. It is a functional Web Audio preview rather than a circuit-accurate Behringer Poly D emulation or a native Android synthesizer.

## V5 highlights

- **Pattern launcher:** Eight BANK buttons **A–H** and eight PATTERN buttons **1–8**. Press one of each to access all 64 pattern memories. A colored dot indicates that a bank or pattern contains programmed notes; the selected bank and pattern glow cyan.
- **Pattern switching:** Choosing a different pattern stops playback by design, consistent with the previous drop-down behavior. Press **PLAY** to hear the new pattern. Switching does not erase the old pattern.
- **Landscape:** Synth controls and a taller keyboard sit side by side. On the sequencer, the 32-step grid occupies the left, with quick pattern selection and step editing on the right. A recording keyboard runs across the bottom.
- **Portrait:** The pattern launcher sits above the 32-step grid, and the sequencer keyboard remains available beneath the editing controls.
- **Record workflow:** Arm STEP REC and tap keys to add notes one step at a time. Arm LIVE REC, press PLAY, and tap keys to overdub notes at quantized playback positions. Holding a note sets a gate value up to one step (not a full MIDI-length recorder).

## Saving work

Use **MEMORY → SAVE PATTERN** to save locally, and **EXPORT** to back up the project as JSON. Save functions retain eight banks of eight patterns, synth settings, and the selected bank/pattern. Browser storage may be cleared independently of GitHub.

## Implementation

- `index.html`: existing browser synth/audio/sequencer core.
- `holonav.css` + `holonav.js`: V4 HoloNav styling and dedicated sequencer keyboard/recording indicator.
- `pattern-v5.css` + `pattern-v5.js`: V5 pattern selector and responsive layout.
- `tests/v5-smoke.cjs` + GitHub Actions workflow: browser checks at **390×844**, **360×700** and **844×390**, including B3 pattern selection, step 32 editing, keyboard placement, and JavaScript error checks.

**Design identity:** HoloNav deep-space navy, violet, holographic cyan, orbit/navigation accents. Not affiliated with or endorsed by Behringer.
