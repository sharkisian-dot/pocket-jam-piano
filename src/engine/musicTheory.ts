export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'Ab'
  | 'A'
  | 'Bb'
  | 'B';

export const ALL_NOTES: NoteName[] = [
  'C',
  'C#',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

export const BLACK_NOTE_SET = new Set<NoteName>(['C#', 'Eb', 'F#', 'Ab', 'Bb']);

export type HarmonicFlavor = 'triads' | 'sevenths' | 'lush';

export type ChordQuality =
  | 'maj'
  | 'min'
  | 'dim'
  | 'aug'
  | 'sus2'
  | 'sus4'
  | '6'
  | 'm6'
  | 'add9'
  | 'maj7'
  | 'min7'
  | 'dom7'
  | 'min7b5'
  | 'dim7'
  | 'maj9'
  | 'min9'
  | 'dom9'
  | 'dom13'
  | '7b9'
  | '7#9'
  | '7alt';

export interface ChordQualityMeta {
  id: ChordQuality;
  suffix: string;
  label: string;
  category: 'Basic & Triads' | '7th Chords' | 'Lush 9th/13th & Sus' | 'Spicy & Altered';
  intervals: number[];
  triadBase: ChordQuality;
  seventhUpgrade: ChordQuality;
  lushUpgrade: ChordQuality;
}

export const CHORD_QUALITIES: Record<ChordQuality, ChordQualityMeta> = {
  maj: {
    id: 'maj',
    suffix: '',
    label: 'Major',
    category: 'Basic & Triads',
    intervals: [0, 4, 7],
    triadBase: 'maj',
    seventhUpgrade: 'maj7',
    lushUpgrade: 'maj9',
  },
  min: {
    id: 'min',
    suffix: 'm',
    label: 'Minor',
    category: 'Basic & Triads',
    intervals: [0, 3, 7],
    triadBase: 'min',
    seventhUpgrade: 'min7',
    lushUpgrade: 'min9',
  },
  dim: {
    id: 'dim',
    suffix: 'dim',
    label: 'Diminished',
    category: 'Basic & Triads',
    intervals: [0, 3, 6],
    triadBase: 'dim',
    seventhUpgrade: 'min7b5',
    lushUpgrade: 'min7b5',
  },
  aug: {
    id: 'aug',
    suffix: 'aug',
    label: 'Augmented',
    category: 'Basic & Triads',
    intervals: [0, 4, 8],
    triadBase: 'aug',
    seventhUpgrade: '7alt',
    lushUpgrade: '7alt',
  },
  sus2: {
    id: 'sus2',
    suffix: 'sus2',
    label: 'Suspended 2nd',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 2, 7],
    triadBase: 'sus2',
    seventhUpgrade: 'add9',
    lushUpgrade: 'maj9',
  },
  sus4: {
    id: 'sus4',
    suffix: 'sus4',
    label: 'Suspended 4th',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 5, 7],
    triadBase: 'sus4',
    seventhUpgrade: 'dom7',
    lushUpgrade: 'dom13',
  },
  '6': {
    id: '6',
    suffix: '6',
    label: 'Major 6th',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 4, 7, 9],
    triadBase: 'maj',
    seventhUpgrade: '6',
    lushUpgrade: 'maj9',
  },
  m6: {
    id: 'm6',
    suffix: 'm6',
    label: 'Minor 6th',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 3, 7, 9],
    triadBase: 'min',
    seventhUpgrade: 'm6',
    lushUpgrade: 'min9',
  },
  add9: {
    id: 'add9',
    suffix: 'add9',
    label: 'Major Add9',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 4, 7, 14],
    triadBase: 'maj',
    seventhUpgrade: 'add9',
    lushUpgrade: 'maj9',
  },
  maj7: {
    id: 'maj7',
    suffix: 'maj7',
    label: 'Major 7th',
    category: '7th Chords',
    intervals: [0, 4, 7, 11],
    triadBase: 'maj',
    seventhUpgrade: 'maj7',
    lushUpgrade: 'maj9',
  },
  min7: {
    id: 'min7',
    suffix: 'm7',
    label: 'Minor 7th',
    category: '7th Chords',
    intervals: [0, 3, 7, 10],
    triadBase: 'min',
    seventhUpgrade: 'min7',
    lushUpgrade: 'min9',
  },
  dom7: {
    id: 'dom7',
    suffix: '7',
    label: 'Dominant 7th',
    category: '7th Chords',
    intervals: [0, 4, 7, 10],
    triadBase: 'maj',
    seventhUpgrade: 'dom7',
    lushUpgrade: 'dom13',
  },
  min7b5: {
    id: 'min7b5',
    suffix: 'm7♭5',
    label: 'Half-Diminished',
    category: '7th Chords',
    intervals: [0, 3, 6, 10],
    triadBase: 'dim',
    seventhUpgrade: 'min7b5',
    lushUpgrade: 'min7b5',
  },
  dim7: {
    id: 'dim7',
    suffix: 'dim7',
    label: 'Diminished 7th',
    category: 'Spicy & Altered',
    intervals: [0, 3, 6, 9],
    triadBase: 'dim',
    seventhUpgrade: 'dim7',
    lushUpgrade: 'dim7',
  },
  maj9: {
    id: 'maj9',
    suffix: 'maj9',
    label: 'Major 9th',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 4, 7, 11, 14],
    triadBase: 'maj',
    seventhUpgrade: 'maj7',
    lushUpgrade: 'maj9',
  },
  min9: {
    id: 'min9',
    suffix: 'm9',
    label: 'Minor 9th',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 3, 7, 10, 14],
    triadBase: 'min',
    seventhUpgrade: 'min7',
    lushUpgrade: 'min9',
  },
  dom9: {
    id: 'dom9',
    suffix: '9',
    label: 'Dominant 9th',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 4, 7, 10, 14],
    triadBase: 'maj',
    seventhUpgrade: 'dom7',
    lushUpgrade: 'dom9',
  },
  dom13: {
    id: 'dom13',
    suffix: '13',
    label: 'Dominant 13th',
    category: 'Lush 9th/13th & Sus',
    intervals: [0, 4, 7, 10, 14, 21],
    triadBase: 'maj',
    seventhUpgrade: 'dom7',
    lushUpgrade: 'dom13',
  },
  '7b9': {
    id: '7b9',
    suffix: '7♭9',
    label: 'Dominant 7♭9',
    category: 'Spicy & Altered',
    intervals: [0, 4, 7, 10, 13],
    triadBase: 'maj',
    seventhUpgrade: 'dom7',
    lushUpgrade: '7b9',
  },
  '7#9': {
    id: '7#9',
    suffix: '7♯9',
    label: 'Dominant 7♯9 (Hendrix)',
    category: 'Spicy & Altered',
    intervals: [0, 4, 7, 10, 15],
    triadBase: 'maj',
    seventhUpgrade: 'dom7',
    lushUpgrade: '7#9',
  },
  '7alt': {
    id: '7alt',
    suffix: '7alt',
    label: 'Altered Dominant',
    category: 'Spicy & Altered',
    intervals: [0, 4, 8, 10, 13],
    triadBase: 'maj',
    seventhUpgrade: 'dom7',
    lushUpgrade: '7alt',
  },
};

