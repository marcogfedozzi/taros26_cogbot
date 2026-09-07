import React, { useState } from 'react';
import { X, Copy, Check, Code, BookOpen, Sliders, ExternalLink } from 'lucide-react';

interface OrganizerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  onBudgetOverride?: (newBudget: number) => void;
}

export const OrganizerGuideModal: React.FC<OrganizerGuideModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onBudgetOverride
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [tempBudget, setTempBudget] = useState(currentBudget);

  if (!isOpen) return null;

  const sampleSnippet = `// HOW TO ADD OR MODIFY AN ITEM IN 'src/config/workshopData.ts':
{
  id: "quantum_scanner",                // Unique ID (letters & underscores)
  name: "Quantum Gas & Voids Scanner",  // Display name
  category: "sensor",                   // 'embodiment' | 'sensor' | 'cognitive' | 'motor'
  baseCost: 18,                         // Cost in points
  icon: "Radar",                        // Lucide icon name
  shortDescription: "Detects sub-surface voids and hazardous gas pockets.",
  detailedDescription: "Longer architectural notes for participants during the workshop.",
  tags: ["Hazmat", "Sub-surface"],
  
  // OPTIONAL: Prevent incompatible choices
  incompatibleWith: ["micro_aerial_drone"],
  incompatibilityReasons: {
    "micro_aerial_drone": "Payload exceeds micro-drone flight capacity."
  },

  // OPTIONAL: Require prerequisite components
  requires: ["working_memory"],
  requirementReason: "Scanner processing requires working memory buffer.",

  // OPTIONAL: Add synergies (variable discount or penalty)
  costModifiers: [
    {
      withItemId: "spatial_slam",
      costChange: -4, // -4 pts discount when paired together
      reason: "Directly populates spatial SLAM grid with hazard coordinates (-4 pts)"
    }
  ]
}`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-tight">
                Workshop Organizer Guide: Editing Items &amp; Costs
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                No HTML knowledge required &bull; Edit single data file
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 text-xs">
            <p className="font-bold text-sm mb-1 text-blue-950">
              Where are the items stored?
            </p>
            <p className="leading-relaxed">
              All items, point costs, synergy discounts, and constraints are defined in a single file:
              <code className="bg-white px-2 py-0.5 rounded border border-blue-200 font-mono font-bold text-blue-900 mx-1">
                src/config/workshopData.ts
              </code>
              You can edit it with any text editor or in GitHub directly.
            </p>
          </div>

          {/* Quick Rules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-semibold mb-1">
                1. Change Cost
              </strong>
              <span>
                Change <code className="font-mono text-blue-700 bg-white px-1 py-0.5 rounded">baseCost: 20</code> to any number.
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-semibold mb-1">
                2. Incompatibilities
              </strong>
              <span>
                Add other item IDs to <code className="font-mono text-rose-700 bg-white px-1 py-0.5 rounded">incompatibleWith: [...]</code>.
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-semibold mb-1">
                3. Synergies (Variable Cost)
              </strong>
              <span>
                Add an entry to <code className="font-mono text-emerald-700 bg-white px-1 py-0.5 rounded">costModifiers: [...]</code> with a negative number (e.g. -5).
              </span>
            </div>
          </div>

          {/* Live Budget Override for in-session testing */}
          {onBudgetOverride && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Quick Session Budget Adjustment
                </span>
                <span className="text-[11px] text-slate-500">
                  Test your workshop with a different point budget on the fly:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="30"
                  max="300"
                  step="5"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="w-20 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => onBudgetOverride(tempBudget)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Code Snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-600" />
                Example Item Format (Copy &amp; Paste):
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto leading-relaxed border border-slate-800 max-h-72">
              {sampleSnippet}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
