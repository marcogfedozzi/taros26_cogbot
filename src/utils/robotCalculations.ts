import {
  ComponentCategory,
  EffectiveComponentState,
  RobotComponent,
  RobotConfigurationState
} from '../types/robot';

/**
 * Calculates the dynamic state of a component based on all currently selected items.
 */
export function calculateComponentState(
  component: RobotComponent,
  selectedItemIds: string[],
  allComponents: RobotComponent[]
): EffectiveComponentState {
  const isSelected = selectedItemIds.includes(component.id);
  const componentMap = new Map<string, RobotComponent>(
    allComponents.map(c => [c.id, c])
  );

  // 1. Calculate applied modifiers for this component from currently selected items
  const appliedModifiers: EffectiveComponentState['appliedModifiers'] = [];
  let modifierSum = 0;

  if (component.costModifiers) {
    for (const mod of component.costModifiers) {
      if (selectedItemIds.includes(mod.withItemId) && mod.withItemId !== component.id) {
        const partner = componentMap.get(mod.withItemId);
        appliedModifiers.push({
          partnerName: partner ? partner.name : mod.withItemId,
          costChange: mod.costChange,
          reason: mod.reason
        });
        modifierSum += mod.costChange;
      }
    }
  }

  // Also check if any other SELECTED component has a cost modifier targeting this component
  // (to support bidirectional or partner-defined modifiers)
  for (const otherId of selectedItemIds) {
    if (otherId === component.id) continue;
    const other = componentMap.get(otherId);
    if (other && other.costModifiers) {
      for (const mod of other.costModifiers) {
        if (mod.withItemId === component.id) {
          // Check if we didn't already record this pair
          const alreadyRecorded = appliedModifiers.some(
            m => m.partnerName === other.name
          );
          if (!alreadyRecorded) {
            appliedModifiers.push({
              partnerName: other.name,
              costChange: mod.costChange,
              reason: mod.reason
            });
            modifierSum += mod.costChange;
          }
        }
      }
    }
  }

  // Individual component maintains its baseCost; synergy discount is applied to total budget
  const effectiveCost = component.baseCost;
  const costDiscount = modifierSum < 0 ? Math.abs(modifierSum) : 0; // points saved on total budget

  // 2. Calculate potential synergies (if this component were selected right now)
  const potentialSynergies: EffectiveComponentState['potentialSynergies'] = [];
  const potentialDeduplication = new Set<string>();
  if (!isSelected) {
    if (component.costModifiers) {
      for (const mod of component.costModifiers) {
        if (selectedItemIds.includes(mod.withItemId)) {
          const partner = componentMap.get(mod.withItemId);
          const pName = partner ? partner.name : mod.withItemId;
          if (!potentialDeduplication.has(pName)) {
            potentialDeduplication.add(pName);
            potentialSynergies.push({
              partnerName: pName,
              potentialDiscount: Math.abs(mod.costChange),
              reason: mod.reason
            });
          }
        }
      }
    }
    // Also check if any currently selected item has a modifier that would activate with this component
    for (const selectedId of selectedItemIds) {
      const selectedComp = componentMap.get(selectedId);
      if (selectedComp && selectedComp.costModifiers) {
        for (const mod of selectedComp.costModifiers) {
          if (mod.withItemId === component.id) {
            const pName = selectedComp.name;
            if (!potentialDeduplication.has(pName)) {
              potentialDeduplication.add(pName);
              potentialSynergies.push({
                partnerName: pName,
                potentialDiscount: Math.abs(mod.costChange),
                reason: mod.reason
              });
            }
          }
        }
      }
    }
  }

  // 3. Incompatibility checking
  const incompatibleBecause: string[] = [];
  // A) This component forbids any currently selected item
  if (component.incompatibleWith) {
    for (const forbiddenId of component.incompatibleWith) {
      if (selectedItemIds.includes(forbiddenId) && forbiddenId !== component.id) {
        const partner = componentMap.get(forbiddenId);
        const reason = component.incompatibilityReasons?.[forbiddenId] 
          || `Incompatible with ${partner?.name || forbiddenId}`;
        incompatibleBecause.push(reason);
      }
    }
  }
  // B) Any currently selected item forbids THIS component
  for (const selectedId of selectedItemIds) {
    if (selectedId === component.id) continue;
    const selectedComp = componentMap.get(selectedId);
    if (selectedComp && selectedComp.incompatibleWith?.includes(component.id)) {
      const reason = selectedComp.incompatibilityReasons?.[component.id]
        || `Incompatible with ${selectedComp.name}`;
      if (!incompatibleBecause.includes(reason)) {
        incompatibleBecause.push(reason);
      }
    }
  }
  const isIncompatible = incompatibleBecause.length > 0;

  // 4. Requirements checking
  const missingRequirements: string[] = [];
  // All required
  if (component.requires && component.requires.length > 0) {
    for (const reqId of component.requires) {
      if (!selectedItemIds.includes(reqId)) {
        const reqComp = componentMap.get(reqId);
        const reqName = reqComp ? reqComp.name : reqId;
        missingRequirements.push(reqName);
      }
    }
  }
  // Any required (at least one)
  if (component.requiresAny && component.requiresAny.length > 0) {
    const hasAtLeastOne = component.requiresAny.some(reqId => selectedItemIds.includes(reqId));
    if (!hasAtLeastOne) {
      const anyNames = component.requiresAny
        .map(id => componentMap.get(id)?.name || id)
        .join(' or ');
      missingRequirements.push(`At least one of: ${anyNames}`);
    }
  }

  const isRequirementMissing = missingRequirements.length > 0;
  const canBeSelected = !isIncompatible && !isRequirementMissing;

  // 5. Warnings checking
  const activeWarnings: string[] = [];
  if (component.conditionalWarnings) {
    for (const cw of component.conditionalWarnings) {
      let triggered = false;
      // Triggers if ANY of whenSelectedWith are selected
      if (cw.whenSelectedWith && cw.whenSelectedWith.length > 0) {
        const hasTrigger = cw.whenSelectedWith.some(
          id => selectedItemIds.includes(id) && id !== component.id
        );
        if (hasTrigger) {
          triggered = true;
        }
      }
      // Triggers if this item is selected AND any of the safety items are missing
      if (cw.whenMissing && cw.whenMissing.length > 0) {
        if (isSelected && cw.whenMissing.some(id => !selectedItemIds.includes(id))) {
          triggered = true;
        }
      }
      if (triggered && !activeWarnings.includes(cw.message)) {
        activeWarnings.push(cw.message);
      }
    }
  }

  // Also check if any other SELECTED component has conditional warnings triggered by this component
  for (const selectedId of selectedItemIds) {
    if (selectedId === component.id) continue;
    const selectedComp = componentMap.get(selectedId);
    if (selectedComp && selectedComp.conditionalWarnings) {
      for (const cw of selectedComp.conditionalWarnings) {
        if (cw.whenSelectedWith && cw.whenSelectedWith.includes(component.id)) {
          if (!activeWarnings.includes(cw.message)) {
            activeWarnings.push(cw.message);
          }
        }
      }
    }
  }

  return {
    component,
    isSelected,
    baseCost: component.baseCost,
    effectiveCost,
    costDiscount,
    appliedModifiers,
    potentialSynergies,
    isIncompatible,
    incompatibleBecause,
    isRequirementMissing,
    missingRequirements,
    canBeSelected,
    activeWarnings,
    staticWarning: component.warning
  };
}