export type VoicingType = 'root' | 'first' | 'second' | 'shell';

export interface VoicingPosition {
  id: VoicingType;
  label: string;
  shortLabel: string;
  midiNotes: number[];
  noteNames: NoteName[];
  lhFingers: string;
}

export interface JamChordSlot {
  id: string;
  degreeRoman: string;
  rootOffset: number; // 0..11 semitones from keyRoot
  baseQuality: ChordQuality;
  customQualityOverride?: ChordQuality; // When user explicitly picks a quality in the swap drawer
}

// ==========================================
// COMPREHENSIVE 15-SCALE LIBRARY
// ==========================================

export type ScaleId =
  | 'major_pentatonic'
  | 'minor_pentatonic'
  | 'blues_major'
  | 'blues_minor'
  | 'major_ionian'
  | 'natural_minor'
  | 'dorian'
  | 'mixolydian'
  | 'lydian'
  | 'phrygian'
  | 'harmonic_minor'
  | 'melodic_minor'
  | 'lydian_dominant'
  | 'phrygian_dominant'
  | 'jazz_altered';

export type ScaleCategory = 'Pentatonic & Blues' | 'Diatonic & Modes' | 'Jazz & Exotic';

export interface ScaleDefinition {
  id: ScaleId;
  name: string;
  shortTag: string;
  category: ScaleCategory;
  intervals: number[]; // semitones from scale root (0..11)
  degreeLabels: string[];
  blueIntervals?: number[]; // spicy/blue intervals to highlight distinctly
  character: string;
}

