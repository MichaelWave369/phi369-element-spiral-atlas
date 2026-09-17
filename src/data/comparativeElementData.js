export const COMPARATIVE_VIEWS = [
  {
    id: "modern",
    label: "Modern periodic",
    shortLabel: "Modern",
    status: "measured / standard",
    description: "Standard periodic placement by period, group, block, and family.",
  },
  {
    id: "phi",
    label: "PHI369 spiral",
    shortLabel: "Phi Spiral",
    status: "computed geometry",
    description: "Golden-angle placement derived directly from atomic number.",
  },
  {
    id: "russell",
    label: "Russell 1926",
    shortLabel: "Russell",
    status: "historical / curation",
    description: "Historical octave/circular interpretation. Exact chart coordinates must be transcribed from primary-source charts before being treated as data.",
  },
  {
    id: "origin",
    label: "Nuclear origins",
    shortLabel: "Origins",
    status: "modern astrophysics",
    description: "High-level nucleosynthesis context. These summaries are intentionally simplified and do not encode isotope-by-isotope production fractions.",
  },
];

export const FEATURED_ORIGIN_NOTES = {
  1: {
    label: "Early-universe nucleosynthesis",
    summary: "Most ordinary hydrogen traces to Big Bang nucleosynthesis and the early universe.",
    confidence: "high-level consensus",
  },
  6: {
    label: "Stellar nucleosynthesis",
    summary: "Carbon is produced primarily inside stars, especially through helium-burning reactions such as the triple-alpha process.",
    confidence: "high-level consensus",
  },
  8: {
    label: "Stellar nucleosynthesis",
    summary: "Oxygen is produced largely by fusion reactions in stars and later dispersed into space.",
    confidence: "high-level consensus",
  },
  26: {
    label: "Massive stars + explosive dispersal",
    summary: "Iron-group material is assembled in late stellar burning and explosive events, then dispersed by supernovae and related stellar deaths.",
    confidence: "simplified overview",
  },
  79: {
    label: "Rapid neutron capture",
    summary: "Gold is associated strongly with r-process nucleosynthesis, including neutron-star mergers; multiple astrophysical sites may contribute.",
    confidence: "active quantitative refinement",
  },
  92: {
    label: "Rapid neutron capture",
    summary: "Uranium is produced in extreme neutron-rich r-process environments before being incorporated into later generations of stars and planets.",
    confidence: "high-level consensus; site fractions uncertain",
  },
};

export const RUSSELL_CURATED_NOTES = {
  79: {
    status: "context verified; coordinate pending",
    summary: "Gold appears in Russell's heavy-element octave sequence near platinum, mercury, and neighboring heavy elements. Exact octave/circular coordinates are intentionally withheld until primary-chart transcription is completed.",
  },
};

export const COMPARATIVE_METHOD_NOTE = `
This lab keeps four different kinds of representation separate:
(1) standard measured/accepted chemical organization,
(2) mathematically computed PHI369 geometry,
(3) historical Walter Russell interpretation, and
(4) modern nucleosynthesis summaries.
Similarity between pictures is not evidence that the underlying physical theories are equivalent.
`;
