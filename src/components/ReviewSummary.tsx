import React, { useState } from 'react';
import { RobotComponent, Scenario } from '../types/robot';
import { ConfigurationSummary, generateTextSummary } from '../utils/robotCalculations';
import { DynamicIcon } from './DynamicIcon';
import {
  Boxes,
  Eye,
  Brain,
  Footprints,
  Copy,
  Check,
  Share2,
  Printer,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Layers,
  ShieldAlert
} from 'lucide-react';

interface ReviewSummaryProps {
  teamName: string;
  scenario: Scenario;
  summary: ConfigurationSummary;
  totalBudget: number;
  onEditCategory: (category: 'embodiment' | 'sensor' | 'cognitive' | 'motor') => void;
  onShare: () => void;
  shareCopied: boolean;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  teamName,
  scenario,
  summary,
  totalBudget,
  onEditCategory,
  onShare,
  shareCopied
}) => {
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyText = () => {
    const text = generateTextSummary(
      { teamName, selectedScenarioId: scenario.id, selectedItemIds: summary.selectedComponents.map(c => c.id) },
      summary,
      scenario.title,
      totalBudget
    );
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadJSON = () => {
    const data = {
      teamName: teamName || 'RescueUnit',
      scenario: {
        id: scenario.id,
        title: scenario.title
      },
      budget: {
        total: totalBudget,
        spent: summary.totalEffectiveCost,
        remaining: summary.remainingPoints,
        savingsFromSynergies: summary.totalSavings
      },
      embodiment: summary.activeEmbodiment,
      sensors: summary.selectedByCategory.sensor,
      cognitiveSkills: summary.selectedByCategory.cognitive,
      motorSkills: summary.selectedByCategory.motor,
      activeSynergies: summary.activeSynergies
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robot-configuration-${(teamName || 'unit').toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Top Banner with Codename and Budget Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                Robot Architecture Blueprint
              </span>
              <span className="text-xs text-slate-500">
                Ready for Workshop Evaluation
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
              {teamName ? teamName : "Rescue Unit (Unnamed)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Mission Context: <strong className="text-slate-700">{scenario.title}</strong>
            </p>
          </div>

          {/* Points Accounting Summary */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 shrink-0">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Budget
              </span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {summary.totalEffectiveCost} <span className="text-xs font-normal text-slate-400">/ {totalBudget} pts</span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Points Left
              </span>
              <span
                className={`text-xl font-bold font-mono ${
                  summary.isOverBudget ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {summary.remainingPoints} pts
              </span>
            </div>

            {summary.totalSavings > 0 && (
              <>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Synergy Discount
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-600">
                    -{summary.totalSavings} pts
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Toolbar for Workshop */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 print:hidden">
          <span className="text-xs text-slate-500">
            Share this configuration with your workshop table or organizer:
          </span>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wide rounded-md transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wide rounded-md transition-colors cursor-pointer"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Share URL</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wide rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wide rounded-md transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {summary.warnings.length > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Configuration Notes:</span>
            </div>
            {summary.warnings.map((warn, i) => (
              <p key={i} className="text-amber-800">
                &bull; {warn}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Grid of 4 Architectural Layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Embodiment Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  1. Physical Embodiment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEditCategory('embodiment')}
                className="text-xs text-blue-600 hover:underline print:hidden cursor-pointer"
              >
                Change &rarr;
              </button>
            </div>

            {summary.activeEmbodiment ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <DynamicIcon name={summary.activeEmbodiment.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {summary.activeEmbodiment.name}
                    </h4>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      Cost: {summary.activeEmbodiment.baseCost} pts
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {summary.activeEmbodiment.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {summary.activeEmbodiment.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>No physical body selected.</p>
                <button
                  type="button"
                  onClick={() => onEditCategory('embodiment')}
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                  Select an Embodiment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Sensors Equipped */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  2. Sensory Substrates ({summary.selectedByCategory.sensor.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEditCategory('sensor')}
                className="text-xs text-blue-600 hover:underline print:hidden cursor-pointer"
              >
                Modify &rarr;
              </button>
            </div>

            {summary.selectedByCategory.sensor.length > 0 ? (
              <div className="space-y-2.5">
                {summary.selectedByCategory.sensor.map(s => (
                  <div
                    key={s.id}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                        <DynamicIcon name={s.icon} className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {s.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {s.shortDescription}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-600 shrink-0">
                      {s.baseCost}p
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>No sensors equipped.</p>
                <button
                  type="button"
                  onClick={() => onEditCategory('sensor')}
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                  Equip Sensors
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Cognitive Architecture */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  3. Cognitive Skills ({summary.selectedByCategory.cognitive.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEditCategory('cognitive')}
                className="text-xs text-blue-600 hover:underline print:hidden cursor-pointer"
              >
                Modify &rarr;
              </button>
            </div>

            {summary.selectedByCategory.cognitive.length > 0 ? (
              <div className="space-y-2.5">
                {summary.selectedByCategory.cognitive.map(c => (
                  <div
                    key={c.id}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                        <DynamicIcon name={c.icon} className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {c.shortDescription}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-600 shrink-0">
                      {c.baseCost}p
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>No cognitive skills selected.</p>
                <button
                  type="button"
                  onClick={() => onEditCategory('cognitive')}
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                  Configure Cognitive Architecture
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. Motor Repertoire */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  4. Motor Skills ({summary.selectedByCategory.motor.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEditCategory('motor')}
                className="text-xs text-blue-600 hover:underline print:hidden cursor-pointer"
              >
                Modify &rarr;
              </button>
            </div>

            {summary.selectedByCategory.motor.length > 0 ? (
              <div className="space-y-2.5">
                {summary.selectedByCategory.motor.map(m => (
                  <div
                    key={m.id}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                        <DynamicIcon name={m.icon} className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {m.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {m.shortDescription}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-600 shrink-0">
                      {m.baseCost}p
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>No motor skills equipped.</p>
                <button
                  type="button"
                  onClick={() => onEditCategory('motor')}
                  className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                  Equip Motor Skills
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Synergies & Variable Cost Ledger */}
      {summary.activeSynergies.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
              Active Architectural Synergies (-{summary.totalSavings} pts discount on total)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summary.activeSynergies.map((syn, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-200/80 text-xs text-slate-700">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-900">
                    {syn.itemA} &harr; {syn.itemB}
                  </span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    {syn.costChange > 0 ? `+${syn.costChange}` : syn.costChange} pts on total
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {syn.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Descriptive Architectural Profiles (Purely descriptive, strictly NO numerical grading) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Architectural Characteristics (Descriptive Profile)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-slate-500 font-medium block text-[11px] mb-1">
              Morphology Archetype
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {summary.activeEmbodiment?.name || "Unembodied"}
            </span>
            <span className="text-slate-500 text-[11px] mt-1 block">
              {summary.activeEmbodiment?.tags.join(' • ') || 'No physical constraints defined'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-slate-500 font-medium block text-[11px] mb-1">
              Sensory Bandwidth
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {summary.selectedByCategory.sensor.length} Modalities
            </span>
            <span className="text-slate-500 text-[11px] mt-1 block">
              {summary.selectedByCategory.sensor.map(s => s.name.split(' ')[0]).join(', ') || 'No inputs'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-slate-500 font-medium block text-[11px] mb-1">
              Cognitive Level
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {summary.selectedByCategory.cognitive.some(c => c.id === 'causal_reasoning')
                ? 'Deliberative & Causal'
                : summary.selectedByCategory.cognitive.some(c => c.id === 'hierarchical_planning')
                ? 'Hierarchical Planning'
                : summary.selectedByCategory.cognitive.some(c => c.id === 'spatial_slam')
                ? 'Spatial & Memory'
                : 'Basic / Reactive'}
            </span>
            <span className="text-slate-500 text-[11px] mt-1 block">
              {summary.selectedByCategory.cognitive.length} active cognitive modules
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <span className="text-slate-500 font-medium block text-[11px] mb-1">
              Physical Intervention
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {summary.selectedByCategory.motor.some(m => m.id === 'heavy_debris_shoring')
                ? 'Structural Shoring'
                : summary.selectedByCategory.motor.some(m => m.id === 'precision_arm')
                ? 'Dexterous Manipulation'
                : summary.selectedByCategory.motor.some(m => m.id === 'tool_payload_deployment')
                ? 'Supply Deployment'
                : 'Scouting & Navigation'}
            </span>
            <span className="text-slate-500 text-[11px] mt-1 block">
              {summary.selectedByCategory.motor.length} motor competencies
            </span>
          </div>
        </div>
      </div>

      {/* Workshop Discussion Prompts for In-Person Debate */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Workshop Discussion Questions for Your Team</span>
        </h3>
        <p className="text-xs text-slate-600 mb-3">
          These questions will be discussed during the in-person workshop session:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">
              1. Developmental Continuity:
            </strong>
            <span>
              How does your robot acquire or bootstrap its sensorimotor models? Can it adapt if an actuator or sensor is damaged by rubble?
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">
              2. Sensor Noise & Uncertainty:
            </strong>
            <span>
              In smoke and electrical interference, which sensory cues can the cognitive architecture rely on for localization?
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">
              3. Structural Risk Trade-offs:
            </strong>
            <span>
              Does the robot have sufficient causal intuition to decide when lifting a collapsed beam could injure a trapped survivor?
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">
              4. Autonomy vs. Teleoperation:
            </strong>
            <span>
              When radio signals fail underground, does your configuration possess the self-directed curiosity and mapping needed to return safely?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