export const SCALES: Record<ScaleId, ScaleDefinition> = {
  major_pentatonic: {
    id: 'major_pentatonic',
    name: 'Major Pentatonic',
    shortTag: '5 Notes · Bright',
    category: 'Pentatonic & Blues',
    intervals: [0, 2, 4, 7, 9],
    degreeLabels: ['1', '2', '3', '5', '6'],
    character: 'Warm, melodic, and impossible to hit a harsh note over major grooves.',
  },
  minor_pentatonic: {
    id: 'minor_pentatonic',
    name: 'Minor Pentatonic',
    shortTag: '5 Notes · Soulful',
    category: 'Pentatonic & Blues',
    intervals: [0, 3, 5, 7, 10],
    degreeLabels: ['1', '♭3', '4', '5', '♭7'],
    character: 'Punchy, universal groove vocabulary for Lo-Fi, R&B, Pop, and Blues.',
  },
  blues_minor: {
    id: 'blues_minor',
    name: 'Minor Blues',
    shortTag: '6 Notes · Gritty',
    category: 'Pentatonic & Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    degreeLabels: ['1', '♭3', '4', '♭5', '5', '♭7'],
    blueIntervals: [6],
    character: 'Adds the expressive ♭5 Blue Note for slides and soulful attitude.',
  },
  blues_major: {
    id: 'blues_major',
    name: 'Major Blues / Gospel',
    shortTag: '6 Notes · Gospel/Soul',
    category: 'Pentatonic & Blues',
    intervals: [0, 2, 3, 4, 7, 9],
    degreeLabels: ['1', '2', '♭3', '3', '5', '6'],
    blueIntervals: [3],
    character: 'Sweet soul & gospel sound—slide from ♭3 into natural 3.',
  },
  major_ionian: {
    id: 'major_ionian',
    name: 'Major Scale (Ionian)',
    shortTag: '7 Notes · Full Major',
    category: 'Diatonic & Modes',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    degreeLabels: ['1', '2', '3', '4', '5', '6', '7'],
    character: 'Complete 7-note major scale for full melodic storytelling.',
  },
  natural_minor: {
    id: 'natural_minor',
    name: 'Natural Minor (Aeolian)',
    shortTag: '7 Notes · Emotional',
    category: 'Diatonic & Modes',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    degreeLabels: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
    character: 'Cinematic, melancholic minor with the expressive ♭6 degree.',
  },
  dorian: {
    id: 'dorian',
    name: 'Dorian Mode',
    shortTag: '7 Notes · Jazzy Minor',
    category: 'Diatonic & Modes',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    degreeLabels: ['1', '2', '♭3', '4', '5', '6', '♭7'],
    blueIntervals: [9],
    character: 'Smooth Neo-Soul & Lo-Fi minor featuring the bright natural 6th.',
  },
  mixolydian: {
    id: 'mixolydian',
    name: 'Mixolydian Mode',
    shortTag: '7 Notes · Funky Dom',
    category: 'Diatonic & Modes',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    degreeLabels: ['1', '2', '3', '4', '5', '6', '♭7'],
    blueIntervals: [10],
    character: 'Major scale with a funky ♭7—ideal for bluesy, rock, and dominant vamps.',
  },
  lydian: {
    id: 'lydian',
    name: 'Lydian Mode',
    shortTag: '7 Notes · Dreamy ♯4',
    category: 'Diatonic & Modes',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    degreeLabels: ['1', '2', '3', '♯4', '5', '6', '7'],
    blueIntervals: [6],
    character: 'Floating film-score & modern jazz wonder with the raised ♯4.',
  },
  phrygian: {
    id: 'phrygian',
    name: 'Phrygian Mode',
    shortTag: '7 Notes · Dark ♭2',
    category: 'Diatonic & Modes',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    degreeLabels: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'],
    blueIntervals: [1],
    character: 'Exotic Spanish / dark trap minor tension right above the root (♭2).',
  },
  harmonic_minor: {
    id: 'harmonic_minor',
    name: 'Harmonic Minor',
    shortTag: '7 Notes · Dramatic 7',
    category: 'Jazz & Exotic',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    degreeLabels: ['1', '2', '♭3', '4', '5', '♭6', '7'],
    blueIntervals: [11],
    character: 'Classical, tango, and minor-turnaround drama with a leading-tone 7th.',
  },
  melodic_minor: {
    id: 'melodic_minor',
    name: 'Jazz Melodic Minor',
    shortTag: '7 Notes · Modern Jazz',
    category: 'Jazz & Exotic',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    degreeLabels: ['1', '2', '♭3', '4', '5', '6', '7'],
    blueIntervals: [9, 11],
    character: 'Minor 3rd with a major top half (6 & 7)—sophisticated modern jazz color.',
  },
  lydian_dominant: {
    id: 'lydian_dominant',
    name: 'Lydian Dominant',
    shortTag: '7 Notes · Hip ♯11/♭7',
    category: 'Jazz & Exotic',
    intervals: [0, 2, 4, 6, 7, 9, 10],
    degreeLabels: ['1', '2', '3', '♯11', '5', '13', '♭7'],
    blueIntervals: [6, 10],
    character: 'Bossa Nova & jazz colorful dominant combining ♯11 and ♭7.',
  },
  phrygian_dominant: {
    id: 'phrygian_dominant',
    name: 'Phrygian Dominant (Spanish)',
    shortTag: '7 Notes · Flamenco',
    category: 'Jazz & Exotic',
    intervals: [0, 1, 4, 5, 7, 8, 10],
    degreeLabels: ['1', '♭2', '3', '4', '5', '♭6', '♭7'],
    blueIntervals: [1, 8],
    character: 'Fiery Andalusian / Middle-Eastern sound with a ♭2 and Major 3rd.',
  },
  jazz_altered: {
    id: 'jazz_altered',
    name: 'Altered Scale',
    shortTag: '7 Notes · Max Tension',
    category: 'Jazz & Exotic',
    intervals: [0, 1, 3, 4, 6, 8, 10],
    degreeLabels: ['1', '♭9', '♯9', '3', '♯11', '♭13', '♭7'],
    blueIntervals: [1, 3, 6, 8],
    character: 'Maximum outside jazz tension (♭9, ♯9, ♯11, ♭13) before resolving.',
  },
};

export const ALL_SCALE_IDS = Object.keys(SCALES) as ScaleId[];

// ==========================================
// SCALE COMPATIBILITY ENGINE
// ==========================================

export type CompatibilityTier = 'bulletproof' | 'colorful' | 'spicy';

export interface ScaleCompatibilityResult {
  scale: ScaleDefinition;
  tier: CompatibilityTier;
  badgeText: string;
  fitPercent: number;
  summary: string;
  score: number;
}

export function getNoteIndex(note: NoteName): number {
  return ALL_NOTES.indexOf(note);
}

export function getNoteByOffset(root: NoteName, semitoneOffset: number): NoteName {
  const rootIdx = getNoteIndex(root);
  const targetIdx = (((rootIdx + semitoneOffset) % 12) + 12) % 12;
  return ALL_NOTES[targetIdx];
}

export function midiToNoteName(midi: number): NoteName {
  const idx = ((midi % 12) + 12) % 12;
  return ALL_NOTES[idx];
}

/**
 * Evaluates how every scale in the library fits the current Left-Hand chords,
 * returning 'Safe / Bulletproof', 'Colorful / Modal', or 'Spicy / Tension' badges.
 */
