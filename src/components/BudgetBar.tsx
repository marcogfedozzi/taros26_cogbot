import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ConfigurationSummary } from '../utils/robotCalculations';

interface BudgetBarProps {
  summary: ConfigurationSummary;
  totalBudget: number;
  onNavigateToReview?: () => void;
}

export const BudgetBar: React.FC<BudgetBarProps> = ({
  summary,
  totalBudget,
  onNavigateToReview
}) => {
  const percentage = Math.min(100, Math.round((summary.totalEffectiveCost / totalBudget) * 100));
  const isOver = summary.remainingPoints < 0;
  const isClose = summary.remainingPoints >= 0 && summary.remainingPoints <= 10;

  let barColor = "bg-emerald-500";
  if (isOver) barColor = "bg-rose-500";
  else if (isClose) barColor = "bg-amber-500";

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Points Overview */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Points Spent:</span>
              <span className={`text-xl font-bold font-mono ${isOver ? 'text-rose-600' : 'text-slate-900'}`}>
                {summary.totalEffectiveCost}
              </span>
              <span className="text-slate-400 font-mono text-sm">/ {totalBudget}</span>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Remaining:</span>
              <span
                className={`text-sm font-semibold font-mono px-2 py-0.5 rounded-md ${
                  isOver
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : isClose
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {summary.remainingPoints} pts
              </span>
            </div>

            {summary.totalSavings > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{summary.totalSavings} pts synergy discount on total</span>
              </div>
            )}
          </div>

          {/* Category Breakdown Chips */}
          <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
              <span className="text-slate-400">Body:</span>
              <span className="font-semibold text-slate-800">{summary.categoryCosts.embodiment}p</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
              <span className="text-slate-400">Sensors:</span>
              <span className="font-semibold text-slate-800">{summary.categoryCosts.sensor}p</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
              <span className="text-slate-400">Cognition:</span>
              <span className="font-semibold text-slate-800">{summary.categoryCosts.cognitive}p</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
              <span className="text-slate-400">Motor:</span>
              <span className="font-semibold text-slate-800">{summary.categoryCosts.motor}p</span>
            </div>

            {onNavigateToReview && (
              <button
                type="button"
                onClick={onNavigateToReview}
                className="ml-auto sm:ml-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Result &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        {isOver && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Exceeded budget! Please remove or swap components to stay within {totalBudget} points.</span>
          </div>
        )}
      </div>
    </div>
  );
};
