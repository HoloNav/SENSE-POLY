# S.E.N.S.E. POLY — HoloNav V6 Anchored Keyboard

**[Launch S.E.N.S.E. POLY](https://holonav.github.io/SENSE-POLY/)**

Selected **tabbed** browser synthesizer prototype, in HoloNav's deep-space navy/cyan/violet interface. This is a functioning Web Audio preview—not a circuit-accurate Poly D clone or native Android app.

## V6: stationary keyboards, scrollable controls

- **SYNTH tab:** In landscape the keyboard occupies the **full width along the bottom**. The control-bank tabs remain visible, and the active controls **scroll independently above the keyboard**. On portrait screens, the existing bottom keyboard also stays in place while the synth controls can scroll.
- **SEQUENCER tab:** Its landscape recording keyboard now has a **120px-high dock** (approximately 74px of playable white-key height on an 844×390 simulated phone). The 32-step grid stays to the left of the pattern/editor area, but both editor and grid move in a **separately scrollable content region above the keyboard**.
- **Touch gesture priority:** Knob drags continue to manipulate knobs; swipe the non-knob panel area to scroll. The **PLAY / STOP / PANIC / TEMPO** transport remains outside and below the keyboard.
- The 32-step pattern grid, all 64 pattern memories, STEP REC, LIVE REC, octave buttons and all audio-engine parameters are unchanged.

## Choose a pattern

Use the **BANK A–H** and **PATTERN 1–8** buttons on the sequencer tab. A lit dot means there are programmed notes. Choosing a new pattern stops playback; press **PLAY** to hear the newly selected pattern. Pattern data is retained.

## Recording

- **STEP REC:** Arm STEP REC, tap a keyboard note to enter a step, and keep entering successive notes. Use REST in the Performance subtab when needed.
- **LIVE REC:** Arm LIVE REC, press PLAY, and perform notes on the sequencer keyboard as the pattern loops. Notes are quantized to steps, and held-key gate length is captured for up to one step.
- This remains a **quantized monophonic overdub preview**. It does not provide full unquantized MIDI recording or automatically join multi-step ties.

## Save your work

Use **MEMORY → SAVE PATTERN** to write to browser local storage. Use **EXPORT** to save a JSON backup. Browser data is not automatically backed up to the GitHub repository.

## Project files

- `index.html`: V3 Web Audio engine, synth controls, sequencer core and transport
- `holonav.css` + `holonav.js`: V4 orbital appearance and sequencer keyboard
- `pattern-v5.css` + `pattern-v5.js`: V5 one-touch pattern selector
- `keyboard-v6.css` + `keyboard-v6.js`: V6 full-width stationary keyboards and scrollable control areas
- `tests/v5-smoke.cjs` + GitHub Actions: Chrome checks at **390×844**, **360×700**, **844×390** and **740×360**, including pattern B3, step 32, hidden-bank visibility, keyboard size/location, independent scrolling and JavaScript errors

The V5 release remains available as the Git branch `backup/v5-pattern-studio`.

**Brand direction:** HoloNav deep-space navy, orbital navigation motifs, violet and holographic cyan. Unaffiliated with Behringer.
