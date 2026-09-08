/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { workshopConfig } from './config/workshopData';
import { ComponentCategory, RobotComponent } from './types/robot';
import {
  calculateComponentState,
  calculateConfigurationSummary,
  decodeConfigFromHash,
  encodeConfigToHash
} from './utils/robotCalculations';
import { Header } from './components/Header';
import { CurrentBuildSidebar } from './components/CurrentBuildSidebar';
import { ScenarioBriefing } from './components/ScenarioBriefing';
import { CategoryNav, ActiveTab } from './components/CategoryNav';
import { ComponentCard } from './components/ComponentCard';
import { ReviewSummary } from './components/ReviewSummary';
import { OrganizerGuideModal } from './components/OrganizerGuideModal';
import { OrganizerPasswordModal } from './components/OrganizerPasswordModal';
import { ArrowRight, ArrowLeft, Layers, PanelLeftClose, PanelLeftOpen, Lock } from 'lucide-react';

const STORAGE_KEY = 'rescue_robot_workshop_config_v1';

/**
 * =========================================================================
 * WORKSHOP ORGANIZER CONTROLS:
 * - ENABLE_DATA_GUIDE: Set to false to completely hide/remove the Data Guide
 *   from participants. Set to true to display it behind a password.
 * - ORGANIZER_PASSWORD: Password required to unlock the Data Guide.
 * =========================================================================
 */
export const ENABLE_DATA_GUIDE = true;
export const ORGANIZER_PASSWORD = 'ILostTheGame';

