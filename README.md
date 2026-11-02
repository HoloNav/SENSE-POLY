# S.E.N.S.E. POLY — HoloNav Orbital Interface V4

[**Launch the live synthesizer**](https://holonav.github.io/SENSE-POLY/)

This is the selected **tabbed** interface prototype for S.E.N.S.E. POLY, now using HoloNav's deep-space, cyan-and-violet navigation-console design. It remains a Web Audio prototype, not a circuit-accurate Poly D emulation or native Android instrument.

## Workspaces

- **SYNTH + KEYS:** Five synth-control banks (OSC, FILTER, ENVELOPES, MOD/PERF, OUTPUT) with playable keyboard always visible.
- **SEQUENCER:** All 32 steps on one page, bank/pattern memory (eight banks × eight slots), step editing, a second touch keyboard, and visible STEP REC and LIVE REC controls.
- Persistent **PLAY / STOP / PANIC** transport and a live TEMPO knob.

## Recording patterns

**Step recording:** Open SEQUENCER, select the starting step, tap **STEP REC**, then play notes on the sequencer keyboard. Each note fills the current step and advances to the next. Use **REST** in the Performance subtab to enter a rest, then tap STEP REC again to disarm.

**Live recording:** Open SEQUENCER, tap **LIVE REC**, then **PLAY**. Perform notes on the sequencer keyboard while the loop plays. Notes are written to the currently playing step; releasing keys captures gate duration up to one step. Tap LIVE REC again to disarm. The active REC lamp and status text indicate the current mode.

**Important:** This is a **quantized monophonic overdub preview**, not an exact recreation of the hardware's recording commands. Held notes beyond one step are capped at a one-step gate; multistep ties are still edited manually. Existing pattern data is retained and save/export operations remain available.

## Development

- `index.html` — existing V3 instrument core, audio engine and pattern memory, now loading V4 enhancements
- `holonav.css` — HoloNav orbital interface / responsive styling
- `holonav.js` — additional sequencer keyboard, recording status, gate-length capture, V4 branding

The original V3 core remains in the commit history for safe rollback.

**Brand direction:** Deep-space navy, cyan holographic accents, purple/violet orbital details and thin navigation-line visual language; HoloNav-inspired rather than a copy of the hardware enclosure. Unaffiliated with Behringer.