export interface ConfigurationSummary {
  selectedComponents: RobotComponent[];
  totalBaseCost: number;
  totalEffectiveCost: number;
  totalSavings: number;
  remainingPoints: number;
  isOverBudget: boolean;
  selectedByCategory: Record<ComponentCategory, RobotComponent[]>;
  categoryCosts: Record<ComponentCategory, number>;
  activeSynergies: {
    itemA: string;
    itemB: string;
    costChange: number;
    reason: string;
  }[];
  activeEmbodiment: RobotComponent | null;
  warnings: string[];
}

export function calculateConfigurationSummary(
  selectedItemIds: string[],
  allComponents: RobotComponent[],
  budget: number
): ConfigurationSummary {
  const componentMap = new Map<string, RobotComponent>(
    allComponents.map(c => [c.id, c])
  );

  const selectedComponents = selectedItemIds
    .map(id => componentMap.get(id))
    .filter((c): c is RobotComponent => c !== undefined);

  const selectedByCategory: Record<ComponentCategory, RobotComponent[]> = {
    embodiment: [],
    sensor: [],
    cognitive: [],
    motor: []
  };

  const categoryCosts: Record<ComponentCategory, number> = {
    embodiment: 0,
    sensor: 0,
    cognitive: 0,
    motor: 0
  };

  let totalBaseCost = 0;
  const activeSynergies: ConfigurationSummary['activeSynergies'] = [];
  const synergyDeduplication = new Set<string>();
  const warnings: string[] = [];

  for (const item of selectedComponents) {
    selectedByCategory[item.category].push(item);
    totalBaseCost += item.baseCost;
    categoryCosts[item.category] += item.baseCost;

    const state = calculateComponentState(item, selectedItemIds, allComponents);

    // Collect active dynamic warnings from selected items
    for (const w of state.activeWarnings) {
      if (!warnings.includes(w)) {
        warnings.push(w);
      }
    }
  }

  // Calculate unique synergistic pairs across selected components (points detracted once per pair)
  for (const item of selectedComponents) {
    if (item.costModifiers) {
      for (const mod of item.costModifiers) {
        if (selectedItemIds.includes(mod.withItemId) && mod.withItemId !== item.id) {
          const partner = componentMap.get(mod.withItemId);
          const pairKey = [item.id, mod.withItemId].sort().join(':::');
          if (!synergyDeduplication.has(pairKey)) {
            synergyDeduplication.add(pairKey);
            activeSynergies.push({
              itemA: item.name,
              itemB: partner ? partner.name : mod.withItemId,
              costChange: mod.costChange,
              reason: mod.reason
            });
          }
        }
      }
    }
  }

  // Calculate net synergy discount applied to the total budget
  const totalSavings = activeSynergies.reduce((sum, syn) => {
    return syn.costChange < 0 ? sum + Math.abs(syn.costChange) : sum;
  }, 0);

  const totalPenalties = activeSynergies.reduce((sum, syn) => {
    return syn.costChange > 0 ? sum + syn.costChange : sum;
  }, 0);

  const totalEffectiveCost = Math.max(0, totalBaseCost - totalSavings + totalPenalties);
  const remainingPoints = budget - totalEffectiveCost;
  const isOverBudget = remainingPoints < 0;

  const activeEmbodiment = selectedByCategory.embodiment[0] || null;

  if (!activeEmbodiment) {
    warnings.push("No Embodiment selected. Choose a physical chassis first.");
  }
  if (selectedByCategory.sensor.length === 0) {
    warnings.push("No Sensors equipped. The robot has no perceptual input.");
  }
  if (selectedByCategory.cognitive.length === 0) {
    warnings.push("No Cognitive Architecture skills selected.");
  }
  if (selectedByCategory.motor.length === 0) {
    warnings.push("No Motor Skills equipped. The robot cannot act upon its environment.");
  }
  if (isOverBudget) {
    warnings.push(`Point budget exceeded by ${Math.abs(remainingPoints)} points.`);
  }

  return {
    selectedComponents,
    totalBaseCost,
    totalEffectiveCost,
    totalSavings,
    remainingPoints,
    isOverBudget,
    selectedByCategory,
    categoryCosts,
    activeSynergies,
    activeEmbodiment,
    warnings
  };
}

