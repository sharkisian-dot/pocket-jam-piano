import React, { useState } from 'react';
import {
  NoteName,
  ResolvedScaleNote,
  midiToNoteName,
} from '../engine/musicTheory';
import { pianoSynth } from '../engine/pianoSynth';

interface RightHandKeyboardProps {
  scaleNotes: ResolvedScaleNote[];
  activeChordNotes?: NoteName[];
  activeChordSymbol?: string;
  showDegrees: boolean;
  wideTwoOctaves?: boolean;
}

interface PianoKeyDef {
  midi: number;
  note: NoteName;
  isBlack: boolean;
  whiteIndex: number;
}

// 17 keys: C4 (60) to E5 (76) -> 10 white keys (C, D, E, F, G, A, B, C, D, E)
const RH_KEYS_COMPACT: PianoKeyDef[] = [
  { midi: 60, note: 'C', isBlack: false, whiteIndex: 0 },
  { midi: 61, note: 'C#', isBlack: true, whiteIndex: 0 },
  { midi: 62, note: 'D', isBlack: false, whiteIndex: 1 },
  { midi: 63, note: 'Eb', isBlack: true, whiteIndex: 1 },
  { midi: 64, note: 'E', isBlack: false, whiteIndex: 2 },
  { midi: 65, note: 'F', isBlack: false, whiteIndex: 3 },
  { midi: 66, note: 'F#', isBlack: true, whiteIndex: 3 },
  { midi: 67, note: 'G', isBlack: false, whiteIndex: 4 },
  { midi: 68, note: 'Ab', isBlack: true, whiteIndex: 4 },
  { midi: 69, note: 'A', isBlack: false, whiteIndex: 5 },
  { midi: 70, note: 'Bb', isBlack: true, whiteIndex: 5 },
  { midi: 71, note: 'B', isBlack: false, whiteIndex: 6 },
  { midi: 72, note: 'C', isBlack: false, whiteIndex: 7 },
  { midi: 73, note: 'C#', isBlack: true, whiteIndex: 7 },
  { midi: 74, note: 'D', isBlack: false, whiteIndex: 8 },
  { midi: 75, note: 'Eb', isBlack: true, whiteIndex: 8 },
  { midi: 76, note: 'E', isBlack: false, whiteIndex: 9 },
];

// 25 keys: C4 (60) to C6 (84) -> 15 white keys (Full 2 Octaves for wide layout)
const RH_KEYS_WIDE: PianoKeyDef[] = [
  ...RH_KEYS_COMPACT,
  { midi: 77, note: 'F', isBlack: false, whiteIndex: 10 },
  { midi: 78, note: 'F#', isBlack: true, whiteIndex: 10 },
  { midi: 79, note: 'G', isBlack: false, whiteIndex: 11 },
  { midi: 80, note: 'Ab', isBlack: true, whiteIndex: 11 },
  { midi: 81, note: 'A', isBlack: false, whiteIndex: 12 },
  { midi: 82, note: 'Bb', isBlack: true, whiteIndex: 12 },
  { midi: 83, note: 'B', isBlack: false, whiteIndex: 13 },
  { midi: 84, note: 'C', isBlack: false, whiteIndex: 14 },
];

