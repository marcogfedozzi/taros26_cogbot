import React from 'react';
import { ComponentCategory } from '../types/robot';
import { ConfigurationSummary } from '../utils/robotCalculations';
import { Boxes, Eye, Brain, Footprints, ClipboardCheck } from 'lucide-react';

export type ActiveTab = ComponentCategory | 'review';

interface CategoryNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  summary: ConfigurationSummary;
}

interface TabDefinition {
  id: ActiveTab;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const TABS: TabDefinition[] = [
  {
    id: 'embodiment',
    label: '01. Embodiment',
    sublabel: 'Physical Chassis',
    icon: Boxes
  },
  {
    id: 'sensor',
    label: '02. Sensors',
    sublabel: 'Perception Inputs',
    icon: Eye
  },
  {
    id: 'cognitive',
    label: '03. Cognitive',
    sublabel: 'Architecture Stack',
    icon: Brain
  },
  {
    id: 'motor',
    label: '04. Motor',
    sublabel: 'Action Repertoire',
    icon: Footprints
  },
  {
    id: 'review',
    label: '05. Collective Result',
    sublabel: 'Robot Schematic & Review',
    icon: ClipboardCheck
  }
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeTab,
  onSelectTab,
  summary
}) => {
  return (
    <nav className="flex bg-white border-b border-slate-200 px-4 sm:px-6 overflow-x-auto scrollbar-none mb-5">
      <div className="flex space-x-1 sm:space-x-4 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          // Count of items selected in this category
          let count = 0;
          if (tab.id !== 'review') {
            count = summary.selectedByCategory[tab.id as ComponentCategory].length;
          } else {
            count = summary.selectedComponents.length;
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
