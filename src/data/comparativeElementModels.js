export const COMPARATIVE_MODEL_SOURCES = {
  modern: {
    id: "modern-periodic",
    label: "Modern periodic reference",
    authority: "reference",
    claimClass: "standard chemistry",
    description: "Period, group, block, and family come from the atlas element identity table.",
  },
  phi: {
    id: "phi-spiral",
    label: "PHI369 spiral projection",
    authority: "experimental projection",
    claimClass: "geometry / research lens",
    description: "Atomic number is projected through the atlas golden-angle geometry. The projection is a visualization and hypothesis-generating lens, not a replacement for chemistry.",
  },
  russell: {
    id: "russell-1926",
    label: "Walter Russell 1926",
    authority: "historical model",
    claimClass: "historical cosmology",
    description: "Russell organized the elements inside a ten-octave rhythmic cosmology involving opposing phases, equilibrium, charging, and discharging. These claims are presented historically and are not treated as established atomic physics.",
    sourceLabel: "Library of Congress — The Universal One (1926)",
    sourceUrl: "https://www.loc.gov/resource/gdclccn.27004508/?sp=1&st=gallery",
  },
  nasa: {
    id: "nasa-nucleosynthesis",
    label: "NASA nucleosynthesis",
    authority: "modern astrophysics",
    claimClass: "origin model",
    description: "A simplified origin layer based on NASA's September 14, 2026 APOD. NASA describes the color-coded periodic table as humanity's best guess and notes that some elemental origins remain active research topics.",
    sourceLabel: "NASA APOD — Where Your Elements Came From (2026-09-14)",
    sourceUrl: "https://science.nasa.gov/image-article/apod-2026-september-14-where-your-elements-came-from/",
  },
};

export const NASA_ORIGIN_SEEDS = {
  1: {
    summary: "Primordial nucleosynthesis / Big Bang",
    confidence: "high-level NASA summary",
    note: "NASA states that the hydrogen in our bodies came from the Big Bang and that there are no other appreciable cosmic sources of hydrogen.",
  },
  6: {
    summary: "Stellar fusion",
    confidence: "high-level NASA summary",
    note: "NASA states that carbon was made by nuclear fusion in the interiors of stars.",
  },
  8: {
    summary: "Stellar fusion",
    confidence: "high-level NASA summary",
    note: "NASA states that oxygen, like carbon, was made by nuclear fusion in stars.",
  },
  26: {
    summary: "Supernova nucleosynthesis",
    confidence: "high-level NASA summary",
    note: "NASA states that much of the iron in our bodies was made during supernovas of long-dead stars.",
  },
  79: {
    summary: "Neutron-star collisions",
    confidence: "probabilistic NASA summary",
    note: "NASA says gold was likely made from neutron stars during collisions associated with events such as short gamma-ray bursts or gravitational-wave sources.",
  },
};

export const RUSSELL_ELEMENT_SEEDS = {
  6: {
    status: "primary-source statement",
    placementSummary: "Fifth-octave dividing point in Russell's ten-octave narrative",
    note: "In Chapter VI of The Universal One, Russell describes carbon as the dividing line of the cycle and as a turning point between his proposed contractive/generative and expansive/radiative halves.",
    sourceLabel: "The Universal One, Chapter VI",
    sourceUrl: "https://tile.loc.gov/storage-services/service/gdc/gdclccn/27/00/45/08/27004508/27004508.pdf",
  },
};

export const COMPARATIVE_RESEARCH_QUESTIONS = [
  "Does geometric proximity in a representation correlate with measured chemical similarity better than randomized placements?",
  "Which relationships are encoded by construction, and which appear only after measured properties are overlaid?",
  "Do apparent clusters survive controls for atomic number, period, group, and block?",
  "Where do historical Russell relationships agree with, diverge from, or remain incomparable to modern chemistry and astrophysics?",
  "Can a representation reveal useful structure without being treated as a causal theory of matter?",
];

export function getNasaOrigin(z) {
  return NASA_ORIGIN_SEEDS[z] || null;
}

export function getRussellSeed(z) {
  return RUSSELL_ELEMENT_SEEDS[z] || null;
}