export default function App() {
  // 1. Initial State from URL Hash or localStorage or Defaults
  const [teamName, setTeamName] = useState<string>(() => {
    const hashData = decodeConfigFromHash(window.location.hash);
    if (hashData?.teamName) return hashData.teamName;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.teamName) return parsed.teamName;
      }
    } catch {}
    return '';
  });

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(() => {
    const hashData = decodeConfigFromHash(window.location.hash);
    if (hashData?.selectedScenarioId) return hashData.selectedScenarioId;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedScenarioId) return parsed.selectedScenarioId;
      }
    } catch {}
    return workshopConfig.scenarios[0]?.id || '';
  });

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => {
    const hashData = decodeConfigFromHash(window.location.hash);
    if (hashData?.selectedItemIds && hashData.selectedItemIds.length > 0) {
      return hashData.selectedItemIds;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.selectedItemIds)) return parsed.selectedItemIds;
      }
    } catch {}
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('embodiment');
  const [budget, setBudget] = useState<number>(workshopConfig.defaultBudget);
  const [isOrganizerGuideOpen, setIsOrganizerGuideOpen] = useState<boolean>(false);
  const [isOrganizerPasswordOpen, setIsOrganizerPasswordOpen] = useState<boolean>(false);
  const [isOrganizerAuthenticated, setIsOrganizerAuthenticated] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);

  const handleOpenOrganizerGuide = () => {
    if (isOrganizerAuthenticated) {
      setIsOrganizerGuideOpen(true);
    } else {
      setIsOrganizerPasswordOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsOrganizerAuthenticated(true);
    setIsOrganizerPasswordOpen(false);
    setIsOrganizerGuideOpen(true);
  };

  // 2. Persist to localStorage whenever state updates
  useEffect(() => {
    try {
      const payload = { teamName, selectedScenarioId, selectedItemIds };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [teamName, selectedScenarioId, selectedItemIds]);

  // Active scenario
  const currentScenario = useMemo(() => {
    return (
      workshopConfig.scenarios.find(s => s.id === selectedScenarioId) ||
      workshopConfig.scenarios[0]
    );
  }, [selectedScenarioId]);

  // Overall configuration summary calculation
  const summary = useMemo(() => {
    return calculateConfigurationSummary(
      selectedItemIds,
      workshopConfig.components,
      budget
    );
  }, [selectedItemIds, budget]);

  // Filter components for current active tab
  const activeCategoryComponents = useMemo(() => {
    if (activeTab === 'review') return [];
    return workshopConfig.components.filter(c => c.category === activeTab);
  }, [activeTab]);

  // Calculate component states for cards
  const activeComponentStates = useMemo(() => {
    return activeCategoryComponents.map(comp =>
      calculateComponentState(comp, selectedItemIds, workshopConfig.components)
    );
  }, [activeCategoryComponents, selectedItemIds]);

  // Handle toggling components
  const handleToggle = (componentId: string) => {
    const targetComp = workshopConfig.components.find(c => c.id === componentId);
    if (!targetComp) return;

    if (selectedItemIds.includes(componentId)) {
      setSelectedItemIds(prev => prev.filter(id => id !== componentId));
    } else {
      if (targetComp.category === 'embodiment') {
        const otherEmbodimentIds = workshopConfig.components
          .filter(c => c.category === 'embodiment' && c.id !== componentId)
          .map(c => c.id);

        setSelectedItemIds(prev => [
          ...prev.filter(id => !otherEmbodimentIds.includes(id)),
          componentId
        ]);
      } else {
        setSelectedItemIds(prev => [...prev, componentId]);
      }
    }
  };

  const handleRemoveItem = (componentId: string) => {
    setSelectedItemIds(prev => prev.filter(id => id !== componentId));
  };

  // Reset
  const handleReset = () => {
    if (selectedItemIds.length === 0) return;
    if (window.confirm("Are you sure you want to reset all chosen components?")) {
      setSelectedItemIds([]);
      setActiveTab('embodiment');
    }
  };

  // Share link
  const handleShare = () => {
    const hash = encodeConfigToHash({
      teamName,
      selectedScenarioId,
      selectedItemIds
    });
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  // Tab sequential navigation helper
  const tabsList: ActiveTab[] = ['embodiment', 'sensor', 'cognitive', 'motor', 'review'];
  const currentTabIndex = tabsList.indexOf(activeTab);

  const handleNextTab = () => {
    if (currentTabIndex < tabsList.length - 1) {
      setActiveTab(tabsList[currentTabIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabsList[currentTabIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* High Density Studio Header */}
      <Header
        workshopTitle={workshopConfig.workshopTitle}
        workshopSubtitle={workshopConfig.workshopSubtitle}
        teamName={teamName}
        onTeamNameChange={setTeamName}
        scenarios={workshopConfig.scenarios}
        selectedScenarioId={selectedScenarioId}
        onScenarioChange={setSelectedScenarioId}
        onReset={handleReset}
        onOpenOrganizerGuide={handleOpenOrganizerGuide}
        showOrganizerGuide={ENABLE_DATA_GUIDE}
        isOrganizerAuthenticated={isOrganizerAuthenticated}
        onShare={handleShare}
        shareCopied={shareCopied}
        summary={summary}
        totalBudget={budget}
      />

      {/* Mobile Toggle for Current Build Drawer */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <button
          type="button"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white cursor-pointer"
        >
          {showMobileSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          <span>{showMobileSidebar ? 'Hide Current Build' : 'View Current Build'}</span>
          <span className="text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded font-mono">
            {summary.selectedComponents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('review')}
          className="text-xs font-bold uppercase tracking-wider text-blue-400 hover:underline cursor-pointer"
        >
          Review ({summary.totalEffectiveCost}/{budget}p)
        </button>
      </div>

      {/* Main Studio Area */}
      <div className="flex flex-1 flex-col lg:flex-row min-h-0">
        {/* Dark Left Sidebar: Current Build Rail */}
        <div className={`${showMobileSidebar ? 'block' : 'hidden lg:flex'} shrink-0`}>
          <CurrentBuildSidebar
            summary={summary}
            totalBudget={budget}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setShowMobileSidebar(false);
            }}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        {/* Center / Right Section */}
        <section className="flex-1 flex flex-col min-w-0">
          {/* Categorical Tabs */}
          <CategoryNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            summary={summary}
          />

          {/* Main Content Workspace */}
          <div className="flex-1 px-4 sm:px-8 pb-8 max-w-7xl w-full mx-auto">
            {/* Scenario Briefing */}
            <ScenarioBriefing scenario={currentScenario} />

            {/* View Switching */}
            {activeTab === 'review' ? (
              <ReviewSummary
                teamName={teamName}
                scenario={currentScenario}
                summary={summary}
                totalBudget={budget}
                onEditCategory={(cat) => setActiveTab(cat)}
                onShare={handleShare}
                shareCopied={shareCopied}
              />
            ) : (
              <div className="space-y-5">
                {/* Category Header & Specs Bar */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-tight">
                      {activeTab === 'embodiment' && '01. Physical Embodiment Chassis'}
                      {activeTab === 'sensor' && '02. Sensory Substrates & Modalities'}
                      {activeTab === 'cognitive' && '03. Cognitive & Developmental Architecture'}
                      {activeTab === 'motor' && '04. Motor Skills & Physical Repertoire'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeTab === 'embodiment' &&
                        'Select 1 primary physical chassis defining your robot’s mechanical limits, payload capacity, and ground-traversal physics.'}
                      {activeTab === 'sensor' &&
                        'Equip sensors to perceive rubble, thermal hotspots, smoke density, and acoustic survivor distress signals.'}
                      {activeTab === 'cognitive' &&
                        'Equip reasoning, mapping, and prediction layers. Note prerequisite constraints (e.g. SLAM requires geometric depth/LiDAR).'}
                      {activeTab === 'motor' &&
                        'Equip actuation gaits, robotic arms, and debris dispensers. Incompatible motor tools will automatically lock.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Sub-Allocation
                    </span>
                    <span className="text-sm sm:text-base font-black font-mono text-blue-600">
                      {summary.categoryCosts[activeTab as ComponentCategory]} pts
                    </span>
                  </div>
                </div>

                {/* Component Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeComponentStates.map(itemState => (
                    <ComponentCard
                      key={itemState.component.id}
                      state={itemState}
                      onToggle={handleToggle}
                      isEmbodimentCategory={activeTab === 'embodiment'}
                      hasOtherEmbodimentSelected={
                        activeTab === 'embodiment' &&
                        summary.activeEmbodiment !== null &&
                        summary.activeEmbodiment.id !== itemState.component.id
                      }
                    />
                  ))}
                </div>

                {/* Step Navigation Bar */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  {currentTabIndex > 0 ? (
                    <button
                      type="button"
                      onClick={handlePrevTab}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold uppercase tracking-wide text-slate-700 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={handleNextTab}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-bold uppercase tracking-wide text-white transition-all shadow-xs cursor-pointer"
                  >
                    <span>{currentTabIndex === tabsList.length - 2 ? 'Review Configuration' : 'Next Step'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* High Density Footer */}
      <footer className="h-11 sm:h-12 bg-slate-100 border-t border-slate-200 flex items-center px-4 sm:px-8 justify-between text-[10px] text-slate-500 print:hidden shrink-0">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <span className="font-bold text-slate-400 uppercase tracking-widest">Simulation Params:</span>
          <span className="text-slate-700 uppercase font-semibold">Scenario: {currentScenario.title.split(':')[0]}</span>
          <span className="text-slate-600 uppercase hidden md:inline">Env: {currentScenario.environment}</span>
        </div>
        {ENABLE_DATA_GUIDE && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenOrganizerGuide}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium cursor-pointer transition-colors px-2 py-1 rounded hover:bg-slate-200/60"
              title="Protected Organizer Guide"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Organizer Data Guide</span>
            </button>
            {isOrganizerAuthenticated && (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase font-bold">
                Unlocked
              </span>
            )}
          </div>
        )}
      </footer>

      {/* Organizer Password & Guide Modals */}
      {ENABLE_DATA_GUIDE && (
        <>
          <OrganizerPasswordModal
            isOpen={isOrganizerPasswordOpen}
            onClose={() => setIsOrganizerPasswordOpen(false)}
            onSuccess={handlePasswordSuccess}
            correctPassword={ORGANIZER_PASSWORD}
          />

          <OrganizerGuideModal
            isOpen={isOrganizerGuideOpen}
            onClose={() => setIsOrganizerGuideOpen(false)}
            currentBudget={budget}
            onBudgetOverride={(newB) => {
              setBudget(newB);
              setIsOrganizerGuideOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}

