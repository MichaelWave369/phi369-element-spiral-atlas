import { DEG, GOLDEN_ANGLE } from "./atlasMath.js";

export function phiCoordinate(z, scale = 1, center = 0) {
  const safeZ = Number(z);
  if (!Number.isFinite(safeZ) || safeZ <= 0) return null;
  const theta = (safeZ * GOLDEN_ANGLE) % 360;
  const r = scale * Math.sqrt(safeZ);
  return {
    z: safeZ,
    theta,
    r,
    x: center + r * Math.cos((theta - 90) * DEG),
    y: center + r * Math.sin((theta - 90) * DEG),
  };
}

export function coordinateDistance(a, b) {
  if (!a || !b) return null;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function phiDistance(zA, zB) {
  return coordinateDistance(phiCoordinate(zA), phiCoordinate(zB));
}

export function nearestPhiNeighbors(elements, selectedZ, limit = 5) {
  const selected = phiCoordinate(selectedZ);
  if (!selected || !Array.isArray(elements)) return [];
  const safeLimit = Math.max(0, Math.trunc(limit));
  return elements
    .filter((entry) => Array.isArray(entry) && entry[0] !== selectedZ && entry[0] <= 118)
    .map((entry) => ({
      entry,
      distance: coordinateDistance(selected, phiCoordinate(entry[0])),
    }))
    .filter((item) => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance || a.entry[0] - b.entry[0])
    .slice(0, safeLimit);
}

export function periodicGroupPeers(elements, selectedZ) {
  if (!Array.isArray(elements)) return [];
  const selected = elements.find((entry) => Array.isArray(entry) && entry[0] === selectedZ);
  if (!selected) return [];
  const group = selected[5];
  if (!Number.isFinite(group)) return [];
  return elements
    .filter((entry) => Array.isArray(entry) && entry[0] <= 118 && entry[0] !== selectedZ && entry[5] === group)
    .sort((a, b) => a[0] - b[0]);
}

export const COMPARATIVE_EXPERIMENT_CONTRACT = Object.freeze({
  question: "Does proximity in a representation track measured chemical similarity better than chance?",
  phiDistance: "D_phi(i,j) = Euclidean distance between golden-angle coordinates derived from atomic number.",
  russellDistance: "D_russell(i,j) remains unavailable until primary-source chart positions are transcribed into machine-readable data.",
  chemicalSimilarity: "S_chem(i,j) must be computed from explicitly selected measured properties with missing values preserved.",
  nullModel: "Compare observed associations with shuffled element placements and controls for atomic number, period, group, and block.",
  authority: "A correlation is a result to investigate, not evidence that the representation is a causal theory of matter.",
});