export function evaluateAllScalesCompatibility(
  scaleRoot: NoteName,
  chords: ResolvedChord[]
): ScaleCompatibilityResult[] {
  const scaleRootIdx = getNoteIndex(scaleRoot);

  // Collect all chord tones and chord roots in the progression
  const allChordToneWeighted: number[] = [];
  const firstChordRootIdx = chords[0] ? getNoteIndex(chords[0].rootNote) : scaleRootIdx;
  const firstChordQuality = chords[0]?.quality || 'maj';
  const isProgressionMinorish =
    firstChordQuality.startsWith('min') ||
    (chords[0]?.degreeRoman.startsWith('i') && !chords[0]?.degreeRoman.startsWith('I'));

  chords.forEach((ch, idx) => {
    const weight = idx === 0 ? 2 : 1;
    ch.notes.forEach((n, notePos) => {
      const nIdx = getNoteIndex(n);
      // Root and 3rd carry extra harmonic weight
      const repeat = notePos <= 1 ? weight * 2 : weight;
      for (let r = 0; r < repeat; r++) {
        allChordToneWeighted.push(nIdx);
      }
    });
  });

  const results = ALL_SCALE_IDS.map((scaleId) => {
    const scale = SCALES[scaleId];
    const scalePitchSet = new Set<number>(
      scale.intervals.map((int) => (((scaleRootIdx + int) % 12) + 12) % 12)
    );

    let matchedWeight = 0;
    allChordToneWeighted.forEach((pc) => {
      if (scalePitchSet.has(pc)) matchedWeight++;
    });

    const rawRatio =
      allChordToneWeighted.length > 0
        ? matchedWeight / allChordToneWeighted.length
        : 0.75;
    const fitPercent = Math.round(rawRatio * 100);

    // Determine tier based on harmonic consonance + scale family
    const hasMajorThird = scale.intervals.includes(4);
    const hasMinorThird = scale.intervals.includes(3) && !scale.intervals.includes(4);
    const isPentatonic = scale.intervals.length === 5;
    const isBlues = scaleId === 'blues_minor' || scaleId === 'blues_major';
    const isExotic = scale.category === 'Jazz & Exotic';

    let tier: CompatibilityTier = 'colorful';
    let badgeText = 'Colorful / Modal';
    let summary = scale.character;
    let score = fitPercent;

    if (
      (isPentatonic && fitPercent >= 68) ||
      (!isExotic && !isBlues && fitPercent >= 82)
    ) {
      tier = 'bulletproof';
      badgeText = 'Safe / Bulletproof';
      score += 22;
      summary = isPentatonic
        ? `Matches ${fitPercent}% of chord tones — zero harsh clashes across the loop.`
        : `Home-key diatonic fit (${fitPercent}% chord match) — smooth & natural.`;
    } else if (isBlues && fitPercent >= 62) {
      tier = 'colorful';
      badgeText = 'Colorful / Blues';
      score += 14;
      summary = `Soulful blues vocabulary (${fitPercent}% match) with expressive blue notes.`;
    } else if (!isExotic && fitPercent >= 66) {
      tier = 'colorful';
      badgeText = 'Colorful / Modal';
      score += 8;
      summary = `${scale.character} (${fitPercent}% chord match).`;
    } else {
      tier = 'spicy';
      badgeText = 'Spicy / Tension';
      summary = `Outside color & tension (${fitPercent}% match) — resolve phrases to ★ chord tones.`;
    }

    // Boost natural minor/pentatonic in minor progressions and major in major progressions
    if (isProgressionMinorish && hasMinorThird) score += 10;
    if (!isProgressionMinorish && hasMajorThird && firstChordRootIdx === scaleRootIdx) score += 10;

    return {
      scale,
      tier,
      badgeText,
      fitPercent,
      summary,
      score,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

// ==========================================
// PRESETS, STYLES & SMART GENERATOR
// ==========================================

export type StyleCategory =
  | 'All Styles'
  | 'Lo-Fi & Chill'
  | 'Neo-Soul & R&B'
  | 'Jazz & Bossa'
  | 'Pop & Indie'
  | 'Blues & Gospel'
  | 'Cinematic & Minor'
  | 'Rock & Funk';

export const STYLE_CATEGORIES: StyleCategory[] = [
  'All Styles',
  'Lo-Fi & Chill',
  'Neo-Soul & R&B',
  'Jazz & Bossa',
  'Pop & Indie',
  'Blues & Gospel',
  'Cinematic & Minor',
  'Rock & Funk',
];

export interface JamPreset {
  id: string;
  name: string;
  genre: StyleCategory;
  styleTag: string;
  mode: 'minor' | 'major' | 'dorian' | 'mixolydian';
  defaultKey: NoteName;
  defaultFlavor: HarmonicFlavor;
  defaultScaleId: ScaleId;
  chords: JamChordSlot[];
}

export const JAM_PRESETS: JamPreset[] = [
  {
    id: 'lofi_hip_hop',
    name: 'Lo-Fi Rainy Window',
    genre: 'Lo-Fi & Chill',
    styleTag: 'ii – V – I – VI',
    mode: 'major',
    defaultKey: 'F',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'major_pentatonic',
    chords: [
      { id: 'c1', degreeRoman: 'ii', rootOffset: 2, baseQuality: 'min' },
      { id: 'c2', degreeRoman: 'V', rootOffset: 7, baseQuality: 'dom7' },
      { id: 'c3', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c4', degreeRoman: 'VI', rootOffset: 9, baseQuality: 'dom7' },
    ],
  },
  {
    id: 'lofi_walkdown',
    name: 'Sunset Walkdown',
    genre: 'Lo-Fi & Chill',
    styleTag: 'IV – iii – ii – I',
    mode: 'major',
    defaultKey: 'C',
    defaultFlavor: 'lush',
    defaultScaleId: 'major_ionian',
    chords: [
      { id: 'c1', degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: 'iii', rootOffset: 4, baseQuality: 'min' },
      { id: 'c3', degreeRoman: 'ii', rootOffset: 2, baseQuality: 'min' },
      { id: 'c4', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
    ],
  },
  {
    id: 'dorian_pocket',
    name: 'Neo-Soul Dorian Pocket',
    genre: 'Neo-Soul & R&B',
    styleTag: 'i – IV – i – ♭VII',
    mode: 'dorian',
    defaultKey: 'D',
    defaultFlavor: 'lush',
    defaultScaleId: 'dorian',
    chords: [
      { id: 'c1', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c2', degreeRoman: 'IV', rootOffset: 5, baseQuality: 'dom7' },
      { id: 'c3', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c4', degreeRoman: '♭VII', rootOffset: 10, baseQuality: 'maj' },
    ],
  },
  {
    id: 'soul_climb',
    name: 'Royal Road R&B Climb',
    genre: 'Neo-Soul & R&B',
    styleTag: 'IV – V – iii – vi',
    mode: 'major',
    defaultKey: 'Eb',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'major_pentatonic',
    chords: [
      { id: 'c1', degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: 'V', rootOffset: 7, baseQuality: 'dom7' },
      { id: 'c3', degreeRoman: 'iii', rootOffset: 4, baseQuality: 'min' },
      { id: 'c4', degreeRoman: 'vi', rootOffset: 9, baseQuality: 'min' },
    ],
  },
  {
    id: 'neosoul_borrowed',
    name: 'Warm Modal Interchange',
    genre: 'Neo-Soul & R&B',
    styleTag: 'I – iv – I – ♭VII',
    mode: 'major',
    defaultKey: 'F',
    defaultFlavor: 'lush',
    defaultScaleId: 'blues_major',
    chords: [
      { id: 'c1', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: 'iv', rootOffset: 5, baseQuality: 'min' },
      { id: 'c3', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c4', degreeRoman: '♭VII', rootOffset: 10, baseQuality: 'dom7' },
    ],
  },
  {
    id: 'jazz_standards',
    name: 'Jazz Club Turnaround',
    genre: 'Jazz & Bossa',
    styleTag: 'I – vi – ii – V',
    mode: 'major',
    defaultKey: 'Bb',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'major_ionian',
    chords: [
      { id: 'c1', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: 'vi', rootOffset: 9, baseQuality: 'min' },
      { id: 'c3', degreeRoman: 'ii', rootOffset: 2, baseQuality: 'min' },
      { id: 'c4', degreeRoman: 'V', rootOffset: 7, baseQuality: 'dom7' },
    ],
  },
  {
    id: 'jazz_minor_251',
    name: 'Smoky Minor ii–V–i',
    genre: 'Jazz & Bossa',
    styleTag: 'iiø – V7♭9 – i – VI7',
    mode: 'minor',
    defaultKey: 'C',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'harmonic_minor',
    chords: [
      { id: 'c1', degreeRoman: 'iiø', rootOffset: 2, baseQuality: 'dim' },
      { id: 'c2', degreeRoman: 'V', rootOffset: 7, baseQuality: '7b9' },
      { id: 'c3', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c4', degreeRoman: '♭VI', rootOffset: 8, baseQuality: 'maj' },
    ],
  },
  {
    id: 'bossa_nova',
    name: 'Bossa Nova Breeze',
    genre: 'Jazz & Bossa',
    styleTag: 'I – II7 – ii – V7',
    mode: 'major',
    defaultKey: 'F',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'lydian_dominant',
    chords: [
      { id: 'c1', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: 'II7', rootOffset: 2, baseQuality: 'dom7' },
      { id: 'c3', degreeRoman: 'ii', rootOffset: 2, baseQuality: 'min' },
      { id: 'c4', degreeRoman: 'V', rootOffset: 7, baseQuality: 'dom7' },
    ],
  },
  {
    id: 'pop_ballad',
    name: 'Pop Anthem',
    genre: 'Pop & Indie',
    styleTag: 'I – V – vi – IV',
    mode: 'major',
    defaultKey: 'C',
    defaultFlavor: 'triads',
    defaultScaleId: 'major_pentatonic',
    chords: [
      { id: 'c1', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: 'V', rootOffset: 7, baseQuality: 'maj' },
      { id: 'c3', degreeRoman: 'vi', rootOffset: 9, baseQuality: 'min' },
      { id: 'c4', degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
    ],
  },
  {
    id: 'emotional_pop_ballad',
    name: 'Emotional Storyteller',
    genre: 'Pop & Indie',
    styleTag: 'i – ♭VI – ♭III – ♭VII',
    mode: 'minor',
    defaultKey: 'A',
    defaultFlavor: 'triads',
    defaultScaleId: 'minor_pentatonic',
    chords: [
      { id: 'c1', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c2', degreeRoman: '♭VI', rootOffset: 8, baseQuality: 'maj' },
      { id: 'c3', degreeRoman: '♭III', rootOffset: 3, baseQuality: 'maj' },
      { id: 'c4', degreeRoman: '♭VII', rootOffset: 10, baseQuality: 'maj' },
    ],
  },
  {
    id: 'blues_vamp',
    name: 'After-Hours Minor Blues',
    genre: 'Blues & Gospel',
    styleTag: 'i7 – iv7 – i7 – V7',
    mode: 'minor',
    defaultKey: 'G',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'blues_minor',
    chords: [
      { id: 'c1', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c2', degreeRoman: 'iv', rootOffset: 5, baseQuality: 'min' },
      { id: 'c3', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c4', degreeRoman: 'V', rootOffset: 7, baseQuality: 'dom7' },
    ],
  },
  {
    id: 'gospel_amen',
    name: 'Sunday Gospel Groove',
    genre: 'Blues & Gospel',
    styleTag: 'I7 – IV7 – I – V7',
    mode: 'mixolydian',
    defaultKey: 'Ab',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'blues_major',
    chords: [
      { id: 'c1', degreeRoman: 'I', rootOffset: 0, baseQuality: 'dom7' },
      { id: 'c2', degreeRoman: 'IV', rootOffset: 5, baseQuality: 'dom7' },
      { id: 'c3', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c4', degreeRoman: 'V', rootOffset: 7, baseQuality: 'dom7' },
    ],
  },
  {
    id: 'andalusian_cadence',
    name: 'Andalusian Descent',
    genre: 'Cinematic & Minor',
    styleTag: 'i – ♭VII – ♭VI – V7',
    mode: 'minor',
    defaultKey: 'E',
    defaultFlavor: 'triads',
    defaultScaleId: 'phrygian_dominant',
    chords: [
      { id: 'c1', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c2', degreeRoman: '♭VII', rootOffset: 10, baseQuality: 'maj' },
      { id: 'c3', degreeRoman: '♭VI', rootOffset: 8, baseQuality: 'maj' },
      { id: 'c4', degreeRoman: 'V', rootOffset: 7, baseQuality: 'dom7' },
    ],
  },
  {
    id: 'cinema_horizon',
    name: 'Starlight Film Score',
    genre: 'Cinematic & Minor',
    styleTag: '♭VI – ♭VII – i – v',
    mode: 'minor',
    defaultKey: 'D',
    defaultFlavor: 'sevenths',
    defaultScaleId: 'natural_minor',
    chords: [
      { id: 'c1', degreeRoman: '♭VI', rootOffset: 8, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: '♭VII', rootOffset: 10, baseQuality: 'maj' },
      { id: 'c3', degreeRoman: 'i', rootOffset: 0, baseQuality: 'min' },
      { id: 'c4', degreeRoman: 'v', rootOffset: 7, baseQuality: 'min' },
    ],
  },
  {
    id: 'mixolydian_vamp',
    name: 'Classic Mixolydian Jam',
    genre: 'Rock & Funk',
    styleTag: 'I – ♭VII – IV – I',
    mode: 'mixolydian',
    defaultKey: 'E',
    defaultFlavor: 'triads',
    defaultScaleId: 'mixolydian',
    chords: [
      { id: 'c1', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { id: 'c2', degreeRoman: '♭VII', rootOffset: 10, baseQuality: 'maj' },
      { id: 'c3', degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
      { id: 'c4', degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
    ],
  },
];

// ==========================================
// SMART CHORD PROGRESSION GENERATOR
// ==========================================

interface ProgressionFormula {
  name: string;
  genre: StyleCategory;
  mode: 'major' | 'minor' | 'dorian' | 'mixolydian';
  flavor: HarmonicFlavor;
  scaleId: ScaleId;
  slots: Omit<JamChordSlot, 'id'>[];
}

const GENERATOR_FORMULAS: ProgressionFormula[] = [
  {
    name: 'Neo-Soul Floating Circle',
    genre: 'Neo-Soul & R&B',
    mode: 'major',
    flavor: 'lush',
    scaleId: 'major_pentatonic',
    slots: [
      { degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
      { degreeRoman: 'iii', rootOffset: 4, baseQuality: 'min' },
      { degreeRoman: 'vi', rootOffset: 9, baseQuality: 'min' },
      { degreeRoman: 'ii', rootOffset: 2, baseQuality: 'min' },
    ],
  },
  {
    name: 'Backdoor Jazzhop Loop',
    genre: 'Lo-Fi & Chill',
    mode: 'major',
    flavor: 'lush',
    scaleId: 'major_ionian',
    slots: [
      { degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
      { degreeRoman: 'iv', rootOffset: 5, baseQuality: 'min' },
      { degreeRoman: 'iii', rootOffset: 4, baseQuality: 'min' },
      { degreeRoman: 'VI7', rootOffset: 9, baseQuality: '7b9' },
    ],
  },
  {
    name: 'Soulful Secondary Dominant Walk',
    genre: 'Blues & Gospel',
    mode: 'major',
    flavor: 'sevenths',
    scaleId: 'blues_major',
    slots: [
      { degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { degreeRoman: 'III7', rootOffset: 4, baseQuality: 'dom7' },
      { degreeRoman: 'vi', rootOffset: 9, baseQuality: 'min' },
      { degreeRoman: 'II7', rootOffset: 2, baseQuality: 'dom7' },
    ],
  },
  {
    name: 'Autumn Cycle of Fifths',
    genre: 'Jazz & Bossa',
    mode: 'minor',
    flavor: 'sevenths',
    scaleId: 'natural_minor',
    slots: [
      { degreeRoman: 'iv', rootOffset: 5, baseQuality: 'min' },
      { degreeRoman: '♭VII7', rootOffset: 10, baseQuality: 'dom7' },
      { degreeRoman: '♭III', rootOffset: 3, baseQuality: 'maj' },
      { degreeRoman: '♭VI', rootOffset: 8, baseQuality: 'maj' },
    ],
  },
  {
    name: 'Lydian Cinema Dream',
    genre: 'Cinematic & Minor',
    mode: 'major',
    flavor: 'sevenths',
    scaleId: 'lydian',
    slots: [
      { degreeRoman: 'I', rootOffset: 0, baseQuality: 'maj' },
      { degreeRoman: 'II', rootOffset: 2, baseQuality: 'maj' },
      { degreeRoman: 'vi', rootOffset: 9, baseQuality: 'min' },
      { degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
    ],
  },
  {
    name: 'Funky Clavinet Pocket',
    genre: 'Rock & Funk',
    mode: 'dorian',
    flavor: 'sevenths',
    scaleId: 'minor_pentatonic',
    slots: [
      { degreeRoman: 'i7', rootOffset: 0, baseQuality: 'min' },
      { degreeRoman: 'ii7', rootOffset: 2, baseQuality: 'min' },
      { degreeRoman: '♭III', rootOffset: 3, baseQuality: 'maj' },
      { degreeRoman: 'IV7', rootOffset: 5, baseQuality: 'dom7' },
    ],
  },
  {
    name: 'Indie Nostalgia',
    genre: 'Pop & Indie',
    mode: 'major',
    flavor: 'triads',
    scaleId: 'major_pentatonic',
    slots: [
      { degreeRoman: 'I', rootOffset: 0, baseQuality: 'add9' },
      { degreeRoman: 'iii', rootOffset: 4, baseQuality: 'min' },
      { degreeRoman: 'IV', rootOffset: 5, baseQuality: 'maj' },
      { degreeRoman: 'iv', rootOffset: 5, baseQuality: 'm6' },
    ],
  },
  {
    name: 'Late Night Turnaround',
    genre: 'Jazz & Bossa',
    mode: 'major',
    flavor: 'lush',
    scaleId: 'major_pentatonic',
    slots: [
      { degreeRoman: 'iii', rootOffset: 4, baseQuality: 'min' },
      { degreeRoman: 'VI7', rootOffset: 9, baseQuality: '7alt' },
      { degreeRoman: 'ii', rootOffset: 2, baseQuality: 'min' },
      { degreeRoman: 'V7', rootOffset: 7, baseQuality: 'dom13' },
    ],
  },
];

export function generateSmartProgression(
  styleFilter: StyleCategory,
  currentPresetId?: string
): {
  name: string;
  genre: StyleCategory;
  mode: 'major' | 'minor' | 'dorian' | 'mixolydian';
  flavor: HarmonicFlavor;
  scaleId: ScaleId;
  chords: JamChordSlot[];
} {
  // Combine built-in presets and generator formulas matching the style filter
  const allCandidates: ProgressionFormula[] = [
    ...JAM_PRESETS.filter((p) => p.id !== currentPresetId).map((p) => ({
      name: p.name,
      genre: p.genre,
      mode: p.mode,
      flavor: p.defaultFlavor,
      scaleId: p.defaultScaleId,
      slots: p.chords.map(({ degreeRoman, rootOffset, baseQuality }) => ({
        degreeRoman,
        rootOffset,
        baseQuality,
      })),
    })),
    ...GENERATOR_FORMULAS,
  ];

  const filtered =
    styleFilter === 'All Styles'
      ? allCandidates
      : allCandidates.filter((c) => c.genre === styleFilter);

  const pool = filtered.length > 0 ? filtered : allCandidates;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  return {
    name: pick.name,
    genre: pick.genre,
    mode: pick.mode,
    flavor: pick.flavor,
    scaleId: pick.scaleId,
    chords: pick.slots.map((s, idx) => ({
      ...s,
      id: `slot_${Date.now()}_${idx}`,
    })),
  };
}

// ==========================================
// TAP-TO-SWAP CHORD SUGGESTION PALETTE
// ==========================================

export interface ChordSwapSuggestion {
  label: string;
  degreeRoman: string;
  rootOffset: number;
  baseQuality: ChordQuality;
  group: 'In-Key (Diatonic)' | 'Borrowed & Soulful' | 'Spicy Turnarounds';
  vibeHint: string;
}

export function getChordSwapSuggestions(
  keyRoot: NoteName,
  flavor: HarmonicFlavor
): (ChordSwapSuggestion & { previewSymbol: string })[] {
  const rawList: ChordSwapSuggestion[] = [
    // In-Key Diatonic (Major & Relative Minor)
    {
      label: 'Tonic Major',
      degreeRoman: 'I',
      rootOffset: 0,
      baseQuality: 'maj',
      group: 'In-Key (Diatonic)',
      vibeHint: 'Home base major',
    },
    {
      label: 'Supertonic Minor',
      degreeRoman: 'ii',
      rootOffset: 2,
      baseQuality: 'min',
      group: 'In-Key (Diatonic)',
      vibeHint: 'Smooth pre-dominant',
    },
    {
      label: 'Mediant Minor',
      degreeRoman: 'iii',
      rootOffset: 4,
      baseQuality: 'min',
      group: 'In-Key (Diatonic)',
      vibeHint: 'Warm & wistful',
    },
    {
      label: 'Subdominant Major',
      degreeRoman: 'IV',
      rootOffset: 5,
      baseQuality: 'maj',
      group: 'In-Key (Diatonic)',
      vibeHint: 'Open & uplifting',
    },
    {
      label: 'Dominant',
      degreeRoman: 'V',
      rootOffset: 7,
      baseQuality: 'dom7',
      group: 'In-Key (Diatonic)',
      vibeHint: 'Pulls back home',
    },
    {
      label: 'Relative Minor',
      degreeRoman: 'vi',
      rootOffset: 9,
      baseQuality: 'min',
      group: 'In-Key (Diatonic)',
      vibeHint: 'Emotional minor center',
    },
    // Borrowed & Soulful (Modal Interchange)
    {
      label: 'Minor Tonic',
      degreeRoman: 'i',
      rootOffset: 0,
      baseQuality: 'min',
      group: 'Borrowed & Soulful',
      vibeHint: 'Parallel minor home',
    },
    {
      label: 'Minor Subdominant',
      degreeRoman: 'iv',
      rootOffset: 5,
      baseQuality: 'm6',
      group: 'Borrowed & Soulful',
      vibeHint: 'Nostalgic heart-melter',
    },
    {
      label: 'Backdoor ♭VII',
      degreeRoman: '♭VII',
      rootOffset: 10,
      baseQuality: 'dom9',
      group: 'Borrowed & Soulful',
      vibeHint: 'Neo-Soul & Mixolydian lift',
    },
    {
      label: 'Epic ♭VI',
      degreeRoman: '♭VI',
      rootOffset: 8,
      baseQuality: 'maj7',
      group: 'Borrowed & Soulful',
      vibeHint: 'Cinematic & dreamy',
    },
    {
      label: 'Warm ♭III',
      degreeRoman: '♭III',
      rootOffset: 3,
      baseQuality: 'maj7',
      group: 'Borrowed & Soulful',
      vibeHint: 'Minor-key sunlight',
    },
    // Spicy Turnarounds & Secondary Dominants
    {
      label: 'Turnaround VI7',
      degreeRoman: 'VI7',
      rootOffset: 9,
      baseQuality: '7b9',
      group: 'Spicy Turnarounds',
      vibeHint: 'Pulls strongly to ii',
    },
    {
      label: 'Lydian Dominant II7',
      degreeRoman: 'II7',
      rootOffset: 2,
      baseQuality: 'dom13',
      group: 'Spicy Turnarounds',
      vibeHint: 'Bossa & Gospel lift to V or ii',
    },
    {
      label: 'Soul III7',
      degreeRoman: 'III7',
      rootOffset: 4,
      baseQuality: '7alt',
      group: 'Spicy Turnarounds',
      vibeHint: 'Pulls deeply into vi or IV',
    },
    {
      label: 'Tritone Sub ♭II7',
      degreeRoman: '♭II7',
      rootOffset: 1,
      baseQuality: 'dom9',
      group: 'Spicy Turnarounds',
      vibeHint: 'Silky jazz slide into I',
    },
    {
      label: 'Half-Dim iiø',
      degreeRoman: 'iiø',
      rootOffset: 2,
      baseQuality: 'min7b5',
      group: 'Spicy Turnarounds',
      vibeHint: 'Minor ii–V–i setup',
    },
  ];

  return rawList.map((item) => {
    const rootNote = getNoteByOffset(keyRoot, item.rootOffset);
    const resolvedQ = resolveChordQualityWithFlavor(item.baseQuality, flavor);
    const previewSymbol = `${rootNote}${CHORD_QUALITIES[resolvedQ].suffix}`;
    return {
      ...item,
      previewSymbol,
    };
  });
}

// ==========================================
// CHORD & SCALE RESOLUTION
// ==========================================

export interface ResolvedScaleNote {
  note: NoteName;
  semitoneFromRoot: number;
  degreeLabel: string;
  isRoot: boolean;
  isBlueNote: boolean;
}

export function getRightHandScaleNotes(
  scaleRoot: NoteName,
  scaleId: ScaleId
): ResolvedScaleNote[] {
  const scale = SCALES[scaleId];
  const blueSet = new Set(scale.blueIntervals || []);
  return scale.intervals.map((interval, index) => ({
    note: getNoteByOffset(scaleRoot, interval),
    semitoneFromRoot: interval,
    degreeLabel: scale.degreeLabels[index] || '',
    isRoot: interval === 0,
    isBlueNote: blueSet.has(interval),
  }));
}

export function resolveChordQualityWithFlavor(
  baseQuality: ChordQuality,
  flavor: HarmonicFlavor,
  customOverride?: ChordQuality
): ChordQuality {
  if (customOverride) return customOverride;
  const meta = CHORD_QUALITIES[baseQuality] || CHORD_QUALITIES.maj;
  if (flavor === 'triads') return meta.triadBase;
  if (flavor === 'sevenths') return meta.seventhUpgrade;
  return meta.lushUpgrade;
}

export interface ResolvedChord {
  id: string;
  index: number;
  degreeRoman: string;
  rootOffset: number;
  rootNote: NoteName;
  quality: ChordQuality;
  qualityLabel: string;
  chordSymbol: string;
  notes: NoteName[];
  voicings: VoicingPosition[];
}

export function buildLeftHandVoicings(
  rootNote: NoteName,
  quality: ChordQuality
): VoicingPosition[] {
  const rootSemitone = getNoteIndex(rootNote);
  const baseRootMidi = 48 + rootSemitone; // C3..B3
  const meta = CHORD_QUALITIES[quality] || CHORD_QUALITIES.maj;
  // Take up to 4 essential notes for comfortable 1-hand voicing
  const rawIntervals = meta.intervals.slice(0, 4);
  const isFourNote = rawIntervals.length >= 4;

  const rootMidi = rawIntervals.map((int) => baseRootMidi + (int > 12 ? int - 12 : int)).sort((a, b) => a - b);

  let firstInvMidi = [...rootMidi.slice(1), rootMidi[0] + 12];
  if (firstInvMidi[firstInvMidi.length - 1] > 65) {
    firstInvMidi = firstInvMidi.map((m) => m - 12);
  }

  let secondInvMidi = [
    ...rootMidi.slice(2),
    rootMidi[0] + 12,
    rootMidi[1] + 12,
  ];
  if (secondInvMidi[secondInvMidi.length - 1] > 65) {
    secondInvMidi = secondInvMidi.map((m) => m - 12);
  }

  const shellMidi = isFourNote
    ? [baseRootMidi, baseRootMidi + rawIntervals[1], baseRootMidi + (rawIntervals[3] % 12)]
    : [baseRootMidi, baseRootMidi + rawIntervals[rawIntervals.length - 1], baseRootMidi + 12];

  return [
    {
      id: 'root',
      label: 'Root Position',
      shortLabel: 'Root Pos',
      midiNotes: rootMidi,
      noteNames: rootMidi.map(midiToNoteName),
      lhFingers: isFourNote ? '5 – 3 – 2 – 1' : '5 – 3 – 1',
    },
    {
      id: 'first',
      label: '1st Inversion',
      shortLabel: '1st Inv',
      midiNotes: firstInvMidi,
      noteNames: firstInvMidi.map(midiToNoteName),
      lhFingers: isFourNote ? '5 – 3 – 2 – 1' : '5 – 2 – 1',
    },
    {
      id: 'second',
      label: '2nd Inversion',
      shortLabel: '2nd Inv',
      midiNotes: secondInvMidi,
      noteNames: secondInvMidi.map(midiToNoteName),
      lhFingers: isFourNote ? '5 – 4 – 2 – 1' : '5 – 3 – 1',
    },
    {
      id: 'shell',
      label: isFourNote ? 'Root + 3rd + 7th Shell' : 'Open Power 5th',
      shortLabel: isFourNote ? '1-3-7 Shell' : 'Power 5th',
      midiNotes: shellMidi,
      noteNames: shellMidi.map(midiToNoteName),
      lhFingers: '5 – 2 – 1',
    },
  ];
}

export function resolveProgressionChords(
  keyRoot: NoteName,
  slots: JamChordSlot[],
  flavor: HarmonicFlavor
): ResolvedChord[] {
  return slots.map((slot, index) => {
    const rootNote = getNoteByOffset(keyRoot, slot.rootOffset);
    const quality = resolveChordQualityWithFlavor(
      slot.baseQuality,
      flavor,
      slot.customQualityOverride
    );
    const meta = CHORD_QUALITIES[quality] || CHORD_QUALITIES.maj;
    const notes = Array.from(
      new Set(meta.intervals.map((int) => getNoteByOffset(rootNote, int)))
    );
    const chordSymbol = `${rootNote}${meta.suffix}`;
    const voicings = buildLeftHandVoicings(rootNote, quality);

    return {
      id: slot.id,
      index,
      degreeRoman: slot.degreeRoman,
      rootOffset: slot.rootOffset,
      rootNote,
      quality,
      qualityLabel: meta.label,
      chordSymbol,
      notes,
      voicings,
    };
  });
}
