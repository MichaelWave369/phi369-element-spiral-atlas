export const DATA_CURATION_STATUS = {
  schemaVersion: "2.3",
  status: "curated-in-progress",
  claim: "This is not yet a complete authoritative scientific database.",
  fields: {
    atomicMass: { status: "partially-seeded", sourceIds: ["iupac", "rsc", "pubchem"], notes: "Seeded values exist for interface development; full verification pending." },
    electronegativity: { status: "partially-seeded", sourceIds: ["rsc", "pubchem"], notes: "Seeded Pauling values exist for selected elements; full verification pending." },
    ionization: { status: "partially-seeded", sourceIds: ["nist", "pubchem"], notes: "Seeded first-ionization values exist for selected elements; full verification pending." },
    density: { status: "partially-seeded", sourceIds: ["rsc", "pubchem"], notes: "Seeded values exist for selected elements; units require careful phase/context handling." },
    phaseAtSTP: { status: "curated-seed-layer", sourceIds: ["rsc", "pubchem"], notes: "v2.3 begins a lightweight phase-at-STP seed layer for common/reference elements only." },
    occurrence: { status: "curated-seed-layer", sourceIds: ["iupac", "rsc", "pubchem"], notes: "v2.3 begins a simple occurrence classification for common/reference elements only." },
    electronConfiguration: { status: "not-curated", sourceIds: [], notes: "Schema exists; values remain null until curated." },
    meltingPointK: { status: "not-curated", sourceIds: [], notes: "Schema and heatmap metadata exist; values remain null until curated." },
    boilingPointK: { status: "not-curated", sourceIds: [], notes: "Schema and heatmap metadata exist; values remain null until curated." },
    stableIsotopeCount: { status: "not-curated", sourceIds: [], notes: "Schema and heatmap metadata exist; values remain null until curated." },
    halfLife: { status: "not-curated", sourceIds: [], notes: "Schema exists; values remain null until isotope data is curated." },
    decayMode: { status: "not-curated", sourceIds: [], notes: "Schema exists; values remain null until isotope data is curated." },
  },
};