export const RightHandKeyboard: React.FC<RightHandKeyboardProps> = ({
  scaleNotes,
  activeChordNotes = [],
  activeChordSymbol,
  showDegrees,
  wideTwoOctaves = false,
}) => {
  const [pressedMidi, setPressedMidi] = useState<number | null>(null);

  const keys = wideTwoOctaves ? RH_KEYS_WIDE : RH_KEYS_COMPACT;
  const whiteKeys = keys.filter((k) => !k.isBlack);
  const blackKeys = keys.filter((k) => k.isBlack);
  const totalWhiteKeys = whiteKeys.length;

  const scaleMap = new Map<NoteName, ResolvedScaleNote>();
  scaleNotes.forEach((s) => scaleMap.set(s.note, s));

  const chordNoteSet = new Set<NoteName>(activeChordNotes);

  const handleKeyPress = (midi: number) => {
    setPressedMidi(midi);
    pianoSynth.playNote(midi, 0.75, 0.24);
    window.setTimeout(() => {
      setPressedMidi((prev) => (prev === midi ? null : prev));
    }, 220);
  };

  return (
    <div className="relative w-full select-none" data-testid="right-hand-keyboard">
      {/* Piano Keybed Container */}
      <div className="relative h-40 sm:h-52 w-full bg-slate-950 p-1.5 sm:p-2 rounded-2xl border border-slate-800 shadow-inner overflow-hidden">
        {/* White Keys Layer */}
        <div
          style={{
            gridTemplateColumns: `repeat(${totalWhiteKeys}, minmax(0, 1fr))`,
          }}
          className="grid gap-1 h-full w-full"
        >
          {whiteKeys.map((k) => {
            const scaleInfo = scaleMap.get(k.note);
            const isInScale = Boolean(scaleInfo);
            const isRoot = Boolean(scaleInfo?.isRoot);
            const isBlue = Boolean(scaleInfo?.isBlueNote);
            const isChordTone = chordNoteSet.has(k.note);
            const isPressed = pressedMidi === k.midi;

            let keyBg = 'bg-slate-200/75 hover:bg-white text-slate-400';
            if (isRoot) {
              keyBg =
                'bg-amber-300 hover:bg-amber-200 text-slate-950 ring-2 ring-amber-400/90';
            } else if (isBlue) {
              keyBg =
                'bg-fuchsia-200 hover:bg-fuchsia-100 text-slate-950 ring-1 ring-fuchsia-400/70';
            } else if (isInScale) {
              keyBg = 'bg-sky-200 hover:bg-sky-100 text-slate-950';
            }

            return (
              <button
                key={k.midi}
                type="button"
                onPointerDown={() => handleKeyPress(k.midi)}
                aria-label={`Right hand key ${k.note}${isRoot ? ' (Scale Root)' : isInScale ? ' (In Scale)' : ''}`}
                className={`relative flex flex-col items-center justify-end pb-2.5 rounded-b-xl transition-transform duration-75 focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer ${keyBg} ${
                  isPressed ? 'scale-[0.97] brightness-95' : ''
                }`}
              >
                {/* Chord Tone ★ indicator when a Left-Hand chord is active */}
                {isChordTone && isInScale && (
                  <span
                    title={`Matches ${activeChordSymbol || 'active chord'}`}
                    className="mb-auto mt-16 sm:mt-20 px-1.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-600/40 text-[10px] font-mono font-extrabold text-emerald-900"
                  >
                    ★
                  </span>
                )}

                {/* Scale Marker Badge at bottom of white key */}
                {isInScale ? (
                  <div className="flex flex-col items-center leading-none gap-1">
                    {showDegrees && (
                      <span
                        className={`text-[10px] sm:text-[11px] font-mono font-extrabold ${
                          isRoot
                            ? 'text-amber-950'
                            : isBlue
                              ? 'text-fuchsia-950'
                              : 'text-sky-950'
                        }`}
                      >
                        {isRoot ? 'ROOT' : scaleInfo?.degreeLabel}
                      </span>
                    )}
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-xs sm:text-sm font-extrabold shadow-sm ${
                        isRoot
                          ? 'bg-amber-500 text-slate-950'
                          : isBlue
                            ? 'bg-fuchsia-600 text-white'
                            : 'bg-sky-600 text-white'
                      }`}
                    >
                      {k.note}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500/70">
                    {k.note === 'C' ? `C${Math.floor(k.midi / 12) - 1}` : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Black Keys Layer */}
        {blackKeys.map((k) => {
          const scaleInfo = scaleMap.get(k.note);
          const isInScale = Boolean(scaleInfo);
          const isRoot = Boolean(scaleInfo?.isRoot);
          const isBlue = Boolean(scaleInfo?.isBlueNote);
          const isChordTone = chordNoteSet.has(k.note);
          const isPressed = pressedMidi === k.midi;

          const whiteWidthPct = 100 / totalWhiteKeys;
          const blackWidthPct = whiteWidthPct * 0.66;
          const leftPct = (k.whiteIndex + 1) * whiteWidthPct - blackWidthPct / 2;

          let blackStyle =
            'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-500';
          if (isRoot) {
            blackStyle =
              'bg-amber-400 hover:bg-amber-300 border-2 border-amber-100 text-slate-950 shadow-lg';
          } else if (isBlue) {
            blackStyle =
              'bg-fuchsia-500 hover:bg-fuchsia-400 border-2 border-fuchsia-200 text-white shadow-lg';
          } else if (isInScale) {
            blackStyle =
              'bg-sky-500 hover:bg-sky-400 border-2 border-sky-200 text-slate-950 shadow-lg';
          }

          return (
            <button
              key={k.midi}
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleKeyPress(k.midi);
              }}
              aria-label={`Right hand key ${midiToNoteName(k.midi)}${isRoot ? ' (Scale Root)' : isInScale ? ' (In Scale)' : ''}`}
              style={{
                left: `${leftPct}%`,
                width: `${blackWidthPct}%`,
              }}
              className={`absolute top-1.5 sm:top-2 h-[58%] z-10 rounded-b-lg flex flex-col items-center justify-end pb-2 transition-transform duration-75 focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer ${blackStyle} ${
                isPressed ? 'scale-[0.96]' : ''
              }`}
            >
              {isChordTone && isInScale && (
                <span className="text-[10px] font-mono font-bold leading-none mb-0.5">
                  ★
                </span>
              )}
              {isInScale && (
                <div className="flex flex-col items-center leading-none">
                  {showDegrees && (
                    <span className="text-[9px] font-mono font-extrabold opacity-90 mb-0.5">
                      {isRoot ? 'R' : scaleInfo?.degreeLabel}
                    </span>
                  )}
                  <span className="font-mono text-xs sm:text-sm font-extrabold tracking-tight">
                    {k.note}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend Bar */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-500">Scale Notes:</span>
          <span className="text-slate-100 font-bold">
            {scaleNotes.map((s) => s.note).join(' – ')}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
          <span className="text-amber-400 font-semibold">■ Root</span>
          <span className="text-sky-400 font-semibold">■ Scale Tone</span>
          {scaleNotes.some((s) => s.isBlueNote) && (
            <span className="text-fuchsia-400 font-semibold">■ Blue / Color Note</span>
          )}
          {activeChordSymbol && (
            <span className="text-emerald-400 font-semibold">
              ★ Matches {activeChordSymbol}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
