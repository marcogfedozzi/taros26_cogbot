/**
 * ============================================================================
 * WORKSHOP CONFIGURATION FILE
 * ============================================================================
 * 
 * You do NOT need to touch any HTML/CSS to customize this workshop!
 * You can easily edit everything directly in this file:
 * 
 * 1. HOW TO CHANGE BUDGET:
 *    Change `defaultBudget: 100` below to any number of points you want.
 * 
 * 2. HOW TO EDIT AN ITEM OR CHANGE ITS COST:
 *    Find the item in the `components` list and change `baseCost: 20` to another number.
 * 
 * 3. HOW TO PREVENT INCOMPATIBLE CHOICES (CONSTRAINTS):
 *    Add the other item's `id` to the `incompatibleWith` array:
 *    Example:
 *      id: "snake_robot",
 *      incompatibleWith: ["precision_arm", "heavy_debris_shoring"],
 *      incompatibilityReasons: {
 *        "precision_arm": "Snake morphology lacks rigid anchor joints to operate an arm.",
 *        "heavy_debris_shoring": "A snake body cannot exert high-torque shoring force."
 *      }
 * 
 * 4. HOW TO ADD PREREQUISITES / REQUIRED ITEMS:
 *    Add the required item's `id` to the `requires` array:
 *    Example:
 *      id: "causal_reasoning",
 *      requires: ["working_memory"],
 *      requirementReason: "Causal reasoning requires a working memory buffer to compare states."
 * 
 * 5. HOW TO ADD SYNERGIES / VARIABLE COSTS (DISCOUNTS OR PENALTIES):
 *    Add an entry in `costModifiers`:
 *    Example:
 *      costModifiers: [
 *        { withItemId: "lidar_3d", costChange: -5, reason: "Hardware SLAM fusion discount (-5 pts)" }
 *      ]
 *      (Use negative numbers like -5 for discounts, positive like +5 for extra cost/load)
 * 
 * 6. HOW TO ADD A NEW ITEM:
 *    Copy an existing item block, paste it at the bottom of its category, and give it a unique `id`.
 * ============================================================================
 */

import { WorkshopConfig } from '../types/robot';

