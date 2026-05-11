export const DATA_CURATION_STATUS = {
  schemaVersion: "2.9",
  status: "curated-in-progress",
  claim: "This is not yet a complete authoritative scientific database. v2.6 adds source retrieval metadata for provenance discipline.",
  fields: {
    atomicMass: { status: "partially-seeded", sourceIds: ["iupac", "rsc", "pubchem"], notes: "Seeded values exist for interface development; full verification pending." },
    electronegativity: { status: "partially-seeded", sourceIds: ["rsc", "pubchem"], notes: "Seeded Pauling values exist for selected elements; full verification pending." },
    ionization: { status: "partially-seeded", sourceIds: ["nist", "pubchem"], notes: "Seeded first-ionization values exist for selected elements; full verification pending." },
    density: { status: "partially-seeded", sourceIds: ["rsc", "pubchem"], notes: "Seeded values exist for selected elements; units require careful phase/context handling." },
    phaseAtSTP: { status: "curated-batch-1", sourceIds: ["rsc", "pubchem"], notes: "v2.5 fills simplified coverage for all confirmed elements 1–118; 119/120 remain future-unconfirmed placeholders." },
    occurrence: { status: "curated-batch-1", sourceIds: ["iupac", "rsc", "pubchem"], notes: "v2.5 fills simplified coverage for all confirmed elements 1–118; 119/120 remain future-unconfirmed placeholders." },
    electronConfiguration: { status: "limited-seed-batch-4", sourceIds: ["rsc", "pubchem"], notes: "v2.9 expands electron configurations through element 86 (Rn); lanthanide/heavy-element configurations use simplified reference notation and should be verified against sources." },
    meltingPointK: { status: "not-curated", sourceIds: [], notes: "Schema and heatmap metadata exist; values remain null until curated." },
    boilingPointK: { status: "not-curated", sourceIds: [], notes: "Schema and heatmap metadata exist; values remain null until curated." },
    stableIsotopeCount: { status: "not-curated", sourceIds: [], notes: "Schema and heatmap metadata exist; values remain null until curated." },
    halfLife: { status: "not-curated", sourceIds: [], notes: "Schema exists; values remain null until isotope data is curated." },
    decayMode: { status: "not-curated", sourceIds: [], notes: "Schema exists; values remain null until isotope data is curated." },
  },
};
