# Pocket Jam Piano — Hybrid Tablet Edition

A touch-first piano improvisation companion combining the clean **Pocket Jam** interface with a **Smart Progression Generator**, **Tap-to-Swap Chord Touch Palette**, and a **15-Scale Compatibility Engine**.

## Core Features

1. **Pure Chord Symbols for the Left Hand ([`App.tsx`](src/App.tsx))**
   - Left-hand chord tiles display clean, high-contrast **Chord Symbols** (`Dm7`, `G7`, `Cmaj7`, `Am7`) with a 1-tap global flavor switcher (`Triads` | `7ths` | `9ths / Lush`).
   - Tapping any chord tile plays a preview, marks its tones (`★`) on the Right-Hand scale keys, and immediately opens the **Swap / Customize Chord Touch Palette** ([`ChordSwapDrawer.tsx`](src/components/ChordSwapDrawer.tsx)):
     - **1. Smart Swap**: 1-tap replacement chords grouped into *In-Key (Diatonic)*, *Borrowed & Soulful (Modal Interchange)*, and *Spicy Turnarounds*.
     - **2. Root & Flavor**: Full 12-Root × 20-Quality picker (`maj`, `m`, `7`, `maj7`, `m7`, `m9`, `maj9`, `9`, `13`, `sus4`, `sus2`, `add9`, `6`, `m6`, `m7♭5`, `dim7`, `7♭9`, `7♯9`, `7alt`).
     - **3. Peek Keys**: Optional visual Left-Hand keyboard (`Root Pos`, `1st Inv`, `2nd Inv`, `1-3-7 Shell`) when you want to check notes or fingerings.

2. **Smart Progression Generator ([`generateSmartProgression`](src/engine/musicTheory.ts))**
   - Filter by style (`Lo-Fi & Chill`, `Neo-Soul & R&B`, `Jazz & Bossa`, `Pop & Indie`, `Blues & Gospel`, `Cinematic & Minor`, `Rock & Funk`) and tap **Generate Chords** or **Random Jam** for fresh progressions.

3. **15-Scale Library with Live Compatibility Badges ([`ScaleBrowser.tsx`](src/components/ScaleBrowser.tsx))**
   - Evaluates all 15 scales against your current Left-Hand chords in real time:
     - 🟢 **Safe / Bulletproof** — High chord-tone match, zero harsh clashes
     - 🔵 **Colorful / Modal** — Adds signature modal or blues character
     - 🟣 **Spicy / Tension** — Outside jazz/exotic tension notes

4. **3 Live Tablet Layouts to Compare**
   - Switch anytime in the top bar between:
     - **`1. Split Stage`** (2-Column Side-by-Side)
     - **`2. Top Chords + Wide Keys`** (4 Chord Tiles across top + 2-Octave Wide Keyboard below)
     - **`3. Focus View`** (Oversized Stage Lead-Sheet Chords + Clean Scale Keyboard)
