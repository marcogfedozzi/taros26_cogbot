import React from 'react';
import { ConfigurationSummary } from '../utils/robotCalculations';
import { DynamicIcon } from './DynamicIcon';
import { Sparkles, ArrowRight, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ActiveTab } from './CategoryNav';

interface CurrentBuildSidebarProps {
  summary: ConfigurationSummary;
  totalBudget: number;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onRemoveItem: (id: string) => void;
}

export const CurrentBuildSidebar: React.FC<CurrentBuildSidebarProps> = ({
  summary,
  totalBudget,
  activeTab,
  onSelectTab,
  onRemoveItem
}) => {
  const hasEmbodiment = Boolean(summary.activeEmbodiment);
  const sensorCount = summary.selectedByCategory.sensor.length;
  const cognitiveCount = summary.selectedByCategory.cognitive.length;
  const motorCount = summary.selectedByCategory.motor.length;

  return (
    <aside className="w-full lg:w-72 bg-slate-900 text-white p-5 lg:p-6 flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Current Build
        </h2>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          {summary.selectedComponents.length} items
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-80 lg:max-h-none pr-1 scrollbar-thin">
        {/* 1. Embodiment Slot */}
        {summary.activeEmbodiment ? (
          <div className="p-3 bg-slate-800/90 rounded-lg border-l-4 border-blue-400 shadow-xs relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                01. Embodiment
              </span>
              <button
                type="button"
                onClick={() => onRemoveItem(summary.activeEmbodiment!.id)}
                className="text-slate-400 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                title="Remove embodiment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-sm font-semibold text-white mt-0.5 truncate">
              {summary.activeEmbodiment.name}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
              <span>Cost: {summary.activeEmbodiment.baseCost} pts</span>
              <span className="text-[10px] text-blue-300 font-mono">1 Slot</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('embodiment')}
            className="w-full p-3 bg-slate-800/30 border border-dashed border-slate-700 hover:border-blue-500/50 rounded-lg flex items-center justify-center h-14 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs text-slate-400 group-hover:text-blue-400 font-medium">
              + Select Embodiment Chassis
            </span>
          </button>
        )}

        {/* 2. Sensors Slot */}
        {sensorCount > 0 ? (
          <div className="p-3 bg-slate-800/90 rounded-lg border-l-4 border-emerald-400 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                02. Sensors ({sensorCount})
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-300">
                {summary.categoryCosts.sensor} pts
              </span>
            </div>
            <div className="space-y-1.5 pt-0.5">
              {summary.selectedByCategory.sensor.map(s => (
                <div key={s.id} className="flex items-center justify-between text-xs group/item">
                  <span className="truncate text-slate-200 pr-1">{s.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">{s.baseCost}p</span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(s.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('sensor')}
            className="w-full p-3 bg-slate-800/30 border border-dashed border-slate-700 hover:border-emerald-500/50 rounded-lg flex items-center justify-center h-14 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-medium">
              + Equip Sensors ({summary.categoryCosts.sensor}p)
            </span>
          </button>
        )}

        {/* 3. Cognitive Slot */}
        {cognitiveCount > 0 ? (
          <div className="p-3 bg-slate-800/90 rounded-lg border-l-4 border-amber-400 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                03. Cognitive Skills ({cognitiveCount})
              </span>
              <span className="text-xs font-mono font-semibold text-amber-300">
                {summary.categoryCosts.cognitive} pts
              </span>
            </div>
            <div className="space-y-1.5 pt-0.5">
              {summary.selectedByCategory.cognitive.map(c => (
                <div key={c.id} className="flex items-center justify-between text-xs group/item">
                  <span className="truncate text-slate-200 pr-1">{c.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">{c.baseCost}p</span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(c.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('cognitive')}
            className="w-full p-3 bg-slate-800/30 border border-dashed border-slate-700 hover:border-amber-500/50 rounded-lg flex items-center justify-center h-14 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs text-slate-400 group-hover:text-amber-400 font-medium">
              + Equip Cognitive Architecture
            </span>
          </button>
        )}

        {/* 4. Motor Slot */}
        {motorCount > 0 ? (
          <div className="p-3 bg-slate-800/90 rounded-lg border-l-4 border-purple-400 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                04. Motor Repertoire ({motorCount})
              </span>
              <span className="text-xs font-mono font-semibold text-purple-300">
                {summary.categoryCosts.motor} pts
              </span>
            </div>
            <div className="space-y-1.5 pt-0.5">
              {summary.selectedByCategory.motor.map(m => (
                <div key={m.id} className="flex items-center justify-between text-xs group/item">
                  <span className="truncate text-slate-200 pr-1">{m.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">{m.baseCost}p</span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(m.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('motor')}
            className="w-full p-3 bg-slate-800/30 border border-dashed border-slate-700 hover:border-purple-500/50 rounded-lg flex items-center justify-center h-14 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs text-slate-400 group-hover:text-purple-400 font-medium">
              + Select Motor Skills
            </span>
          </button>
        )}

        {/* Active Synergies Badge in Rail */}
        {summary.totalSavings > 0 && (
          <div className="p-2.5 bg-blue-950/60 border border-blue-800/60 rounded-lg text-[11px] text-blue-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Synergy Savings:
            </span>
            <span className="font-mono font-bold text-blue-300">
              +{summary.totalSavings} pts
            </span>
          </div>
        )}

        {summary.isOverBudget && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-lg text-[11px] text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Over budget by {Math.abs(summary.remainingPoints)} points</span>
          </div>
        )}
      </div>

      {/* Finalize Configuration Button */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => onSelectTab('review')}
          className={`w-full py-3 px-4 rounded-lg font-bold uppercase tracking-tight text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'review'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <span>Finalize Configuration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