/**
 * URL Hash Serialization so participants can bookmark, reload, or share exact setup.
 */
export function encodeConfigToHash(state: RobotConfigurationState): string {
  try {
    const payload = {
      t: state.teamName || 'RescueUnit',
      s: state.selectedScenarioId,
      i: state.selectedItemIds
    };
    return encodeURIComponent(JSON.stringify(payload));
  } catch {
    return '';
  }
}

export function decodeConfigFromHash(hash: string): Partial<RobotConfigurationState> | null {
  try {
    if (!hash || hash.length < 2) return null;
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    const decoded = decodeURIComponent(cleanHash);
    const parsed = JSON.parse(decoded);
    return {
      teamName: parsed.t || '',
      selectedScenarioId: parsed.s || '',
      selectedItemIds: Array.isArray(parsed.i) ? parsed.i : []
    };
  } catch {
    return null;
  }
}

/**
 * Generates clean formatted plain text suitable for copying into workshop documents/Discord/Miro.
 */
export function generateTextSummary(
  state: RobotConfigurationState,
  summary: ConfigurationSummary,
  scenarioTitle: string,
  totalBudget: number
): string {
  const lines: string[] = [];
  lines.push("==================================================");
  lines.push(`RESCUE ROBOT CONFIGURATION: ${state.teamName || 'Unnamed Unit'}`);
  lines.push(`Scenario: ${scenarioTitle}`);
  lines.push(`Budget: ${summary.totalEffectiveCost} / ${totalBudget} points (${summary.remainingPoints} pts remaining)`);
  if (summary.totalSavings > 0) {
    lines.push(`Active Synergies Discount (on total): -${summary.totalSavings} points`);
  }
  lines.push("==================================================");
  lines.push("");

  lines.push("1. EMBODIMENT:");
  if (summary.activeEmbodiment) {
    lines.push(`   * ${summary.activeEmbodiment.name} (${summary.activeEmbodiment.baseCost} pts)`);
    lines.push(`     ${summary.activeEmbodiment.shortDescription}`);
  } else {
    lines.push("   * None selected");
  }
  lines.push("");

  lines.push(`2. SENSORS (${summary.selectedByCategory.sensor.length} selected):`);
  if (summary.selectedByCategory.sensor.length > 0) {
    summary.selectedByCategory.sensor.forEach(s => {
      lines.push(`   * ${s.name} (${s.baseCost} pts) - ${s.shortDescription}`);
    });
  } else {
    lines.push("   * None selected");
  }
  lines.push("");

  lines.push(`3. COGNITIVE ARCHITECTURE (${summary.selectedByCategory.cognitive.length} selected):`);
  if (summary.selectedByCategory.cognitive.length > 0) {
    summary.selectedByCategory.cognitive.forEach(c => {
      lines.push(`   * ${c.name} (${c.baseCost} pts) - ${c.shortDescription}`);
    });
  } else {
    lines.push("   * None selected");
  }
  lines.push("");

  lines.push(`4. MOTOR SKILLS (${summary.selectedByCategory.motor.length} selected):`);
  if (summary.selectedByCategory.motor.length > 0) {
    summary.selectedByCategory.motor.forEach(m => {
      lines.push(`   * ${m.name} (${m.baseCost} pts) - ${m.shortDescription}`);
    });
  } else {
    lines.push("   * None selected");
  }
  lines.push("");

  if (summary.activeSynergies.length > 0) {
    lines.push("ACTIVE SYNERGIES & VARIABLE DISCOUNTS:");
    summary.activeSynergies.forEach(syn => {
      lines.push(`   + [${syn.costChange > 0 ? `+${syn.costChange}` : syn.costChange} pts] ${syn.itemA} <-> ${syn.itemB}: ${syn.reason}`);
    });
    lines.push("");
  }

  lines.push("Discussion Notes:");
  lines.push("- Ready for in-person evaluation & cross-team debate during the workshop session.");

  return lines.join("\n");
}