export const workshopConfig: WorkshopConfig = {
  workshopTitle: "Rescue Robot Architecture Workshop",
  workshopSubtitle: "Embodiment, Perception, Cognition & Motor Repertoire",
  defaultBudget: 100, // Total points each participant gets
  allowOverBudget: false, // Prevents spending more than budget

  scenarios: [
    {
      id: "collapsed_urban_hospital",
      title: "Scenario Alpha: Collapsed Urban Hospital",
      subtitle: "Multi-story concrete collapse post-earthquake with toxic gas risk",
      environment: "Unstable rubble piles, pitch-black basements, dense dust, suspected methane leaks, narrow crawl spaces.",
      keyChallenges: [
        "Unstable structural rubble (risk of secondary collapse)",
        "Zero visibility from concrete dust and fire smoke",
        "Narrow crevices where survivors may be trapped",
        "Unknown gas leak hazards before medical teams can enter"
      ],
      recommendedBudget: 100,
      description: "Design an autonomous or semi-autonomous search-and-rescue robot to penetrate deep into the collapsed sub-levels, map navigable paths, locate human vital signs, and report structural stability."
    },
    {
      id: "flooded_metro_tunnel",
      title: "Scenario Beta: Flooded Subway Transit Hub",
      subtitle: "Subterranean tunnel collapse with rising water and severed communications",
      environment: "Waist-deep water, submerged debris, live exposed wiring, total communication dead zones, reverberant acoustic echoes.",
      keyChallenges: [
        "Mixed amphibious / wading mobility required",
        "Severed radio signals requiring high local autonomy",
        "Acoustic noise and echo confusion",
        "Corrosive brackish water and sharp submerged obstacles"
      ],
      recommendedBudget: 100,
      description: "Design a rescue unit capable of scouting submerged corridors, establishing ad-hoc communication lines, and checking train carriages for trapped commuters."
    }
  ],

  components: [
    // =========================================================================
    // 1. EMBODIMENTS (Physical Form & Morphology)
    // =========================================================================
    {
      id: "quadruped_robot",
      name: "Agile Quadruped (4-Legged)",
      category: "embodiment",
      baseCost: 28,
      icon: "Dog",
      shortDescription: "Highly agile 4-legged robotic platform with dynamic stepping.",
      detailedDescription: "Excellent at clambering over jagged rubble, climbing stairs, and stepping over gaps. Offers moderate payload capacity and medium battery endurance.",
      tags: ["Legged", "Medium Payload", "All-Terrain Mobility"],
      costModifiers: [
        {
          withItemId: "adaptive_locomotion",
          costChange: -4,
          reason: "Morphological match: Legged compliance algorithms pre-optimized (-4 pts)"
        }
      ]
    },
    {
      id: "tracked_rover",
      name: "Tracked Urban Tank Rover",
      category: "embodiment",
      baseCost: 26,
      icon: "Boxes",
      shortDescription: "Heavy-duty dual caterpillar track chassis with high torque.",
      detailedDescription: "Superior payload capacity and rugged stability over crushed glass, rebar, and loose gravel. Very stable platform for heavy manipulation, but slower and wider footprint.",
      tags: ["Tracked", "High Payload", "High Torque", "Bulky"],
      costModifiers: [
        {
          withItemId: "heavy_debris_shoring",
          costChange: -4,
          reason: "Chassis weight and low center of gravity support heavy lifting (-4 pts)"
        }
      ]
    },
    {
      id: "snake_robot",
      name: "Modular Snake-like Robot",
      category: "embodiment",
      baseCost: 24,
      icon: "Spline",
      shortDescription: "Slender hyper-redundant articulated snake body for deep crawlspaces.",
      detailedDescription: "Can squeeze through 15 cm pipes and serpentine through dense rubble voids where no other vehicle can enter. Very low payload and cannot mount rigid robotic arms.",
      tags: ["Hyper-redundant", "Narrow Crevices", "Low Payload"],
      incompatibleWith: ["precision_arm", "heavy_debris_shoring"],
      incompatibilityReasons: {
        "precision_arm": "A serpentine body lacks rigid reaction stabilization for a cantilevered robotic arm.",
        "heavy_debris_shoring": "A modular snake body cannot exert high-torque shoring force on collapsed structures."
      },
      costModifiers: [
        {
          withItemId: "slither_crevice_gait",
          costChange: -4,
          reason: "Native serpentine kinematics synergy (-4 pts)"
        }
      ]
    },
    {
      id: "biped_humanoid",
      name: "Bipedal Humanoid Chassis",
      category: "embodiment",
      baseCost: 34,
      icon: "User",
      shortDescription: "Two-legged anthropomorphic frame designed for human architecture.",
      detailedDescription: "Able to turn door handles, climb vertical ladders, and use human tools directly. Requires substantial compute and power for balance stabilization.",
      tags: ["Bipedal", "Anthropomorphic", "Complex Dynamics", "High Center of Mass"],
      costModifiers: [
        {
          withItemId: "dynamic_balance",
          costChange: -5,
          reason: "Zero-Moment-Point balance algorithms integrated natively (-5 pts)"
        },
        {
          withItemId: "tool_payload_deployment",
          costChange: -3,
          reason: "Opposable anthropomorphic reach simplifies tool deployment (-3 pts)"
        }
      ]
    },
    {
      id: "micro_aerial_drone",
      name: "Micro-Aerial Hexacopter",
      category: "embodiment",
      baseCost: 22,
      icon: "Plane",
      shortDescription: "Ultra-compact autonomous flight platform with 3D airspace access.",
      detailedDescription: "Bypasses all ground obstacles, flies up elevator shafts and over chasms. Limited flight time (18 mins) and minimal payload capacity.",
      tags: ["Aerial 3D", "Zero Rubble Friction", "Low Battery Life", "Light Payload"],
      incompatibleWith: ["precision_arm", "heavy_debris_shoring", "ground_radar"],
      incompatibilityReasons: {
        "precision_arm": "Exceeds the micro-drone maximum take-off weight (MTOW).",
        "heavy_debris_shoring": "Cannot exert ground reaction force from mid-air flight.",
        "ground_radar": "Ground-penetrating radar payload exceeds aerial lift capacity."
      }
    },
    {
      id: "wheeled_all_terrain",
      name: "6-Wheeled Articulated Rover",
      category: "embodiment",
      baseCost: 20,
      icon: "Disc3",
      shortDescription: "High-efficiency rocker-bogie wheeled rover with extended range.",
      detailedDescription: "Very high electrical efficiency and silent cruising over moderate obstacles and floors. Struggles if large boulders or steep stairs are encountered.",
      tags: ["Wheeled", "High Efficiency", "Long Range", "Moderate Clearance"]
    },

    // =========================================================================
    // 2. SENSORS (Perception & Environmental Substrates)
    // =========================================================================
    {
      id: "rgbd_camera",
      name: "RGB-D Stereo Depth Camera",
      category: "sensor",
      baseCost: 14,
      icon: "Camera",
      shortDescription: "Dense color imagery paired with real-time stereoscopic point clouds.",
      detailedDescription: "Provides high-resolution vision for visual recognition and near-field obstacle avoidance. Degrades significantly in heavy smoke, water spray, or total darkness.",
      tags: ["Optical", "Depth Mapping", "High Resolution"],
      costModifiers: [
        {
          withItemId: "thermal_camera",
          costChange: -3,
          reason: "Multispectral optical fusion pipeline reduces compute overhead (-3 pts)"
        }
      ]
    },
    {
      id: "thermal_camera",
      name: "Infrared Thermal Imager",
      category: "sensor",
      baseCost: 15,
      icon: "Flame",
      shortDescription: "Long-wave IR camera detecting human body heat and fire hotspots.",
      detailedDescription: "Penetrates smoke, dust haze, and pitch-black darkness to locate living victims under light blankets or debris. Does not provide detailed geometric depth.",
      tags: ["Life Detection", "Smoke Penetration", "Heat Signatures"]
    },
    {
      id: "lidar_3d",
      name: "Solid-State 3D LiDAR",
      category: "sensor",
      baseCost: 20,
      icon: "Radar",
      shortDescription: "360-degree laser range scanning generating centimeter-grade 3D geometry.",
      detailedDescription: "Immune to low light; accurately maps collapsed halls, ceiling sag, and structural deformities. Requires moderate computational processing.",
      tags: ["Geometric Precision", "Metric Scale", "Active Lighting"],
      costModifiers: [
        {
          withItemId: "spatial_slam",
          costChange: -5,
          reason: "Hardware scan-matching synergy: Direct LiDAR-to-SLAM integration (-5 pts)"
        }
      ]
    },
    {
      id: "acoustic_array",
      name: "Multimodal Acoustic Microphone Array",
      category: "sensor",
      baseCost: 10,
      icon: "Volume2",
      shortDescription: "Beamforming directional mic array to pinpoint faint calls and creaks.",
      detailedDescription: "Detects tapped Morse codes, survivor crying, gas hissing, or structural cracking sounds. Works through barriers where optical sensors cannot see.",
      tags: ["Audio Triangulation", "Survivor Localization", "Low Power"],
      costModifiers: [
        {
          withItemId: "human_robot_dialogue",
          costChange: -3,
          reason: "Acoustic front-end directly feeds speech recognition model (-3 pts)"
        }
      ]
    },
    {
      id: "gas_chemical_sensor",
      name: "Multi-Gas & Chemical Sniffer",
      category: "sensor",
      baseCost: 12,
      icon: "Biohazard",
      shortDescription: "Electrochemical array detecting CO, methane, H2S, and low oxygen.",
      detailedDescription: "Critical for safety in collapsed spaces with broken gas pipes or oxygen deficiency. Informs the robot and rescue teams before ignition or asphyxiation occurs.",
      tags: ["Hazmat", "Gas Leak Detection", "Safety Alert"]
    },
    {
      id: "tactile_skin",
      name: "Haptic & Tactile Skin Matrix",
      category: "sensor",
      baseCost: 14,
      icon: "Fingerprint",
      shortDescription: "Pressure-sensitive contact skin across outer body and end-effectors.",
      detailedDescription: "Enables tactile blind navigation, detecting physical contact with rubble without causing further collapse. Crucial for gentle object extraction.",
      tags: ["Physical Contact", "Proprioception", "Force Feedback"],
      costModifiers: [
        {
          withItemId: "precision_arm",
          costChange: -4,
          reason: "Tactile closed-loop reflex reduces planning complexity (-4 pts)"
        }
      ]
    },
    {
      id: "ground_radar",
      name: "Sub-surface Ground Radar (GPR)",
      category: "sensor",
      baseCost: 18,
      icon: "Layers",
      shortDescription: "Impulse radar penetrating concrete slabs to detect voids and bodies.",
      detailedDescription: "Can see through 1-2 meters of collapsed concrete slabs to identify hollow air pockets or trapped casualties beneath solid rubble. Heavy and power-intensive.",
      tags: ["Void Detection", "Sub-surface", "High Power"]
    },
    {
      id: "precision_imu",
      name: "Dual Tactical IMU & Odometry",
      category: "sensor",
      baseCost: 8,
      icon: "Compass",
      shortDescription: "High-grade inertial measurement unit and wheel/joint encoders.",
      detailedDescription: "Tracks acceleration, pitch, roll, and dead-reckoning displacement when external visual tracking or GPS is unavailable.",
      tags: ["Inertial", "Orientation", "Low Cost", "Dead Reckoning"]
    },

    // =========================================================================
    // 3. COGNITIVE SKILLS (Cognitive & Developmental Architecture)
    // =========================================================================
    {
      id: "working_memory",
      name: "Working Memory & Context Buffer",
      category: "cognitive",
      baseCost: 15,
      icon: "Cpu",
      shortDescription: "Short-term temporal buffer maintaining recent sensory events & goals.",
      detailedDescription: "Prevents the robot from forgetting recently explored intersections or transient sensor alerts. Foundational substrate for higher-level reasoning.",
      tags: ["Cognitive Buffer", "Temporal Context", "Core Architecture"]
    },
    {
      id: "spatial_slam",
      name: "Topological & Metric SLAM",
      category: "cognitive",
      baseCost: 16,
      icon: "Map",
      shortDescription: "Real-time simultaneous localization and mapping of unknown spaces.",
      detailedDescription: "Builds a metric grid and topological graph of navigated corridors so the robot can find its way back out and mark survivor coordinates for human rescue teams.",
      tags: ["Spatial Mapping", "Navigation", "Path Memory"],
      requiresAny: ["rgbd_camera", "lidar_3d"],
      requirementReason: "Spatial SLAM requires at least one geometric depth sensor (either 3D LiDAR or RGB-D Camera).",
      costModifiers: [
        {
          withItemId: "intrinsic_curiosity",
          costChange: -4,
          reason: "Frontier exploration algorithms reuse topological graph structures (-4 pts)"
        }
      ]
    },
    {
      id: "intrinsic_curiosity",
      name: "Developmental Intrinsic Curiosity",
      category: "cognitive",
      baseCost: 14,
      icon: "Sparkles",
      shortDescription: "Novelty-seeking developmental drive for autonomous room exploration.",
      detailedDescription: "Directs the robot to investigate unfamiliar dark alcoves, open doorways, and sensory anomalies without waiting for teleoperated commands.",
      tags: ["Autonomy", "Developmental Drive", "Exploration"],
      requires: ["working_memory"],
      requirementReason: "Curiosity requires a memory buffer to distinguish novel stimuli from already explored states."
    },
    {
      id: "hierarchical_planning",
      name: "Hierarchical Task & Motion Planning",
      category: "cognitive",
      baseCost: 18,
      icon: "GitFork",
      shortDescription: "Decomposes abstract goals ('find survivor') into physical action sequences.",
      detailedDescription: "Bridges high-level symbolic task logic with low-level continuous trajectory optimization. Adapts when an intended doorway is blocked by debris.",
      tags: ["Symbolic Planning", "Goal Decomposition", "Deliberative"],
      requires: ["working_memory"],
      requirementReason: "Hierarchical planning requires working memory to store active task sub-goals.",
      costModifiers: [
        {
          withItemId: "working_memory",
          costChange: -3,
          reason: "Working memory buffer directly caches planning state transitions (-3 pts)"
        }
      ]
    },
    {
      id: "causal_reasoning",
      name: "Causal Physics & Collapse Predictor",
      category: "cognitive",
      baseCost: 20,
      icon: "Brain",
      shortDescription: "Predictive forward simulation of rubble physics before disturbing rocks.",
      detailedDescription: "Evaluates stability of debris piles before touching them. Prevents the robot from triggering a deadly secondary collapse when attempting to extract victims.",
      tags: ["Intuitive Physics", "Safety Critical", "Simulation"],
      requires: ["working_memory"],
      requirementReason: "Causal reasoning requires working memory to compare simulated before-and-after states.",
      costModifiers: [
        {
          withItemId: "forward_model",
          costChange: -5,
          reason: "Physics engine shares internal forward dynamics simulator (-5 pts)"
        }
      ]
    },
    {
      id: "human_robot_dialogue",
      name: "Affective Social & Voice Dialogue",
      category: "cognitive",
      baseCost: 12,
      icon: "MessageSquare",
      shortDescription: "Calming voice interaction and stress assessment for trapped survivors.",
      detailedDescription: "Speaks in empathetic, clear language to calm frightened victims, asks screening questions about injuries, and broadcasts reassurance that rescuers are arriving.",
      tags: ["Social HRI", "Survivor Triage", "Voice Interaction"],
      requires: ["acoustic_array"],
      requirementReason: "Interactive vocal dialogue requires an acoustic microphone array to hear survivor answers."
    },
    {
      id: "forward_model",
      name: "Sensorimotor Forward Model",
      category: "cognitive",
      baseCost: 14,
      icon: "FastForward",
      shortDescription: "Mental sandbox predicting expected sensory outcomes of own motor actions.",
      detailedDescription: "Computes motor efference copies to anticipate how the body will move. Allows instant detection of slippage, motor stalls, or unexpected collisions.",
      tags: ["Predictive Processing", "Efference Copy", "Reflex Modulation"]
    },
    {
      id: "episodic_replay",
      name: "Episodic Memory & Failure Replay",
      category: "cognitive",
      baseCost: 15,
      icon: "History",
      shortDescription: "Retains past traversal episodes to rapidly adapt when getting stuck.",
      detailedDescription: "Stores episodes of near-misses, slip events, or dead-ends. Allows offline consolidation and quick heuristic retrieval when encountering similar rubble formations.",
      tags: ["Episodic Learning", "Developmental Adaptation", "Long-term Memory"],
      requires: ["working_memory"],
      requirementReason: "Episodic encoding transfers traces from active working memory."
    },

    // =========================================================================
    // 4. MOTOR SKILLS (Locomotion, Manipulation & Action Repertoire)
    // =========================================================================
    {
      id: "adaptive_locomotion",
      name: "Adaptive Rough-Terrain Gait",
      category: "motor",
      baseCost: 16,
      icon: "Footprints",
      shortDescription: "Continuous dynamic terrain adaptation and foothold selection.",
      detailedDescription: "Real-time compliance adjustment that handles shifting stones, stairs, and loose sand without stumbling.",
      tags: ["Locomotion", "Foothold Adaptation", "Stability"]
    },
    {
      id: "precision_arm",
      name: "Multi-DOF Precision Robotic Arm",
      category: "motor",
      baseCost: 22,
      icon: "Crosshair",
      shortDescription: "Dexterous 6-axis manipulator for careful debris clearing and latch opening.",
      detailedDescription: "Equipped with a soft gripper to delicately lift debris off trapped limbs, open doors, or deliver two-way radios and water to survivors.",
      tags: ["Manipulation", "Dexterity", "Survivor Aid"],
      incompatibleWith: ["snake_robot", "micro_aerial_drone"],
      incompatibilityReasons: {
        "snake_robot": "Snake morphology lacks rigid anchor joints to stabilize a cantilevered arm.",
        "micro_aerial_drone": "Payload exceeds drone flight lifting capability."
      },
      costModifiers: [
        {
          withItemId: "tactile_skin",
          costChange: -4,
          reason: "Haptic feedback eliminates bulky vision-only manipulation control loops (-4 pts)"
        }
      ]
    },
    {
      id: "heavy_debris_shoring",
      name: "High-Force Shoring & Jacking Lift",
      category: "motor",
      baseCost: 24,
      icon: "ShieldAlert",
      shortDescription: "Heavy hydraulic jack or spreader to shore up collapsing slabs.",
      detailedDescription: "Exerts up to 1.5 tons of lifting or stabilizing force to prop open a collapsed ceiling pocket long enough for medical access.",
      tags: ["High Torque", "Structural Support", "Heavy Force"],
      incompatibleWith: ["snake_robot", "micro_aerial_drone"],
      incompatibilityReasons: {
        "snake_robot": "Snake body cannot generate the ground-reaction normal force needed for heavy shoring.",
        "micro_aerial_drone": "Aerial platforms cannot exert ground-level hydraulic shoring force."
      }
    },
    {
      id: "dynamic_balance",
      name: "Dynamic Balance & Rapid Fall Recovery",
      category: "motor",
      baseCost: 15,
      icon: "Activity",
      shortDescription: "Active posture stabilization and self-righting after falls.",
      detailedDescription: "Allows the robot to regain balance when a rock gives way underneath it, or autonomously right itself if it rolls onto its back down a slope.",
      tags: ["Self-Righting", "Fall Prevention", "Balance"]
    },
    {
      id: "tool_payload_deployment",
      name: "Medical Kit & Sensor Beacon Dispenser",
      category: "motor",
      baseCost: 12,
      icon: "PackagePlus",
      shortDescription: "Ejectable payload bay for dropping Wi-Fi relays and medical triage packs.",
      detailedDescription: "Drops acoustic markers, emergency water rations, oxygen masks, and wireless relay nodes along the route to maintain communication back to base.",
      tags: ["Payload Dropper", "Communications Relay", "First Aid"]
    },
    {
      id: "slither_crevice_gait",
      name: "Narrow Crevice Undulation Gait",
      category: "motor",
      baseCost: 14,
      icon: "Maximize2",
      shortDescription: "Whole-body concertina and lateral undulation through tight voids.",
      detailedDescription: "Propels the robot through gaps as narrow as 15 cm by undulating body segments against surrounding rubble walls.",
      tags: ["Void Traversal", "Serpentine Gaits", "Tight Confines"]
    },
    {
      id: "autonomous_winch",
      name: "Heavy-Duty Rappel & Winch Tether",
      category: "motor",
      baseCost: 14,
      icon: "Anchor",
      shortDescription: "Motorized cable reel for descending vertical elevator shafts.",
      detailedDescription: "Allows controlled vertical descent into shattered stairwells, sinkholes, or mine shafts, and provides a physical retrieval tether if system power is cut.",
      tags: ["Vertical Access", "Tethered Safety", "Elevator Shafts"]
    }
  ]
};
