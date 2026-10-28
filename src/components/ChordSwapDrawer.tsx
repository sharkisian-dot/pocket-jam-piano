import React, { useState } from 'react';
import {
  ALL_NOTES,
  CHORD_QUALITIES,
  ChordQuality,
  getChordSwapSuggestions,
  getNoteIndex,
  HarmonicFlavor,
  JamChordSlot,
  NoteName,
  ResolvedChord,
  VoicingType,
} from '../engine/musicTheory';
import { pianoSynth } from '../engine/pianoSynth';
import { Eye, Plus, Sliders, Sparkles, Trash2, Volume2, X } from 'lucide-react';

interface ChordSwapDrawerProps {
  slotIndex: number;
  totalSlots: number;
  keyRoot: NoteName;
  flavor: HarmonicFlavor;
  chord: ResolvedChord;
  selectedVoicingId: VoicingType;
  onSelectVoicing: (id: VoicingType) => void;
  onUpdateSlot: (index: number, updated: Partial<JamChordSlot>) => void;
  onAddSlotAfter: (index: number) => void;
  onRemoveSlot: (index: number) => void;
  onClose: () => void;
}

type DrawerTab = 'smart_swap' | 'custom_chord' | 'peek_keys';

interface LHKeyDef {
  midi: number;
  note: NoteName;
  isBlack: boolean;
  whiteIndex: number;
}

const LH_KEYS: LHKeyDef[] = [
  { midi: 48, note: 'C', isBlack: false, whiteIndex: 0 },
  { midi: 49, note: 'C#', isBlack: true, whiteIndex: 0 },
  { midi: 50, note: 'D', isBlack: false, whiteIndex: 1 },
  { midi: 51, note: 'Eb', isBlack: true, whiteIndex: 1 },
  { midi: 52, note: 'E', isBlack: false, whiteIndex: 2 },
  { midi: 53, note: 'F', isBlack: false, whiteIndex: 3 },
  { midi: 54, note: 'F#', isBlack: true, whiteIndex: 3 },
  { midi: 55, note: 'G', isBlack: false, whiteIndex: 4 },
  { midi: 56, note: 'Ab', isBlack: true, whiteIndex: 4 },
  { midi: 57, note: 'A', isBlack: false, whiteIndex: 5 },
  { midi: 58, note: 'Bb', isBlack: true, whiteIndex: 5 },
  { midi: 59, note: 'B', isBlack: false, whiteIndex: 6 },
  { midi: 60, note: 'C', isBlack: false, whiteIndex: 7 },
  { midi: 61, note: 'C#', isBlack: true, whiteIndex: 7 },
  { midi: 62, note: 'D', isBlack: false, whiteIndex: 8 },
  { midi: 63, note: 'Eb', isBlack: true, whiteIndex: 8 },
  { midi: 64, note: 'E', isBlack: false, whiteIndex: 9 },
  { midi: 65, note: 'F', isBlack: false, whiteIndex: 10 },
  { midi: 66, note: 'F#', isBlack: true, whiteIndex: 10 },
  { midi: 67, note: 'G', isBlack: false, whiteIndex: 11 },
];

const TOTAL_LH_WHITE = 12;

