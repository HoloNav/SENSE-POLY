# S.E.N.S.E. POLY — HoloNav V7 Free-Scroll Studio

**[Launch S.E.N.S.E. POLY](https://holonav.github.io/SENSE-POLY/?v=7)**

Tabbed browser synthesizer prototype in HoloNav's deep-space navy, holographic cyan and violet design. A functional Web Audio preview—not a circuit-accurate Poly D model or native Android build.

## V7: Only the keyboard is fixed

This revision changes the V6 constrained-screen layout at the user's request.

- The **entire webpage scrolls normally** in portrait and landscape. The oscillator/filter/envelope/mod/output knobs, 32-step grid, pattern controls, workspace tabs, and Play/Stop/Panic/Tempo transport are **not fixed**.
- The **keyboard alone remains docked across the bottom**, and its white keys remain large enough to play in landscape.
- The synth's control banks grow vertically instead of being clipped into a short scrolling window. Touches and swipes in the panel area scroll the page; dragging a knob still changes that knob.
- In the sequencer, **pattern-selection buttons A–H / 1–8 appear above the 32-step grid**. The full grid is visible in a roomy four-row layout, followed by step editing controls. The keyboard is fixed below.
- The original, event-wired synth and recording keyboards were *moved* into a shared dock; no duplicate keyboards or sound engines were introduced.
- Swapping between **SYNTH** and **SEQUENCER** automatically switches the dock to the corresponding keyboard.

## Patterns, recording and saved projects

Eight banks (A–H) × eight patterns = 64 pattern memories, with up to 32 steps per pattern. The bank/pattern buttons select slots; choosing another pattern stops playback by design. STEP REC writes a note and advances. LIVE REC plus PLAY quantizes performed notes to the playback step, with gate values up to one step. These recording functions are prototype features.

Use **MEMORY → SAVE PATTERN** to store changes in the browser, and **EXPORT** for a JSON backup. Source-code updates on GitHub do not back up browser storage.

## Files and verification

- `index.html`: original Web Audio engine, sequencer logic, settings and transport.
- `holonav.css` / `holonav.js`: V4 HoloNav styling and sequencer keyboard.
- `pattern-v5.css` / `pattern-v5.js`: V5 64-pattern launcher.
- `keyboard-v6.css` / `keyboard-v6.js`: preserved previous layout.
- `free-scroll-v7.css` / `free-scroll-v7.js`: **current layout**, fixed keyboard only / normal document scroll.
- `tests/v5-smoke.cjs`: mobile-browser regression tests used by the GitHub Actions layout workflow.

The V6 version is preserved as the `backup/v6-anchored-keyboard` branch.

Unaffiliated with, and not endorsed by, Behringer.
