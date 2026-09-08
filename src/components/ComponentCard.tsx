import React, { useState } from 'react';
import { RobotComponent, EffectiveComponentState } from '../types/robot';
import { DynamicIcon } from './DynamicIcon';
import {
  Check,
  Plus,
  Lock,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ComponentCardProps {
  state: EffectiveComponentState;
  onToggle: (componentId: string) => void;
  isEmbodimentCategory: boolean;
  hasOtherEmbodimentSelected: boolean;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  state,
  onToggle,
  isEmbodimentCategory,
  hasOtherEmbodimentSelected
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { component, isSelected, effectiveCost, baseCost, costDiscount, appliedModifiers, potentialSynergies, isIncompatible, incompatibleBecause, isRequirementMissing, missingRequirements, canBeSelected } = state;

  const hasDiscount = costDiscount > 0;
  const hasPenalty = costDiscount < 0;

  // Determine card border & background styling based on High Density theme
  let cardStyle = "bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 cursor-pointer transition-all relative flex flex-col justify-between";
  if (isSelected) {
    cardStyle = "bg-white border-2 border-blue-600 rounded-xl p-5 shadow-lg relative flex flex-col justify-between";
  } else if (!canBeSelected) {
    cardStyle = "bg-white border border-slate-200 rounded-xl p-5 opacity-65 grayscale relative flex flex-col justify-between";
  }

  return (
    <div
      onClick={() => {
        if (canBeSelected || isSelected) {
          onToggle(component.id);
        }
      }}
      className={cardStyle}
    >
      {/* Active Selection Pill Badge */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider">
          Active Selection
        </div>
      )}

      <div>
        {/* Icon & Category header */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isSelected
                ? 'bg-blue-600 text-white'
                : !canBeSelected
                ? 'bg-slate-200 text-slate-400'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <DynamicIcon name={component.icon} className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {component.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
          {component.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-500 my-2.5 leading-relaxed">
          {component.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {component.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Active Synergies Badge */}
        {appliedModifiers.length > 0 && isSelected && (
          <div className="mb-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-1 font-bold text-emerald-900 text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Active Synergy (Discount on Total):</span>
            </div>
            {appliedModifiers.map((mod, i) => (
              <p key={i} className="text-[11px] text-emerald-700">
                &bull; {mod.partnerName}: {mod.reason}
              </p>
            ))}
          </div>
        )}

        {/* Potential Synergies Notice */}
        {potentialSynergies.length > 0 && !isSelected && canBeSelected && (
          <div className="mb-3 bg-blue-50/80 border border-blue-200 rounded-lg p-2 text-xs text-blue-900">
            <div className="flex items-center gap-1 font-bold text-blue-900 text-[10px] uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Synergy Available</span>
            </div>
            {potentialSynergies.map((syn, i) => (
              <p key={i} className="text-[11px] text-blue-800">
                Saves {syn.potentialDiscount} pts on total with <strong>{syn.partnerName}</strong>
              </p>
            ))}
          </div>
        )}

        {/* Incompatibility Badge */}
        {isIncompatible && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-800">
            <div className="flex items-center gap-1 font-bold text-red-700 text-[10px] uppercase tracking-wider mb-0.5">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              <span>Incompatible with Build</span>
            </div>
            {incompatibleBecause.map((reason, i) => (
              <p key={i} className="text-[11px] text-red-600">
                &bull; {reason}
              </p>
            ))}
          </div>
        )}

        {/* Missing Requirements Alert */}
        {isRequirementMissing && (
          <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
            <div className="flex items-center gap-1 font-bold text-amber-800 text-[10px] uppercase tracking-wider mb-0.5">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Prerequisites Required</span>
            </div>
            {missingRequirements.map((req, i) => (
              <p key={i} className="text-[11px] text-amber-700">
                &bull; {req}
              </p>
            ))}
          </div>
        )}

        {/* Active Dynamic Operational / Safety Warning */}
        {state.activeWarnings.length > 0 && isSelected && (
          <div className="mb-3 bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[10px] uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Operational Warning:</span>
            </div>
            {state.activeWarnings.map((warn, i) => (
              <p key={i} className="text-[11px] text-amber-900 font-medium leading-tight">
                &bull; {warn}
              </p>
            ))}
          </div>
        )}

        {/* Static Caution Notice */}
        {component.warning && !isSelected && (
          <div className="mb-3 bg-amber-50/60 border border-amber-200/80 rounded-lg p-2 text-xs text-amber-900">
            <div className="flex items-center gap-1 font-bold text-amber-900 text-[10px] uppercase tracking-wider mb-0.5">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Operational Hazard Note</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              {component.warning}
            </p>
          </div>
        )}

        {/* Architecture Notes Toggle */}
        <div className="mb-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <Info className="w-3 h-3" />
            <span>{showDetails ? 'Hide Details' : 'Tech Specs'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showDetails && (
            <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
              {component.detailedDescription}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Price & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-slate-700 font-mono">
            {baseCost}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            PTS
          </span>
          {hasDiscount && isSelected && (
            <span
              title="Synergy discount applied to total configuration budget"
              className="ml-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono flex items-center gap-0.5"
            >
              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
              -{costDiscount}p to total
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(component.id);
          }}
          disabled={!canBeSelected && !isSelected}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1 ${
            isSelected
              ? 'bg-blue-600 text-white shadow-xs'
              : !canBeSelected
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3 h-3" />
              <span>Equipped</span>
            </>
          ) : !canBeSelected ? (
            <>
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>{isEmbodimentCategory && hasOtherEmbodimentSelected ? 'Swap' : 'Equip'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
