import React from 'react';
import { Bot, RotateCcw, Share2, Check, FileText, Lock } from 'lucide-react';
import { Scenario } from '../types/robot';
import { ConfigurationSummary } from '../utils/robotCalculations';

interface HeaderProps {
  workshopTitle: string;
  workshopSubtitle: string;
  teamName: string;
  onTeamNameChange: (name: string) => void;
  scenarios: Scenario[];
  selectedScenarioId: string;
  onScenarioChange: (scenarioId: string) => void;
  onReset: () => void;
  onOpenOrganizerGuide: () => void;
  onShare: () => void;
  shareCopied: boolean;
  summary: ConfigurationSummary;
  totalBudget: number;
  showOrganizerGuide?: boolean;
  isOrganizerAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  workshopTitle,
  workshopSubtitle,
  teamName,
  onTeamNameChange,
  scenarios,
  selectedScenarioId,
  onScenarioChange,
  onReset,
  onOpenOrganizerGuide,
  onShare,
  shareCopied,
  summary,
  totalBudget,
  showOrganizerGuide = true,
  isOrganizerAuthenticated = false
}) => {
  const percentage = Math.min(100, Math.round((summary.totalEffectiveCost / totalBudget) * 100));
  const isOver = summary.remainingPoints < 0;

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-white border-b border-slate-200 shadow-xs gap-3">
      {/* Title & Workshop Meta */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 uppercase">
            {workshopTitle}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {workshopSubtitle}
          </p>
        </div>
      </div>

      {/* Center/Right: Team Name, Scenario, Resource Allocation Meter & Actions */}
      <div className="flex items-center gap-3 sm:gap-6 flex-wrap lg:flex-nowrap justify-between lg:justify-end">
        {/* Team Codename input */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Unit:</span>
          <input
            id="team-codename-input"
            type="text"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="Team Codename"
            className="bg-transparent text-slate-800 font-semibold focus:outline-none w-28 sm:w-36 text-xs"
          />
        </div>

        {/* Scenario dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Scenario:</span>
          <select
            aria-label="Select scenario"
            value={selectedScenarioId}
            onChange={(e) => onScenarioChange(e.target.value)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            {scenarios.map(s => (
              <option key={s.id} value={s.id} className="bg-white text-slate-900">
                {s.title.split(':')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* High Density Resource Allocation Indicator */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">
              Resource Allocation
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xl sm:text-2xl font-black ${isOver ? 'text-rose-600' : 'text-blue-600'}`}>
                {summary.totalEffectiveCost}
              </span>
              <span className="text-slate-300 text-lg">/</span>
              <span className="text-sm sm:text-lg font-bold text-slate-400 font-mono">
                {totalBudget} pts
              </span>
            </div>
          </div>

          <div className="h-7 sm:h-9 w-24 sm:w-36 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOver ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>

        {/* Utility Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onShare}
            className="p-2 rounded-md hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Share Configuration Link"
          >
            {shareCopied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          {showOrganizerGuide && (
            <button
              type="button"
              onClick={onOpenOrganizerGuide}
              className="px-2.5 py-1.5 rounded-md hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-wide cursor-pointer flex items-center gap-1.5"
              title={isOrganizerAuthenticated ? "Open Data Guide (Unlocked)" : "Open Organizer Data Guide (Password Protected)"}
            >
              {isOrganizerAuthenticated ? (
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="hidden sm:inline">Data Guide</span>
              {isOrganizerAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-md hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Reset Selections"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

