export const PHI = (1 + Math.sqrt(5)) / 2;
export const GOLDEN_ANGLE = 360 * (1 - 1 / PHI);
export const DEG = Math.PI / 180;

export const FAMILY_COLORS = {
  alkali: "#fda4af",
  alkaline: "#fdba74",
  transition: "#c4b5fd",
  postTransition: "#d4d4d8",
  metalloid: "#86efac",
  nonmetal: "#bbf7d0",
  halogen: "#fde68a",
  noble: "#bfdbfe",
  lanthanide: "#99f6e4",
  actinide: "#93c5fd",
  future: "#e5e7eb",
  unknown: "#e5e7eb",
};

export const FAMILY_LABELS = {
  alkali: "Alkali metal",
  alkaline: "Alkaline earth",
  transition: "Transition metal",
  postTransition: "Post-transition",
  metalloid: "Metalloid",
  nonmetal: "Reactive nonmetal",
  halogen: "Halogen",
  noble: "Noble gas",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
  future: "Future / unconfirmed",
  unknown: "Unknown",
};

export const BLOCK_COLORS = {
  s: "#fed7aa",
  p: "#bbf7d0",
  d: "#c4b5fd",
  f: "#bfdbfe",
  unknown: "#e5e7eb",
};

export const COMPLETENESS_FIELDS = [
  { key: "atomicMass", label: "Atomic mass" },
  { key: "electronegativity", label: "Electronegativity" },
  { key: "ionization", label: "Ionization energy" },
  { key: "density", label: "Density" },
  { key: "meltingPointK", label: "Melting point" },
  { key: "boilingPointK", label: "Boiling point" },
  { key: "phaseAtSTP", label: "Phase at STP" },
  { key: "occurrence", label: "Occurrence" },
  { key: "electronConfiguration", label: "Electron configuration" },
  { key: "stableIsotopeCount", label: "Stable isotope count" },
  { key: "standardAtomicWeightNote", label: "Atomic weight note" },
  { key: "halfLife", label: "Half-life" },
  { key: "decayMode", label: "Decay mode" },
  { key: "stable", label: "Stability flag" },
  { key: "discovered", label: "Discovery year" },
];

export const PROPERTY_PRESETS = {
  family: "Chemical family",
  digitalRoot: "369 / digital root",
  period: "Period",
  block: "Electron block",
  frontier: "Superheavy frontier",
  stability: "Stable vs radioactive",
  atomicMass: "Atomic mass heatmap",
  electronegativity: "Electronegativity heatmap",
  ionization: "1st ionization energy heatmap",
  density: "Density heatmap",
  meltingPointK: "Melting point heatmap",
  boilingPointK: "Boiling point heatmap",
  stableIsotopeCount: "Stable isotope count heatmap",
};

export const VIEW_PRESETS = {
  seed: "Golden seed field",
  ribbon: "Spiral ribbon",
  table: "Standard table",
};

export const HARMONIC_FILTERS = {
  all: "All roots",
  1: "Root 1",
  2: "Root 2",
  3: "Root 3",
  4: "Root 4",
  5: "Root 5",
  6: "Root 6",
  7: "Root 7",
  8: "Root 8",
  9: "Root 9",
};

export const RESONANCE_MODES = {
  harmonic: "Same digital root",
  family: "Same chemical family",
  period: "Same period",
  band: "Same radial band",
  isotope: "Nearest isotope runway",
};

export const MAGIC_PROTONS = [2, 8, 20, 28, 50, 82, 114, 120, 126];
export const MAGIC_NEUTRONS = [2, 8, 20, 28, 50, 82, 126, 184];

export const ISOTOPE_PRESETS = {
  stabilityIsland: { label: "Island target", neutronNumber: 184 },
  selectedBalanced: { label: "Balanced N/Z", neutronNumber: null },
};

export const LAB_EXPERIMENTS = {
  harmonicAudit: "Harmonic property audit",
  correlationStudy: "Property correlation study",
  frontierRunway: "Superheavy runway review",
  resonanceTrace: "Resonance graph trace",
  claimDiscipline: "Claim discipline review",
};

export const CORRELATION_PROPERTIES = ["atomicMass", "electronegativity", "ionization", "density"];
