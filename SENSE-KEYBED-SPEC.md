# S.E.N.S.E. Signature Keybed — Design Standard v1

**Purpose:** Give future S.E.N.S.E. synthesizers a recognizable, consistent playable keyboard, independent of the sound engine or instrument color scheme. V8 is the first implementation in **S.E.N.S.E. POLY**.

## Key geometry and note range

- **Three full chromatic octaves** plus their ending tonic: **C3 → C6** (37 semitone positions; 22 white keys and 15 black keys). The 37th key is the terminal C that visually marks the end of the third octave, as on the ACID-08 style piano.
- **White-key width:** 54 CSS pixels.
- **Black-key width:** 29 CSS pixels, centered over the gap between adjacent whites.
- **Playable white-key height:** 132 CSS pixels, excluding the 1-pixel rail border.
- **Black-key height:** 62% of white-key height.
- White keys are natural ivory/gray; black keys are deep graphite. Accent/pressed color may reflect each instrument's identity (HoloNav uses holographic cyan).
- **Every key is visibly labeled** using standard note names with octave numbers: C3, C#3, D3, D#3, ... B5, C6. This includes every black key.

## Behavior

- Render **all 37 notes**, not an abridged phone-specific range.
- Keep physical key widths fixed across screen orientation; do not squeeze the whole piano to fit narrower screens.
- The full keybed occupies **1,188 CSS pixels** (22 × 54px). A phone uses a horizontally scrollable rail and octave +/- controls to access the rest.
- Keep the keybed **anchored to the bottom** while instrument controls, step pads, preset selection and transport scroll naturally above it.
- Preserve press/hold and release. Dragging horizontally within the keybed scrolls to reveal further notes; initial note input is cancelled when the movement becomes a swipe.
- All keyboard instances in one instrument should have matching geometry, labels, range and octave state, whether used for playing, step entry or live recording.
- **Default range:** C3–C6; octave controls shift the entire three-octave window by twelve semitones.
- Maintain accessible button labels for screen readers and users who prefer keyboard navigation.

## Source and integration

In **HoloNav/SENSE-POLY**:
- `sense-keybed-v8.css` holds the geometry, appearance, touch-rail and responsive dock sizing.
- `sense-keybed-v8.js` renders the notes and labels, updates octave readouts, and adds horizontal swipe support.
- The existing S.E.N.S.E. POLY sound, transport and recording engines remain authoritative; the keybed only changes the input surface.

The proportions and label placement are adapted from the **ACID-08 v1.3.9 keyboard source**. That ACID-08 source renders C2 through C4 (two full octaves plus ending C). The S.E.N.S.E. standard deliberately extends this to three full octaves plus ending C for future instruments.

**Note:** The current V8 JavaScript is integrated with S.E.N.S.E. POLY globals. Reuse the **design specification** in other apps; extract/generalize the renderer and event interface when building a new synth rather than copying its POLY-specific globals unchanged.
