import React, { useState, useRef } from 'react';
import { 
  Eye, 
  Brain, 
  Wrench, 
  Sparkles, 
  Download, 
  Maximize2, 
  Info,
  CheckCircle2,
  Boxes
} from 'lucide-react';
import { ComponentCategory, RobotComponent } from '../types/robot';
import { ConfigurationSummary } from '../utils/robotCalculations';
import { DynamicIcon } from './DynamicIcon';

interface RobotVisualizerProps {
  summary: ConfigurationSummary;
  teamName?: string;
  scenarioTitle?: string;
  onEditCategory?: (category: ComponentCategory) => void;
}

export const RobotVisualizer: React.FC<RobotVisualizerProps> = ({
  summary,
  teamName,
  scenarioTitle,
  onEditCategory
}) => {
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeEmbodiment = summary.activeEmbodiment;
  const sensors = summary.selectedByCategory.sensor;
  const cognitive = summary.selectedByCategory.cognitive;
  const motor = summary.selectedByCategory.motor;

  // Active highlighted component
  const activeComponentId = hoveredComponentId || selectedNodeId;
  const allComponents = [
    ...(activeEmbodiment ? [activeEmbodiment] : []),
    ...sensors,
    ...cognitive,
    ...motor
  ];
  const activeComponent = allComponents.find(c => c.id === activeComponentId);

  // SVG Canvas dimensions
  const viewBoxWidth = 860;
  const viewBoxHeight = 560;
  const centerX = 430;
  const centerY = 270;

  // Embodiment Anchor Ports in SVG space
  const getAnchorPort = (category: ComponentCategory, embodimentId?: string) => {
    switch (embodimentId) {
      case 'biped_humanoid':
        if (category === 'sensor') return { x: 430, y: 155 }; // Head visor
        if (category === 'cognitive') return { x: 430, y: 225 }; // Torso core
        return { x: 380, y: 285 }; // Limbs / arms

      case 'tracked_rover':
        if (category === 'sensor') return { x: 430, y: 180 }; // Sensor mast
        if (category === 'cognitive') return { x: 430, y: 235 }; // Avionics box
        return { x: 490, y: 290 }; // Heavy chassis / tracks

      case 'snake_robot':
        if (category === 'sensor') return { x: 505, y: 220 }; // Nose cone
        if (category === 'cognitive') return { x: 420, y: 245 }; // Central segment
        return { x: 350, y: 290 }; // Articulated body

      case 'micro_aerial_drone':
        if (category === 'sensor') return { x: 430, y: 230 }; // Gimbal dome
        if (category === 'cognitive') return { x: 430, y: 260 }; // Flight computer
        return { x: 490, y: 300 }; // Rotor arm mounts

      case 'wheeled_all_terrain':
        if (category === 'sensor') return { x: 450, y: 200 }; // Mast head
        if (category === 'cognitive') return { x: 430, y: 245 }; // Avionics bay
        return { x: 370, y: 315 }; // Rocker-bogie bogies

      case 'quadruped_robot':
      default:
        if (category === 'sensor') return { x: 485, y: 215 }; // Head turret
        if (category === 'cognitive') return { x: 410, y: 245 }; // Thorax processor
        return { x: 360, y: 295 }; // Hip actuators / legs
    }
  };

  // Helper to export SVG as high-resolution PNG image
  const handleExportPNG = () => {
    if (!svgRef.current) return;
    setIsExporting(true);

    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = viewBoxWidth * 2; // 2x for sharp retina export
        canvas.height = viewBoxHeight * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(2, 2);
          ctx.fillStyle = '#0F172A'; // Slate-900 technical blueprint background
          ctx.fillRect(0, 0, viewBoxWidth, viewBoxHeight);
          ctx.drawImage(image, 0, 0, viewBoxWidth, viewBoxHeight);

          const pngDataUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          const cleanName = (teamName || 'rescue-robot').toLowerCase().replace(/\s+/g, '-');
          downloadLink.download = `${cleanName}-schematic.png`;
          downloadLink.href = pngDataUrl;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobURL);
        setIsExporting(false);
      };
      image.src = blobURL;
    } catch (e) {
      console.error('Failed to export PNG:', e);
      setIsExporting(false);
    }
  };

  // Render geometric embodiment chassis
  const renderEmbodimentChassis = (embodimentId?: string) => {
    switch (embodimentId) {
      case 'quadruped_robot':
        return (
          <g id="embodiment-quadruped" className="transition-all duration-300">
            {/* Rear Legs (Background layer) */}
            <g stroke="#64748B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 370 265 L 350 320 L 360 370" />
              <line x1="350" y1="370" x2="370" y2="370" stroke="#475569" strokeWidth="5" />
              <path d="M 440 265 L 455 320 L 445 370" />
              <line x1="435" y1="370" x2="455" y2="370" stroke="#475569" strokeWidth="5" />
            </g>

            {/* Rear Tail / Antenna */}
            <path d="M 340 230 L 315 205" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="315" cy="205" r="4" fill="#38BDF8" className="animate-pulse" />

            {/* Main Torso Chassis (Rounded Box) */}
            <rect
              x="340"
              y="215"
              width="135"
              height="65"
              rx="14"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Inner mechanical panel lines */}
            <rect x="355" y="228" width="55" height="38" rx="6" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
            {/* Battery / Compute status LEDs */}
            <circle cx="370" cy="242" r="3" fill="#10B981" />
            <circle cx="382" cy="242" r="3" fill="#38BDF8" />
            <circle cx="394" cy="242" r="3" fill="#6366F1" />
            <line x1="365" y1="254" x2="398" y2="254" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />

            {/* Neck link */}
            <path d="M 470 235 L 485 225" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

            {/* Head Turret (Rounded Box + Visor) */}
            <rect
              x="485"
              y="200"
              width="45"
              height="38"
              rx="8"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            {/* Optical Sensor Visor */}
            <rect x="505" y="210" width="18" height="8" rx="3" fill="#38BDF8" />
            <circle cx="514" cy="214" r="2" fill="#FFFFFF" />

            {/* Fore Legs (Foreground layer) */}
            <g stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Back Foreleg */}
              <path d="M 355 265 L 335 320 L 345 370" />
              <line x1="335" y1="370" x2="355" y2="370" stroke="#CBD5E1" strokeWidth="5.5" />
              {/* Front Foreleg */}
              <path d="M 455 265 L 475 320 L 465 370" />
              <line x1="455" y1="370" x2="475" y2="370" stroke="#CBD5E1" strokeWidth="5.5" />
            </g>

            {/* Leg Joint Pivot Rings */}
            <circle cx="355" cy="265" r="4.5" fill="#38BDF8" />
            <circle cx="335" cy="320" r="4" fill="#64748B" />
            <circle cx="455" cy="265" r="4.5" fill="#38BDF8" />
            <circle cx="475" cy="320" r="4" fill="#64748B" />
          </g>
        );

      case 'biped_humanoid':
        return (
          <g id="embodiment-humanoid" className="transition-all duration-300">
            {/* Head (Rounded Box) */}
            <rect
              x="405"
              y="130"
              width="50"
              height="45"
              rx="10"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Visor */}
            <rect x="415" y="145" width="30" height="9" rx="3" fill="#38BDF8" />
            <circle cx="430" cy="149.5" r="2.5" fill="#FFFFFF" />

            {/* Neck */}
            <line x1="430" y1="175" x2="430" y2="190" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />

            {/* Torso / Chest (Rounded Box) */}
            <rect
              x="390"
              y="190"
              width="80"
              height="95"
              rx="14"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Core Reactor / Sensor Deck */}
            <circle cx="430" cy="230" r="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="430" cy="230" r="6" fill="#38BDF8" className="animate-pulse" />

            {/* Left Arm (Lines & Joints) */}
            <g stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 390 205 L 350 245 L 350 295" />
              {/* Hand Gripper */}
              <path d="M 342 295 L 350 306 L 358 295" strokeWidth="3" />
            </g>
            <circle cx="390" cy="205" r="4.5" fill="#38BDF8" />
            <circle cx="350" cy="245" r="4" fill="#64748B" />

            {/* Right Arm (Lines & Joints) */}
            <g stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 470 205 L 510 245 L 510 295" />
              {/* Hand Gripper */}
              <path d="M 502 295 L 510 306 L 518 295" strokeWidth="3" />
            </g>
            <circle cx="470" cy="205" r="4.5" fill="#38BDF8" />
            <circle cx="510" cy="245" r="4" fill="#64748B" />

            {/* Pelvis Waist */}
            <line x1="410" y1="285" x2="450" y2="285" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />

            {/* Legs */}
            <g stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Left Leg */}
              <path d="M 412 285 L 405 345 L 405 400" />
              <line x1="390" y1="400" x2="415" y2="400" stroke="#CBD5E1" strokeWidth="6" />
              {/* Right Leg */}
              <path d="M 448 285 L 455 345 L 455 400" />
              <line x1="445" y1="400" x2="470" y2="400" stroke="#CBD5E1" strokeWidth="6" />
            </g>
            <circle cx="412" cy="285" r="4" fill="#38BDF8" />
            <circle cx="405" cy="345" r="4" fill="#64748B" />
            <circle cx="448" cy="285" r="4" fill="#38BDF8" />
            <circle cx="455" cy="345" r="4" fill="#64748B" />
          </g>
        );

      case 'tracked_rover':
        return (
          <g id="embodiment-tracked" className="transition-all duration-300">
            {/* Top Roll Cage & Sensor Mast */}
            <path
              d="M 370 210 L 390 170 L 470 170 L 490 210"
              stroke="#64748B"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <line x1="430" y1="170" x2="430" y2="145" stroke="#94A3B8" strokeWidth="3" />
            <circle cx="430" cy="140" r="7" fill="#38BDF8" />
            <line x1="418" y1="140" x2="442" y2="140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

            {/* Central Armored Chassis */}
            <rect
              x="360"
              y="205"
              width="140"
              height="65"
              rx="10"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Hazard Stripe Details */}
            <line x1="380" y1="218" x2="400" y2="218" stroke="#F59E0B" strokeWidth="3" />
            <line x1="405" y1="218" x2="425" y2="218" stroke="#F59E0B" strokeWidth="3" />
            <line x1="430" y1="218" x2="450" y2="218" stroke="#F59E0B" strokeWidth="3" />
            <line x1="455" y1="218" x2="475" y2="218" stroke="#F59E0B" strokeWidth="3" />

            {/* Heavy Caterpillar Track Base */}
            <rect
              x="330"
              y="270"
              width="200"
              height="50"
              rx="25"
              fill="#0F172A"
              stroke="#475569"
              strokeWidth="3"
            />
            {/* Sprocket Wheels */}
            <circle cx="360" cy="295" r="16" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="360" cy="295" r="6" fill="#38BDF8" />
            <circle cx="400" cy="295" r="15" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="430" cy="295" r="15" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="460" cy="295" r="15" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="500" cy="295" r="16" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="500" cy="295" r="6" fill="#38BDF8" />

            {/* Tread Ridges */}
            <line x1="355" y1="270" x2="355" y2="274" stroke="#94A3B8" strokeWidth="3" />
            <line x1="390" y1="270" x2="390" y2="274" stroke="#94A3B8" strokeWidth="3" />
            <line x1="430" y1="270" x2="430" y2="274" stroke="#94A3B8" strokeWidth="3" />
            <line x1="470" y1="270" x2="470" y2="274" stroke="#94A3B8" strokeWidth="3" />
            <line x1="505" y1="270" x2="505" y2="274" stroke="#94A3B8" strokeWidth="3" />
            <line x1="355" y1="316" x2="355" y2="320" stroke="#94A3B8" strokeWidth="3" />
            <line x1="390" y1="316" x2="390" y2="320" stroke="#94A3B8" strokeWidth="3" />
            <line x1="430" y1="316" x2="430" y2="320" stroke="#94A3B8" strokeWidth="3" />
            <line x1="470" y1="316" x2="470" y2="320" stroke="#94A3B8" strokeWidth="3" />
            <line x1="505" y1="316" x2="505" y2="320" stroke="#94A3B8" strokeWidth="3" />
          </g>
        );

      case 'snake_robot':
        return (
          <g id="embodiment-snake" className="transition-all duration-300">
            {/* Serpentine undulating chain of 7 linked rounded capsules */}
            {/* Connecting Flexible Conduit */}
            <path
              d="M 285 300 Q 320 320 360 290 T 435 255 T 510 220"
              stroke="#0284C7"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />

            {/* Segment 1: Tail */}
            <rect x="270" y="285" width="30" height="30" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="285" cy="300" r="3" fill="#94A3B8" />

            {/* Segment 2 */}
            <rect x="315" y="295" width="34" height="32" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="332" cy="311" r="3" fill="#94A3B8" />

            {/* Segment 3 */}
            <rect x="360" y="280" width="36" height="34" rx="10" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <circle cx="378" cy="297" r="4" fill="#38BDF8" />

            {/* Segment 4: Central Processing */}
            <rect x="405" y="255" width="40" height="36" rx="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
            <rect x="415" y="265" width="20" height="16" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="425" cy="273" r="3" fill="#10B981" />

            {/* Segment 5 */}
            <rect x="455" y="235" width="36" height="34" rx="10" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <circle cx="473" cy="252" r="4" fill="#38BDF8" />

            {/* Segment 6: Head Capsule */}
            <rect x="500" y="205" width="48" height="38" rx="12" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
            {/* Head Sensory Slit */}
            <rect x="532" y="217" width="12" height="14" rx="3" fill="#38BDF8" />
            <circle cx="538" cy="224" r="2" fill="#FFFFFF" />
          </g>
        );

      case 'micro_aerial_drone':
        return (
          <g id="embodiment-drone" className="transition-all duration-300">
            {/* 6 Radiating Struts */}
            <g stroke="#64748B" strokeWidth="3.5" strokeLinecap="round">
              <line x1="430" y1="260" x2="340" y2="200" />
              <line x1="430" y1="260" x2="430" y2="160" />
              <line x1="430" y1="260" x2="520" y2="200" />
              <line x1="430" y1="260" x2="520" y2="320" />
              <line x1="430" y1="260" x2="430" y2="350" />
              <line x1="430" y1="260" x2="340" y2="320" />
            </g>

            {/* 6 Propeller Rotors */}
            {[
              { x: 340, y: 200 },
              { x: 430, y: 160 },
              { x: 520, y: 200 },
              { x: 520, y: 320 },
              { x: 430, y: 350 },
              { x: 340, y: 320 }
            ].map((pos, idx) => (
              <g key={idx}>
                {/* Rotor Ring */}
                <circle cx={pos.x} cy={pos.y} r="24" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3,3" />
                {/* Spinning Blade Line */}
                <line x1={pos.x - 20} y1={pos.y} x2={pos.x + 20} y2={pos.y} stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                {/* Hub Motor */}
                <circle cx={pos.x} cy={pos.y} r="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              </g>
            ))}

            {/* Central Drone Core Pod */}
            <rect
              x="400"
              y="235"
              width="60"
              height="50"
              rx="14"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Gimbal Sensor Dome */}
            <circle cx="430" cy="260" r="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="430" cy="260" r="6" fill="#38BDF8" className="animate-pulse" />

            {/* Landing Skids */}
            <path d="M 395 285 L 380 325 L 415 325" stroke="#94A3B8" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 465 285 L 480 325 L 445 325" stroke="#94A3B8" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case 'wheeled_all_terrain':
        return (
          <g id="embodiment-wheeled" className="transition-all duration-300">
            {/* Sensor Mast */}
            <line x1="455" y1="210" x2="455" y2="160" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <rect x="442" y="150" width="26" height="18" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="455" cy="159" r="4" fill="#38BDF8" />

            {/* Rocker-Bogie Suspension Linkages */}
            <g stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 430 255 L 375 295 L 335 345" />
              <path d="M 375 295 L 420 345" />
              <path d="M 430 255 L 485 295 L 525 345" />
            </g>

            {/* Main Rover Body Box */}
            <rect
              x="365"
              y="210"
              width="130"
              height="60"
              rx="12"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            {/* Interior Electronics Bay */}
            <rect x="380" y="222" width="50" height="34" rx="6" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
            <circle cx="395" cy="235" r="3" fill="#10B981" />
            <circle cx="407" cy="235" r="3" fill="#38BDF8" />

            {/* 6 Heavy All-Terrain Wheels */}
            {[
              { x: 335, y: 345 },
              { x: 420, y: 345 },
              { x: 525, y: 345 }
            ].map((wheel, idx) => (
              <g key={idx}>
                {/* Back Wheel Shadow */}
                <circle cx={wheel.x + 10} cy={wheel.y - 10} r="18" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                {/* Front Wheel */}
                <circle cx={wheel.x} cy={wheel.y} r="19" fill="#1E293B" stroke="#94A3B8" strokeWidth="2.5" />
                <circle cx={wheel.x} cy={wheel.y} r="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                {/* Lug Nuts */}
                <circle cx={wheel.x} cy={wheel.y} r="3" fill="#FFFFFF" />
              </g>
            ))}
          </g>
        );

      default:
        return (
          <g id="embodiment-none" className="transition-all duration-300">
            {/* Wireframe box placeholder */}
            <rect
              x="360"
              y="210"
              width="140"
              height="80"
              rx="12"
              fill="#0F172A"
              stroke="#475569"
              strokeWidth="2"
              strokeDasharray="6,6"
            />
            <text x="430" y="255" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="600">
              No Embodiment
            </text>
            <text x="430" y="275" textAnchor="middle" fill="#64748B" fontSize="11">
              Select in Step 1
            </text>
          </g>
        );
    }
  };

  // Compute node positions for surrounding components around the robot
  // 1. SENSORS: Top arc / row
  // 2. COGNITIVE: Left column / cluster
  // 3. MOTOR: Right column / Bottom cluster
  const getComponentNodeLayout = () => {
    const layoutItems: Array<{
      component: RobotComponent;
      x: number;
      y: number;
      category: ComponentCategory;
      anchorPort: { x: number; y: number };
    }> = [];

    const embodimentId = activeEmbodiment?.id;

    // Place Sensors along the top arc (Y ~ 45 to 110)
    const sensorCount = sensors.length;
    sensors.forEach((s, idx) => {
      const port = getAnchorPort('sensor', embodimentId);
      // distribute across X: 140 to 720
      let x = centerX;
      if (sensorCount === 1) {
        x = centerX;
      } else {
        const step = Math.min(160, 580 / (sensorCount - 1));
        const startX = centerX - ((sensorCount - 1) * step) / 2;
        x = startX + idx * step;
      }
      // slight curve for aesthetics
      const curveOffset = Math.abs(x - centerX) * 0.08;
      const y = 60 + curveOffset;

      layoutItems.push({
        component: s,
        x,
        y,
        category: 'sensor',
        anchorPort: port
      });
    });

    // Place Cognitive modules along the Left side (X ~ 90 to 180, Y ~ 170 to 450)
    const cognitiveCount = cognitive.length;
    cognitive.forEach((c, idx) => {
      const port = getAnchorPort('cognitive', embodimentId);
      let y = centerY;
      if (cognitiveCount === 1) {
        y = centerY;
      } else {
        const step = Math.min(75, 280 / Math.max(1, cognitiveCount - 1));
        const startY = centerY - ((cognitiveCount - 1) * step) / 2;
        y = startY + idx * step;
      }
      const x = 110;

      layoutItems.push({
        component: c,
        x,
        y,
        category: 'cognitive',
        anchorPort: port
      });
    });

    // Place Motor Skills / Tools along the Right and Bottom Right side
    const motorCount = motor.length;
    motor.forEach((m, idx) => {
      const port = getAnchorPort('motor', embodimentId);
      let y = centerY;
      if (motorCount === 1) {
        y = centerY;
      } else {
        const step = Math.min(80, 280 / Math.max(1, motorCount - 1));
        const startY = centerY - ((motorCount - 1) * step) / 2;
        y = startY + idx * step;
      }
      const x = 750;

      layoutItems.push({
        component: m,
        x,
        y,
        category: 'motor',
        anchorPort: port
      });
    });

    return layoutItems;
  };

  const layoutItems = getComponentNodeLayout();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg text-slate-100 flex flex-col">
      {/* Visualizer Top Control Bar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                Architectural Schematic
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                {allComponents.length} Modules Synced
              </span>
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {teamName || "Autonomous Rescue Unit"} &bull; {activeEmbodiment?.name || "Chassis Unspecified"}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleExportPNG}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Download high-resolution PNG schematic for presentation slides or reports"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>{isExporting ? 'Exporting...' : 'Save Schematic'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Blueprint Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950/90 p-2 sm:p-4 select-none flex justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full max-w-4xl h-auto drop-shadow-md"
          style={{ minWidth: '640px' }}
        >
          <defs>
            {/* Engineering Grid Pattern */}
            <pattern id="blueprint-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="#334155" opacity="0.6" />
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.5" />
            </pattern>

            {/* Gradients */}
            <linearGradient id="sensor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="cognitive-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>

            <linearGradient id="motor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Glowing filter for active links */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Blueprint Grid Background */}
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#blueprint-grid)" rx="8" />

          {/* Technical Corner & Blueprint Markers */}
          <g stroke="#334155" strokeWidth="1.5" fill="none">
            {/* Top-Left */}
            <path d="M 20 40 L 20 20 L 40 20" />
            {/* Top-Right */}
            <path d="M 840 40 L 840 20 L 820 20" />
            {/* Bottom-Left */}
            <path d="M 20 520 L 20 540 L 40 540" />
            {/* Bottom-Right */}
            <path d="M 840 520 L 840 540 L 820 540" />
            {/* Center target crosshair */}
            <line x1={centerX - 40} y1={centerY} x2={centerX + 40} y2={centerY} stroke="#1E293B" strokeDasharray="3,3" />
            <line x1={centerX} y1={centerY - 40} x2={centerX} y2={centerY + 40} stroke="#1E293B" strokeDasharray="3,3" />
            <circle cx={centerX} cy={centerY} r="180" stroke="#1E293B" strokeWidth="1" strokeDasharray="4,6" />
          </g>

          {/* Category Region Labels */}
          <text x="430" y="28" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="700" letterSpacing="1.5" opacity="0.8">
            PERCEPTION & SENSORY SUBSTRATES (TOP)
          </text>
          <text x="80" y="140" textAnchor="start" fill="#818CF8" fontSize="10" fontWeight="700" letterSpacing="1.5" opacity="0.8">
            COGNITIVE LAYERS
          </text>
          <text x="780" y="140" textAnchor="end" fill="#F59E0B" fontSize="10" fontWeight="700" letterSpacing="1.5" opacity="0.8">
            MOTOR & ACTUATION
          </text>

          {/* Leader Lines Connecting Modules to Embodiment Ports */}
          <g id="connector-lines">
            {layoutItems.map(item => {
              const isItemActive = activeComponentId === item.component.id;
              let lineColor = '#475569';
              if (item.category === 'sensor') lineColor = isItemActive ? '#10B981' : '#059669';
              if (item.category === 'cognitive') lineColor = isItemActive ? '#818CF8' : '#4F46E5';
              if (item.category === 'motor') lineColor = isItemActive ? '#F59E0B' : '#D97706';

              return (
                <g key={`line-${item.component.id}`}>
                  {/* Subtle glow if active */}
                  {isItemActive && (
                    <path
                      d={`M ${item.x} ${item.y} Q ${(item.x + item.anchorPort.x) / 2} ${(item.y + item.anchorPort.y) / 2 + 10} ${item.anchorPort.x} ${item.anchorPort.y}`}
                      stroke={lineColor}
                      strokeWidth="5"
                      fill="none"
                      opacity="0.5"
                      filter="url(#glow)"
                    />
                  )}
                  {/* Main Connector Wire */}
                  <path
                    d={`M ${item.x} ${item.y} Q ${(item.x + item.anchorPort.x) / 2} ${(item.y + item.anchorPort.y) / 2 + 10} ${item.anchorPort.x} ${item.anchorPort.y}`}
                    stroke={lineColor}
                    strokeWidth={isItemActive ? '2.5' : '1.5'}
                    strokeDasharray={isItemActive ? 'none' : '4,4'}
                    fill="none"
                    opacity={isItemActive ? 1 : 0.65}
                    className="transition-all duration-300"
                  />
                  {/* Port Terminal Point on Robot */}
                  <circle
                    cx={item.anchorPort.x}
                    cy={item.anchorPort.y}
                    r={isItemActive ? 5 : 3.5}
                    fill={lineColor}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </g>

          {/* Central Robot Embodiment */}
          <g id="robot-body" className="cursor-pointer">
            {renderEmbodimentChassis(activeEmbodiment?.id)}
          </g>

          {/* Component Nodes (Pills with Icons and Labels) */}
          <g id="component-nodes">
            {layoutItems.map(item => {
              const isSelectedOrHovered = activeComponentId === item.component.id;
              const pillWidth = 135;
              const pillHeight = 36;
              const pillX = item.x - pillWidth / 2;
              const pillY = item.y - pillHeight / 2;

              let catBg = '#064E3B';
              let catBorder = '#10B981';
              let badgeColor = '#10B981';
              if (item.category === 'cognitive') {
                catBg = '#312E81';
                catBorder = '#818CF8';
                badgeColor = '#818CF8';
              } else if (item.category === 'motor') {
                catBg = '#78350F';
                catBorder = '#F59E0B';
                badgeColor = '#F59E0B';
              }

              return (
                <g
                  key={`node-${item.component.id}`}
                  transform={`translate(0, 0)`}
                  onMouseEnter={() => setHoveredComponentId(item.component.id)}
                  onMouseLeave={() => setHoveredComponentId(null)}
                  onClick={() => setSelectedNodeId(prev => prev === item.component.id ? null : item.component.id)}
                  className="cursor-pointer group"
                >
                  {/* Node Capsule Background */}
                  <rect
                    x={pillX}
                    y={pillY}
                    width={pillWidth}
                    height={pillHeight}
                    rx="18"
                    fill="#1E293B"
                    stroke={isSelectedOrHovered ? catBorder : '#334155'}
                    strokeWidth={isSelectedOrHovered ? 2.5 : 1.5}
                    className="transition-all duration-200"
                  />

                  {/* Icon Circle */}
                  <circle
                    cx={pillX + 18}
                    cy={item.y}
                    r="12"
                    fill={catBg}
                    stroke={catBorder}
                    strokeWidth="1.5"
                  />

                  {/* Node Title */}
                  <text
                    x={pillX + 36}
                    y={item.y - 1}
                    fill="#F8FAFC"
                    fontSize="10.5"
                    fontWeight="700"
                    className="select-none"
                  >
                    {item.component.name.length > 14
                      ? item.component.name.slice(0, 13) + '…'
                      : item.component.name}
                  </text>

                  {/* Cost badge */}
                  <text
                    x={pillX + 36}
                    y={item.y + 11}
                    fill={badgeColor}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                    className="select-none"
                  >
                    {item.component.baseCost} PTS &bull; {item.category.toUpperCase()}
                  </text>

                  {/* SVG ForeignObject to render real Lucide Icon seamlessly inside */}
                  <foreignObject
                    x={pillX + 8}
                    y={item.y - 10}
                    width="20"
                    height="20"
                    className="pointer-events-none text-white"
                  >
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <DynamicIcon name={item.component.icon} className="w-3.5 h-3.5 text-white" />
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>

          {/* Central Embodiment Tag (Bottom Center of Robot) */}
          <g transform={`translate(${centerX}, 395)`}>
            <rect
              x="-110"
              y="-12"
              width="220"
              height="24"
              rx="12"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            <text x="0" y="4" textAnchor="middle" fill="#38BDF8" fontSize="10.5" fontWeight="700" letterSpacing="0.5">
              {activeEmbodiment ? activeEmbodiment.name.toUpperCase() : "NO EMBODIMENT CHOSEN"}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Inspection Card Footer */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-xs">
        {activeComponent ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  activeComponent.category === 'sensor'
                    ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                    : activeComponent.category === 'cognitive'
                    ? 'bg-indigo-950 border border-indigo-700 text-indigo-300'
                    : activeComponent.category === 'motor'
                    ? 'bg-amber-950 border border-amber-700 text-amber-300'
                    : 'bg-blue-950 border border-blue-700 text-blue-300'
                }`}
              >
                <DynamicIcon name={activeComponent.icon} className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {activeComponent.name}
                  </span>
                  <span className="font-mono text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {activeComponent.baseCost} pts
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    [{activeComponent.category}]
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 sm:line-clamp-none">
                  {activeComponent.shortDescription}
                </p>
              </div>
            </div>

            {onEditCategory && (
              <button
                type="button"
                onClick={() => onEditCategory(activeComponent.category)}
                className="self-start sm:self-center shrink-0 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Configure Module &rarr;
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-slate-400 py-0.5">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-500" />
              Hover or click any module node or embodiment to inspect technical specifications and connection paths.
            </span>
            <span className="hidden sm:inline text-slate-500 text-[11px]">
              Ready for physical workshop evaluation & discussion
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
