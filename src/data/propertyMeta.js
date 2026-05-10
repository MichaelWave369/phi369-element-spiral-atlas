export const PROPERTY_META = {
  atomicMass: { label: "Atomic mass", unit: "u", min: 1, max: 294 },
  electronegativity: { label: "Electronegativity", unit: "Pauling", min: 0.7, max: 4.0 },
  ionization: { label: "1st ionization", unit: "eV", min: 3.5, max: 25 },
  density: { label: "Density", unit: "g/cm³", min: 0, max: 22.6 },
  meltingPointK: { label: "Melting point", unit: "K", min: 0, max: 4000 },
  boilingPointK: { label: "Boiling point", unit: "K", min: 0, max: 6000 },
  stableIsotopeCount: { label: "Stable isotope count", unit: "", min: 0, max: 10 },
};

export const PROPERTY_FIELD_LABELS = {
  atomicMass: "Atomic mass",
  electronegativity: "Electronegativity",
  ionization: "1st ionization",
  density: "Density",
  meltingPointK: "Melting point",
  boilingPointK: "Boiling point",
  phaseAtSTP: "Phase at STP",
  occurrence: "Occurrence",
  electronConfiguration: "Electron configuration",
  stableIsotopeCount: "Stable isotope count",
  standardAtomicWeightNote: "Atomic weight note",
  halfLife: "Half-life",
  decayMode: "Decay mode",
  stable: "Stability flag",
  discovered: "Discovery year",
};
