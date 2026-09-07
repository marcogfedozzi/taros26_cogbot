import React from 'react';
import {
  Dog,
  Boxes,
  Spline,
  User,
  Plane,
  Disc3,
  Camera,
  Flame,
  Radar,
  Volume2,
  Biohazard,
  Fingerprint,
  Layers,
  Compass,
  Cpu,
  Map,
  Sparkles,
  GitFork,
  Brain,
  MessageSquare,
  FastForward,
  History,
  Footprints,
  Crosshair,
  ShieldAlert,
  Activity,
  PackagePlus,
  Maximize2,
  Anchor,
  HelpCircle,
  Bot
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Dog,
  Boxes,
  Spline,
  User,
  Plane,
  Disc3,
  Camera,
  Flame,
  Radar,
  Volume2,
  Biohazard,
  Fingerprint,
  Layers,
  Compass,
  Cpu,
  Map,
  Sparkles,
  GitFork,
  Brain,
  MessageSquare,
  FastForward,
  History,
  Footprints,
  Crosshair,
  ShieldAlert,
  Activity,
  PackagePlus,
  Maximize2,
  Anchor,
  Bot
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "w-5 h-5" }) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} />;
};
