import React, { useState } from 'react';
import {
  CompatibilityTier,
  ScaleCategory,
  ScaleCompatibilityResult,
  ScaleId,
} from '../engine/musicTheory';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ScaleBrowserProps {
  selectedScaleId: ScaleId;
  compatibilityList: ScaleCompatibilityResult[];
  onSelectScale: (scaleId: ScaleId) => void;
}

type FilterMode = 'top' | 'all' | ScaleCategory;

export function getTierBadgeStyle(tier: CompatibilityTier, isSelected: boolean) {
  switch (tier) {
    case 'bulletproof':
      return isSelected
        ? 'bg-emerald-950/60 text-emerald-200 border-emerald-400/60'
        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'colorful':
      return isSelected
        ? 'bg-sky-950/60 text-sky-200 border-sky-400/60'
        : 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    case 'spicy':
      return isSelected
        ? 'bg-fuchsia-950/60 text-fuchsia-200 border-fuchsia-400/60'
        : 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30';
  }
}

export function getTierDotColor(tier: CompatibilityTier) {
  switch (tier) {
    case 'bulletproof':
      return 'bg-emerald-400';
    case 'colorful':
      return 'bg-sky-400';
    case 'spicy':
      return 'bg-fuchsia-400';
  }
}

export const ScaleBrowser: React.FC<ScaleBrowserProps> = ({
  selectedScaleId,
  compatibilityList,
  onSelectScale,
}) => {
  const [isExpandedLibrary, setIsExpandedLibrary] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<FilterMode>('all');

  const activeScaleResult =
    compatibilityList.find((r) => r.scale.id === selectedScaleId) ||
    compatibilityList[0];

  // Always show top 3 best-fit scales + the currently selected scale if it's not in top 3
  const topQuickPicks = React.useMemo(() => {
    const top3 = compatibilityList.slice(0, 3);
    if (top3.some((r) => r.scale.id === selectedScaleId)) {
      return compatibilityList.slice(0, 4);
    }
    const current = compatibilityList.find((r) => r.scale.id === selectedScaleId);
    return current ? [...top3, current] : compatibilityList.slice(0, 4);
  }, [compatibilityList, selectedScaleId]);

  const filteredLibrary = React.useMemo(() => {
    if (categoryFilter === 'all' || categoryFilter === 'top') {
      return compatibilityList;
    }
    return compatibilityList.filter((r) => r.scale.category === categoryFilter);
  }, [compatibilityList, categoryFilter]);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Quick Scale Pills (Top 4 Best Fits + All 15 Scales Toggle) */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {topQuickPicks.map((item) => {
            const isSelected = item.scale.id === selectedScaleId;
            return (
              <button
                key={item.scale.id}
                type="button"
                onClick={() => onSelectScale(item.scale.id)}
                className={`min-h-[54px] px-2.5 py-2 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400 ring-1 ring-sky-400/50 text-white shadow-sm'
                    : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {item.scale.name}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-1">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getTierBadgeStyle(
                      item.tier,
                      isSelected
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${getTierDotColor(
                        item.tier
                      )}`}
                    />
                    {item.badgeText}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.scale.intervals.length}n
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Scale Compatibility Bar + "All 15 Scales" Drawer Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 border border-slate-800/90 rounded-xl px-3 py-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
            {activeScaleResult && (
              <>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border shrink-0 ${getTierBadgeStyle(
                    activeScaleResult.tier,
                    false
                  )}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${getTierDotColor(
                      activeScaleResult.tier
                    )}`}
                  />
                  {activeScaleResult.badgeText}
                </span>
                <span className="text-xs text-slate-300 truncate">
                  {activeScaleResult.summary}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpandedLibrary((prev) => !prev)}
            className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              isExpandedLibrary
                ? 'bg-sky-500 text-slate-950 border-sky-400'
                : 'bg-slate-900 hover:bg-slate-800 text-sky-300 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isExpandedLibrary ? 'Hide Scale Library' : 'All 15 Scales & Modes'}
            </span>
            {isExpandedLibrary ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Full 15-Scale Library with Compatibility Badges */}
      {isExpandedLibrary && (
        <div className="rounded-2xl bg-slate-950/95 border border-slate-700/90 p-3 sm:p-4 space-y-3 shadow-xl">
          {/* Category Filter Chips + Compatibility Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  { id: 'all', label: 'All (15)' },
                  { id: 'Pentatonic & Blues', label: 'Pentatonic & Blues' },
                  { id: 'Diatonic & Modes', label: 'Modes' },
                  { id: 'Jazz & Exotic', label: 'Jazz & Spicy' },
                ] as { id: FilterMode; label: string }[]
              ).map((tab) => {
                const active = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Safe / Bulletproof
              </span>
              <span className="inline-flex items-center gap-1 text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Colorful / Modal
              </span>
              <span className="inline-flex items-center gap-1 text-fuchsia-300">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400" /> Spicy / Tension
              </span>
            </div>
          </div>

          {/* Grid of All Scales with Compatibility Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
            {filteredLibrary.map((item) => {
              const isSelected = item.scale.id === selectedScaleId;
              return (
                <button
                  key={item.scale.id}
                  type="button"
                  onClick={() => {
                    onSelectScale(item.scale.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 ring-1 ring-sky-400 text-white'
                      : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.scale.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getTierBadgeStyle(
                        item.tier,
                        isSelected
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getTierDotColor(
                          item.tier
                        )}`}
                      />
                      {item.badgeText}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    {item.scale.character}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5 border-t border-slate-800/80">
                    <span>Degrees: {item.scale.degreeLabels.join(' ')}</span>
                    <span className="text-slate-300 font-semibold">
                      {item.fitPercent}% match
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
