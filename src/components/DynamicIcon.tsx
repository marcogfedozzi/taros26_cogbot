import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle, Bot } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

// Helper to convert kebab-case or snake_case or lowercase into PascalCase (e.g., 'radio-tower' -> 'RadioTower')
function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

const iconAliases: Record<string, string> = {
  SportShoe: 'Footprints',
  RobotArm: 'Bot',
  LineSquiggle: 'Spline',
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "w-5 h-5" }) => {
  if (!name) return <Bot className={className} />;

  const iconsRecord = LucideIcons as unknown as Record<string, React.ElementType>;

  // Check alias first, then direct name, then PascalCase, then default
  const resolvedName = iconAliases[name] || name;
  const pascalName = toPascalCase(resolvedName);
  const IconComponent = iconsRecord[resolvedName] || iconsRecord[pascalName] || iconsRecord[name] || HelpCircle;

  return <IconComponent className={className} />;
};

