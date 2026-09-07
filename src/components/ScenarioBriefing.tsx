import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { Scenario } from '../types/robot';

interface ScenarioBriefingProps {
  scenario: Scenario;
}

export const ScenarioBriefing: React.FC<ScenarioBriefingProps> = ({ scenario }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50/80 border border-blue-200/80 rounded-lg p-3 sm:p-4 mb-5">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start sm:items-center justify-between cursor-pointer gap-2"
      >
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                Scenario
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-blue-950 uppercase tracking-wide">
                {scenario.title}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-blue-800/80 mt-0.5 line-clamp-1">
              {scenario.subtitle} &bull; Environment: {scenario.environment}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer shrink-0 text-xs font-bold uppercase flex items-center gap-1"
          aria-label={isExpanded ? "Collapse briefing" : "Expand briefing"}
        >
          <span className="text-[10px] hidden sm:inline">{isExpanded ? 'Less' : 'Briefing'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-blue-200/80 text-xs text-blue-900 space-y-3">
          <p className="leading-relaxed">
            {scenario.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/70 p-2.5 rounded border border-blue-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-1">
                Operational Environment:
              </span>
              <p className="text-[11px] text-slate-700">
                {scenario.environment}
              </p>
            </div>

            <div className="bg-white/70 p-2.5 rounded border border-blue-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-1">
                Key Challenges:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-700">
                {scenario.keyChallenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">&bull;</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