export const ChordSwapDrawer: React.FC<ChordSwapDrawerProps> = ({
  slotIndex,
  totalSlots,
  keyRoot,
  flavor,
  chord,
  selectedVoicingId,
  onSelectVoicing,
  onUpdateSlot,
  onAddSlotAfter,
  onRemoveSlot,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('smart_swap');
  const [pressedMidi, setPressedMidi] = useState<number | null>(null);

  const suggestions = React.useMemo(
    () => getChordSwapSuggestions(keyRoot, flavor),
    [keyRoot, flavor]
  );

  const currentVoicing =
    chord.voicings.find((v) => v.id === selectedVoicingId) || chord.voicings[0];

  const normalizedMidiNotes = currentVoicing.midiNotes.map((m) => {
    if (m < 48) return m + 12;
    if (m > 67) return m - 12;
    return m;
  });

  const fingerParts = currentVoicing.lhFingers.split('–').map((s) => s.trim());
  const midiToFinger = new Map<number, string>();
  normalizedMidiNotes.forEach((m, idx) => {
    midiToFinger.set(m, fingerParts[idx] || '');
  });

  const activeMidiSet = new Set<number>(normalizedMidiNotes);
  const whiteKeys = LH_KEYS.filter((k) => !k.isBlack);
  const blackKeys = LH_KEYS.filter((k) => k.isBlack);

  const handlePlayChord = () => {
    pianoSynth.playChord(normalizedMidiNotes, 26);
  };

  const handleSelectRootNote = (newRoot: NoteName) => {
    const keyIdx = getNoteIndex(keyRoot);
    const newRootIdx = getNoteIndex(newRoot);
    const offset = (((newRootIdx - keyIdx) % 12) + 12) % 12;
    const romanByOffset = [
      'I',
      '♭II',
      'II',
      '♭III',
      'III',
      'IV',
      '♯IV',
      'V',
      '♭VI',
      'VI',
      '♭VII',
      'VII',
    ];
    onUpdateSlot(slotIndex, {
      rootOffset: offset,
      degreeRoman: romanByOffset[offset] || 'I',
    });
    const baseMidi = 48 + newRootIdx;
    const intervals = CHORD_QUALITIES[chord.quality].intervals.slice(0, 4);
    pianoSynth.playChord(
      intervals.map((i) => baseMidi + i),
      24
    );
  };

  const handleSelectQuality = (newQuality: ChordQuality) => {
    onUpdateSlot(slotIndex, {
      baseQuality: newQuality,
      customQualityOverride: newQuality,
    });
    const baseMidi = 48 + getNoteIndex(chord.rootNote);
    const intervals = CHORD_QUALITIES[newQuality].intervals.slice(0, 4);
    pianoSynth.playChord(
      intervals.map((i) => baseMidi + i),
      24
    );
  };

  return (
    <div
      className="mt-3 rounded-2xl bg-slate-950/95 border border-emerald-500/40 p-3.5 sm:p-4 shadow-2xl space-y-3 transition-all"
      data-testid="chord-swap-drawer"
    >
      {/* Top Bar: Active Chord Slot + Quick Notes Pill + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-xs font-mono font-bold text-emerald-300">
            Slot #{slotIndex + 1}
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-white">
            {chord.chordSymbol}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Notes: <strong className="text-emerald-300">{chord.notes.join(' – ')}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePlayChord}
            className="min-h-[36px] px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear</span>
          </button>

          {totalSlots < 8 && (
            <button
              type="button"
              onClick={() => onAddSlotAfter(slotIndex)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Insert another chord after this slot"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Slot</span>
            </button>
          )}

          {totalSlots > 2 && (
            <button
              type="button"
              onClick={() => onRemoveSlot(slotIndex)}
              className="min-h-[36px] px-2 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs transition cursor-pointer"
              title="Delete this chord slot"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chord drawer"
            className="min-h-[36px] min-w-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs: 1. Smart Swap | 2. Custom Root+Quality | 3. Peek Keys */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('smart_swap')}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'smart_swap'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Smart Swap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom_chord')}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'custom_chord'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>2. Root &amp; Flavor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('peek_keys')}
          className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'peek_keys'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>3. Peek Keys</span>
        </button>
      </div>

      {/* TAB 1: SMART SWAP PALETTE (In-Key, Borrowed & Soulful, Spicy Turnarounds) */}
      {activeTab === 'smart_swap' && (
        <div className="space-y-3">
          {(['In-Key (Diatonic)', 'Borrowed & Soulful', 'Spicy Turnarounds'] as const).map(
            (groupName) => {
              const items = suggestions.filter((s) => s.group === groupName);
              return (
                <div key={groupName} className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {groupName}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {items.map((sug) => {
                      const isCurrent =
                        chord.rootOffset === sug.rootOffset &&
                        chord.chordSymbol === sug.previewSymbol;
                      return (
                        <button
                          key={`${sug.degreeRoman}-${sug.rootOffset}`}
                          type="button"
                          onClick={() => {
                            onUpdateSlot(slotIndex, {
                              degreeRoman: sug.degreeRoman,
                              rootOffset: sug.rootOffset,
                              baseQuality: sug.baseQuality,
                              customQualityOverride: undefined,
                            });
                            const rNote = ALL_NOTES[
                              (getNoteIndex(keyRoot) + sug.rootOffset) % 12
                            ];
                            const baseMidi = 48 + getNoteIndex(rNote);
                            const intervals =
                              CHORD_QUALITIES[sug.baseQuality].intervals.slice(0, 4);
                            pianoSynth.playChord(
                              intervals.map((i) => baseMidi + i),
                              24
                            );
                          }}
                          className={`min-h-[54px] p-2 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-500/25 border-emerald-400 text-white ring-1 ring-emerald-400'
                              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-1">
                            <span className="text-sm sm:text-base font-extrabold text-white">
                              {sug.previewSymbol}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              {sug.degreeRoman}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate">
                            {sug.vibeHint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* TAB 2: CUSTOM ROOT + QUALITY PICKER */}
      {activeTab === 'custom_chord' && (
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Chord Root Note
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
              {ALL_NOTES.map((note) => {
                const isSelected = chord.rootNote === note;
                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => handleSelectRootNote(note)}
                    className={`min-h-[38px] rounded-lg font-mono text-xs font-bold border transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Chord Quality / Extension
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {Object.values(CHORD_QUALITIES).map((q) => {
                const isSelected = chord.quality === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleSelectQuality(q.id)}
                    className={`min-h-[44px] px-2.5 py-1.5 rounded-xl border text-left transition flex flex-col justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/25 border-emerald-400 text-white ring-1 ring-emerald-400'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-extrabold text-white">
                      {chord.rootNote}
                      {q.suffix || ' (Maj)'}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {q.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PEEK AT KEYS & INVERSIONS (Only when user wants to inspect notes on keys) */}
      {activeTab === 'peek_keys' && (
        <div className="space-y-3">
          {/* Standard Position Selector Tabs (Root Pos, 1st Inv, 2nd Inv, Shell) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {chord.voicings.map((v) => {
              const isSelected = v.id === currentVoicing.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    onSelectVoicing(v.id);
                    pianoSynth.playChord(v.midiNotes, 25);
                  }}
                  className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{v.shortLabel}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {v.noteNames.join('·')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visual Left-Hand Piano Keys */}
          <div className="relative h-28 sm:h-32 w-full bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-12 gap-0.5 sm:gap-1 h-full w-full">
              {whiteKeys.map((k) => {
                const isActive = activeMidiSet.has(k.midi);
                const isRootNote = k.note === chord.rootNote;
                const finger = midiToFinger.get(k.midi);
                const isPressed = pressedMidi === k.midi;

                let whiteClass = 'bg-slate-200 hover:bg-white text-slate-400';
                if (isActive && isRootNote) {
                  whiteClass =
                    'bg-emerald-300 hover:bg-emerald-200 text-slate-950 ring-2 ring-emerald-400';
                } else if (isActive) {
                  whiteClass = 'bg-emerald-200 hover:bg-emerald-100 text-slate-950';
                }

                return (
                  <button
                    key={k.midi}
                    type="button"
                    onPointerDown={() => {
                      setPressedMidi(k.midi);
                      pianoSynth.playNote(k.midi, 0.9, 0.22);
                      window.setTimeout(() => setPressedMidi(null), 220);
                    }}
                    className={`relative flex flex-col items-center justify-end pb-1.5 rounded-b-md transition-transform duration-100 cursor-pointer ${whiteClass} ${
                      isPressed ? 'scale-[0.97]' : ''
                    }`}
                  >
                    {isActive ? (
                      <div className="flex flex-col items-center leading-none gap-0.5">
                        {finger && (
                          <span className="text-[9px] font-mono font-bold text-emerald-950">
                            f{finger}
                          </span>
                        )}
                        <span
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold ${
                            isRootNote
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 text-emerald-300'
                          }`}
                        >
                          {k.note}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-400/70">
                        {k.note === 'C' ? (k.midi === 48 ? 'C3' : 'C4') : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {blackKeys.map((k) => {
              const isActive = activeMidiSet.has(k.midi);
              const isRootNote = k.note === chord.rootNote;
              const finger = midiToFinger.get(k.midi);
              const isPressed = pressedMidi === k.midi;

              const whiteWidthPct = 100 / TOTAL_LH_WHITE;
              const blackWidthPct = whiteWidthPct * 0.68;
              const leftPct =
                (k.whiteIndex + 1) * whiteWidthPct - blackWidthPct / 2;

              let blackClass =
                'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-500';
              if (isActive && isRootNote) {
                blackClass =
                  'bg-emerald-400 hover:bg-emerald-300 border-2 border-white text-slate-950 shadow-md';
              } else if (isActive) {
                blackClass =
                  'bg-emerald-500 hover:bg-emerald-400 border-2 border-emerald-200 text-slate-950 shadow-md';
              }

              return (
                <button
                  key={k.midi}
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setPressedMidi(k.midi);
                    pianoSynth.playNote(k.midi, 0.9, 0.22);
                    window.setTimeout(() => setPressedMidi(null), 220);
                  }}
                  style={{
                    left: `${leftPct}%`,
                    width: `${blackWidthPct}%`,
                  }}
                  className={`absolute top-1.5 h-[58%] z-10 rounded-b-md flex flex-col items-center justify-end pb-1 transition-transform duration-100 cursor-pointer ${blackClass} ${
                    isPressed ? 'scale-[0.96]' : ''
                  }`}
                >
                  {isActive && (
                    <div className="flex flex-col items-center leading-none">
                      {finger && (
                        <span className="text-[8px] font-mono font-bold opacity-85">
                          f{finger}
                        </span>
                      )}
                      <span className="font-mono text-[10px] font-bold tracking-tight">
                        {k.note}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
