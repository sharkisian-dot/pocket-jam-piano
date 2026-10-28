import React, { useMemo, useState } from 'react';
import {
  Columns,
  LayoutGrid,
  Maximize2,
  Shuffle,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  ALL_NOTES,
  evaluateAllScalesCompatibility,
  generateSmartProgression,
  getNoteIndex,
  getRightHandScaleNotes,
  HarmonicFlavor,
  JAM_PRESETS,
  JamChordSlot,
  NoteName,
  resolveProgressionChords,
  SCALES,
  ScaleId,
  STYLE_CATEGORIES,
  StyleCategory,
  VoicingType,
} from './engine/musicTheory';
import { pianoSynth } from './engine/pianoSynth';
import { RightHandKeyboard } from './components/RightHandKeyboard';
import { ScaleBrowser } from './components/ScaleBrowser';
import { ChordSwapDrawer } from './components/ChordSwapDrawer';

export type TabletLayoutOption = 'split_stage' | 'top_banner' | 'lead_sheet';

export default function App() {
  // Layout comparison switcher so the user can test all 3 tablet layouts live
  const [layoutMode, setLayoutMode] = useState<TabletLayoutOption>('split_stage');

  // Core Jam State
  const [styleFilter, setStyleFilter] = useState<StyleCategory>('All Styles');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    JAM_PRESETS[0].id
  );
  const [customProgressionName, setCustomProgressionName] = useState<
    string | null
  >(null);
  const [selectedKey, setSelectedKey] = useState<NoteName>(
    JAM_PRESETS[0].defaultKey
  );
  const [chordSlots, setChordSlots] = useState<JamChordSlot[]>(
    JAM_PRESETS[0].chords
  );
  const [flavor, setFlavor] = useState<HarmonicFlavor>(
    JAM_PRESETS[0].defaultFlavor
  );
  const [selectedScaleId, setSelectedScaleId] = useState<ScaleId>(
    JAM_PRESETS[0].defaultScaleId
  );
  const [showDegrees, setShowDegrees] = useState<boolean>(true);

  // Tapping any Left-Hand chord tile immediately opens the Swap / Customize Chord Drawer
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [selectedVoicingId, setSelectedVoicingId] =
    useState<VoicingType>('root');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Resolved Left-Hand Chords
  const chords = useMemo(
    () => resolveProgressionChords(selectedKey, chordSlots, flavor),
    [selectedKey, chordSlots, flavor]
  );

  // Resolved Right-Hand Scale Notes
  const scaleNotes = useMemo(
    () => getRightHandScaleNotes(selectedKey, selectedScaleId),
    [selectedKey, selectedScaleId]
  );

  // Live Scale Compatibility Analysis across all 15 scales against current chords
  const scaleCompatibilityList = useMemo(
    () => evaluateAllScalesCompatibility(selectedKey, chords),
    [selectedKey, chords]
  );

  // Filtered preset dropdown options
  const visiblePresets = useMemo(
    () =>
      styleFilter === 'All Styles'
        ? JAM_PRESETS
        : JAM_PRESETS.filter((p) => p.genre === styleFilter),
    [styleFilter]
  );

  // Select a curated preset
  const handleSelectPreset = (presetId: string) => {
    const preset =
      JAM_PRESETS.find((p) => p.id === presetId) || JAM_PRESETS[0];
    setSelectedPresetId(preset.id);
    setCustomProgressionName(null);
    setSelectedKey(preset.defaultKey);
    setChordSlots(preset.chords.map((c) => ({ ...c })));
    setFlavor(preset.defaultFlavor);
    setSelectedScaleId(preset.defaultScaleId);
    setActiveSlotIndex(null);
  };

  // Smart Progression Generator (creates a fresh progression for the active style)
  const handleGenerateProgression = () => {
    const generated = generateSmartProgression(styleFilter, selectedPresetId);
    setCustomProgressionName(`${generated.name} (${generated.genre})`);
    setChordSlots(generated.chords);
    setFlavor(generated.flavor);
    setSelectedScaleId(generated.scaleId);
    setActiveSlotIndex(null);

    // Audition first chord of the newly generated loop
    const resolved = resolveProgressionChords(
      selectedKey,
      generated.chords,
      generated.flavor
    );
    if (resolved[0]) {
      pianoSynth.playChord(resolved[0].voicings[0].midiNotes, 24);
    }
  };

  // Full Random Jam (Randomizes Key + Progression + Best-Fit Scale)
  const handleRandomJam = () => {
    const randomKey = ALL_NOTES[Math.floor(Math.random() * ALL_NOTES.length)];
    const generated = generateSmartProgression(styleFilter, selectedPresetId);
    setSelectedKey(randomKey);
    setCustomProgressionName(`${generated.name} (${generated.genre})`);
    setChordSlots(generated.chords);
    setFlavor(generated.flavor);
    setSelectedScaleId(generated.scaleId);
    setActiveSlotIndex(null);

    const resolved = resolveProgressionChords(
      randomKey,
      generated.chords,
      generated.flavor
    );
    if (resolved[0]) {
      pianoSynth.playChord(resolved[0].voicings[0].midiNotes, 24);
    }
  };

  // Play the Right-Hand scale ascending
  const handlePlayScalePreview = () => {
    const rootSemitone = getNoteIndex(selectedKey);
    const baseMidi = 60 + rootSemitone;
    const scaleDef = SCALES[selectedScaleId];
    const midiSeq = [
      ...scaleDef.intervals.map((int) => baseMidi + int),
      baseMidi + 12,
    ];
    pianoSynth.playScaleRun(midiSeq, 130);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    pianoSynth.setMuted(next);
  };

  // Tap a Left-Hand Chord Tile -> Plays chord & immediately opens the Swap/Customize Drawer
  const handleChordTileTap = (index: number) => {
    const chord = chords[index];
    if (chord) {
      const voicing =
        chord.voicings.find((v) => v.id === selectedVoicingId) ||
        chord.voicings[0];
      pianoSynth.playChord(voicing.midiNotes, 24);
    }
    setActiveSlotIndex((prev) => (prev === index ? null : index));
  };

  const handleUpdateSlot = (
    index: number,
    updated: Partial<JamChordSlot>
  ) => {
    setCustomProgressionName((prev) => prev || 'Custom Edited Loop');
    setChordSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, ...updated } : slot))
    );
  };

  const handleAddSlotAfter = (index: number) => {
    if (chordSlots.length >= 8) return;
    const refSlot = chordSlots[index] || chordSlots[0];
    const newSlot: JamChordSlot = {
      id: `slot_${Date.now()}`,
      degreeRoman: refSlot.degreeRoman,
      rootOffset: refSlot.rootOffset,
      baseQuality: refSlot.baseQuality,
    };
    const next = [...chordSlots];
    next.splice(index + 1, 0, newSlot);
    setChordSlots(next);
    setActiveSlotIndex(index + 1);
  };

  const handleRemoveSlot = (index: number) => {
    if (chordSlots.length <= 2) return;
    const next = chordSlots.filter((_, i) => i !== index);
    setChordSlots(next);
    setActiveSlotIndex(null);
  };

  const highlightedChord =
    activeSlotIndex !== null && chords[activeSlotIndex]
      ? chords[activeSlotIndex]
      : chords[0] || null;

  // Render Left-Hand Section (Pure Chord Symbol Tiles + Immediate Tap-to-Swap Drawer)
  const renderLeftHandChordsSection = (isHorizontalBanner = false) => (
    <section
      aria-label="Left Hand Chord Progression"
      className="bg-slate-900/75 border border-slate-800/90 rounded-2xl p-3 sm:p-5 flex flex-col gap-3 shadow-lg"
    >
      {/* Left Hand Header + Global Harmonic Flavor Toggle (Triads / 7ths / 9ths) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight whitespace-nowrap">
            Left Hand · Chords
          </h2>
          <span className="text-[11px] sm:text-xs text-slate-400 truncate">
            Tap any chord to swap or customize
          </span>
        </div>

        {/* Global Flavor Switcher: Triads | 7ths | 9ths/Lush */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          {(
            [
              { id: 'triads', label: 'Triads' },
              { id: 'sevenths', label: '7ths' },
              { id: 'lush', label: '9ths / Lush' },
            ] as { id: HarmonicFlavor; label: string }[]
          ).map((fl) => {
            const active = flavor === fl.id;
            return (
              <button
                key={fl.id}
                type="button"
                onClick={() => {
                  setFlavor(fl.id);
                  // Clear per-slot overrides so global flavor applies cleanly
                  setChordSlots((prev) =>
                    prev.map((s) => ({ ...s, customQualityOverride: undefined }))
                  );
                }}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pure Chord Symbol Tiles */}
      <div
        className={`grid gap-2 sm:gap-3 ${
          isHorizontalBanner
            ? 'grid-cols-2 sm:grid-cols-4'
            : chords.length <= 4
              ? 'grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {chords.map((chord, idx) => {
          const isSelected = activeSlotIndex === idx;
          return (
            <button
              key={chord.id}
              type="button"
              onClick={() => handleChordTileTap(idx)}
              aria-expanded={isSelected}
              className={`min-h-[78px] sm:min-h-[92px] px-4 py-3 rounded-2xl border transition-all flex flex-col justify-between items-start cursor-pointer select-none ${
                isSelected
                  ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg'
                  : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Top Corner: Step Number + Roman Numeral */}
              <div className="flex items-center justify-between w-full text-xs font-mono">
                <span className="text-slate-500 font-bold">{idx + 1}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[11px] ${
                    isSelected
                      ? 'bg-emerald-500/25 text-emerald-200 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {chord.degreeRoman}
                </span>
              </div>

              {/* Center/Bottom: Giant Pure Chord Symbol */}
              <div className="w-full flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {chord.chordSymbol}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  {isSelected ? 'Editing ▾' : 'Swap / Edit'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tap-to-Swap / Customize Chord Touch Palette */}
      {activeSlotIndex !== null && chords[activeSlotIndex] && (
        <ChordSwapDrawer
          slotIndex={activeSlotIndex}
          totalSlots={chords.length}
          keyRoot={selectedKey}
          flavor={flavor}
          chord={chords[activeSlotIndex]}
          selectedVoicingId={selectedVoicingId}
          onSelectVoicing={setSelectedVoicingId}
          onUpdateSlot={handleUpdateSlot}
          onAddSlotAfter={handleAddSlotAfter}
          onRemoveSlot={handleRemoveSlot}
          onClose={() => setActiveSlotIndex(null)}
        />
      )}
    </section>
  );

  // Render Right-Hand Section (Scale Browser with Compatibility Badges + Visual Piano Keyboard)
  const renderRightHandScaleSection = (wideTwoOctaves = false) => (
    <section
      aria-label="Right Hand Scale Keys"
      className="bg-slate-900/75 border border-slate-800/90 rounded-2xl p-3 sm:p-5 flex flex-col gap-3 shadow-lg"
    >
      {/* Right Hand Header & Scale Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight whitespace-nowrap">
            Right Hand · Scale
          </h2>
          <span className="text-xs sm:text-sm font-mono font-bold text-sky-400 truncate">
            {selectedKey} {SCALES[selectedScaleId].name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowDegrees((prev) => !prev)}
            className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            {showDegrees ? 'Hide Degrees' : 'Show Degrees'}
          </button>
          <button
            type="button"
            onClick={handlePlayScalePreview}
            className="min-h-[34px] px-3 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Scale</span>
          </button>
        </div>
      </div>

      {/* Scale Compatibility Browser (Top 4 + All 15 Scales Drawer) */}
      <ScaleBrowser
        selectedScaleId={selectedScaleId}
        compatibilityList={scaleCompatibilityList}
        onSelectScale={setSelectedScaleId}
      />

      {/* Visual Piano Keyboard for Right Hand */}
      <RightHandKeyboard
        scaleNotes={scaleNotes}
        activeChordNotes={highlightedChord?.notes}
        activeChordSymbol={highlightedChord?.chordSymbol}
        showDegrees={showDegrees}
        wideTwoOctaves={wideTwoOctaves}
      />
    </section>
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      {/* Top Header Bar with 3-Layout Comparison Switcher */}
      <header className="sticky top-0 z-30 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
              Pocket Jam Piano
            </span>

            {/* 3-Layout Comparison Switcher */}
            <div
              role="group"
              aria-label="Tablet Layout Mode"
              className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800"
            >
              {(
                [
                  {
                    id: 'split_stage',
                    label: '1. Split Stage',
                    icon: Columns,
                  },
                  {
                    id: 'top_banner',
                    label: '2. Top Chords + Wide Keys',
                    icon: LayoutGrid,
                  },
                  {
                    id: 'lead_sheet',
                    label: '3. Focus View',
                    icon: Maximize2,
                  },
                ] as const
              ).map((opt) => {
                const Icon = opt.icon;
                const active = layoutMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLayoutMode(opt.id)}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={isMuted ? 'Unmute piano sound' : 'Mute piano sound'}
              className="min-h-[38px] min-w-[38px] px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-300" />
              )}
            </button>

            <button
              type="button"
              onClick={handleRandomJam}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Jam</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-5 flex flex-col gap-3 sm:gap-4">
        {/* Top Control Strip: Style Filter + Progression Generator + 12-Key Root Selector */}
        <section
          aria-label="Jam Key and Progression Controls"
          className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3 sm:p-4 flex flex-col gap-3"
        >
          {/* Style Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">
              Style:
            </span>
            {STYLE_CATEGORIES.map((cat) => {
              const active = styleFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setStyleFilter(cat);
                    const matching =
                      cat === 'All Styles'
                        ? JAM_PRESETS
                        : JAM_PRESETS.filter((p) => p.genre === cat);
                    if (matching[0]) {
                      handleSelectPreset(matching[0].id);
                    }
                  }}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    active
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
            {/* Progression Selector + Smart Progression Generator Button */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <label
                htmlFor="preset-select"
                className="text-xs font-medium text-slate-400 whitespace-nowrap shrink-0"
              >
                Progression
              </label>
              <select
                id="preset-select"
                value={customProgressionName ? 'custom' : selectedPresetId}
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    handleSelectPreset(e.target.value);
                  }
                }}
                className="min-h-[40px] min-w-0 flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-white truncate focus:outline-2 focus:outline-amber-400"
              >
                {customProgressionName && (
                  <option value="custom">★ {customProgressionName}</option>
                )}
                {visiblePresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.styleTag})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleGenerateProgression}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap shrink-0 cursor-pointer"
                title="Generate a fresh chord progression for the selected style"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Chords</span>
              </button>
            </div>

            {/* 12-Key Root Selector Strip */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-slate-400 whitespace-nowrap shrink-0 hidden sm:inline">
                Key
              </span>
              <div
                role="radiogroup"
                aria-label="Root Key"
                className="grid grid-cols-12 gap-0.5 sm:gap-1 w-full sm:w-auto bg-slate-950 p-1 rounded-xl border border-slate-800"
              >
                {ALL_NOTES.map((note) => {
                  const isActive = note === selectedKey;
                  return (
                    <button
                      key={note}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setSelectedKey(note)}
                      className={`min-h-[34px] sm:min-h-[36px] px-0.5 sm:px-2 rounded-lg font-mono text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 flex items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {note}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            LAYOUT 1: SPLIT STAGE (2-Column Side-by-Side like Pocket Jam)
           ========================================================= */}
        {layoutMode === 'split_stage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-start">
            <div className="lg:col-span-6">
              {renderRightHandScaleSection(false)}
            </div>
            <div className="lg:col-span-6">
              {renderLeftHandChordsSection(false)}
            </div>
          </div>
        )}

        {/* =========================================================
            LAYOUT 2: TOP CHORDS + WIDE KEYS (4 Chords Top, Wide 2-Octave Keys Below)
           ========================================================= */}
        {layoutMode === 'top_banner' && (
          <div className="flex flex-col gap-4">
            {renderLeftHandChordsSection(true)}
            {renderRightHandScaleSection(true)}
          </div>
        )}

        {/* =========================================================
            LAYOUT 3: FOCUS LEAD-SHEET (Oversized Chord Symbols + Clean Keyboard)
           ========================================================= */}
        {layoutMode === 'lead_sheet' && (
          <div className="flex flex-col gap-4">
            {/* Giant Minimalist Lead-Sheet Strip */}
            <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Left Hand Lead Sheet (Tap any chord to swap or customize)
                </span>
                <div className="flex items-center gap-1">
                  {(['triads', 'sevenths', 'lush'] as const).map((fl) => (
                    <button
                      key={fl}
                      type="button"
                      onClick={() => {
                        setFlavor(fl);
                        setChordSlots((prev) =>
                          prev.map((s) => ({
                            ...s,
                            customQualityOverride: undefined,
                          }))
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        flavor === fl
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400'
                      }`}
                    >
                      {fl === 'triads'
                        ? 'Triads'
                        : fl === 'sevenths'
                          ? '7ths'
                          : '9ths'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {chords.map((chord, idx) => {
                  const isSelected = activeSlotIndex === idx;
                  return (
                    <button
                      key={chord.id}
                      type="button"
                      onClick={() => handleChordTileTap(idx)}
                      className={`min-h-[104px] rounded-2xl border flex flex-col items-center justify-center p-4 transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/50'
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                        {chord.chordSymbol}
                      </span>
                      <span className="mt-1 text-xs font-mono text-slate-400">
                        {chord.degreeRoman}
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeSlotIndex !== null && chords[activeSlotIndex] && (
                <ChordSwapDrawer
                  slotIndex={activeSlotIndex}
                  totalSlots={chords.length}
                  keyRoot={selectedKey}
                  flavor={flavor}
                  chord={chords[activeSlotIndex]}
                  selectedVoicingId={selectedVoicingId}
                  onSelectVoicing={setSelectedVoicingId}
                  onUpdateSlot={handleUpdateSlot}
                  onAddSlotAfter={handleAddSlotAfter}
                  onRemoveSlot={handleRemoveSlot}
                  onClose={() => setActiveSlotIndex(null)}
                />
              )}
            </section>

            {renderRightHandScaleSection(false)}
          </div>
        )}
      </main>
    </div>
  );
}
