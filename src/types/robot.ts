export type ComponentCategory = 'embodiment' | 'sensor' | 'cognitive' | 'motor';

export interface CostModifier {
  /** The other component ID that triggers this cost adjustment */
  withItemId: string;
  /** Positive adds cost (penalty), negative reduces cost (discount/synergy) */
  costChange: number;
  /** Human-readable explanation of why this synergy/penalty happens */
  reason: string;
}

export interface RobotComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  baseCost: number;
  /** Icon name from lucide-react */
  icon: string;
  shortDescription: string;
  detailedDescription: string;
  tags: string[];
  /** IDs of components that cannot be chosen together with this one */
  incompatibleWith?: string[];
  /** Optional custom explanation for why it's incompatible */
  incompatibilityReasons?: Record<string, string>;
  /** IDs of components that must ALL be selected for this item to be enabled */
  requires?: string[];
  /** IDs of components where AT LEAST ONE must be selected */
  requiresAny?: string[];
  /** Optional explanation of why requirement exists */
  requirementReason?: string;
  /** Synergies or variable costs based on other selected items */
  costModifiers?: CostModifier[];
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  environment: string;
  keyChallenges: string[];
  recommendedBudget: number;
  description: string;
}

export interface WorkshopConfig {
  workshopTitle: string;
  workshopSubtitle: string;
  defaultBudget: number;
  allowOverBudget: boolean;
  scenarios: Scenario[];
  components: RobotComponent[];
}

export interface EffectiveComponentState {
  component: RobotComponent;
  isSelected: boolean;
  baseCost: number;
  effectiveCost: number;
  costDiscount: number; // positive number if cost was reduced
  appliedModifiers: {
    partnerName: string;
    costChange: number;
    reason: string;
  }[];
  potentialSynergies: {
    partnerName: string;
    potentialDiscount: number;
    reason: string;
  }[];
  isIncompatible: boolean;
  incompatibleBecause: string[];
  isRequirementMissing: boolean;
  missingRequirements: string[];
  canBeSelected: boolean;
}

export interface RobotConfigurationState {
  teamName: string;
  selectedScenarioId: string;
  selectedItemIds: string[];
}
