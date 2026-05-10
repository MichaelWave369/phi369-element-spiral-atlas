import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PHI,
  GOLDEN_ANGLE,
  DEG,
  FAMILY_COLORS,
  FAMILY_LABELS,
  BLOCK_COLORS,
  PROPERTY_PRESETS,
  VIEW_PRESETS,
  HARMONIC_FILTERS,
  RESONANCE_MODES,
  MAGIC_PROTONS,
  MAGIC_NEUTRONS,
  ISOTOPE_PRESETS,
  LAB_EXPERIMENTS,
  CORRELATION_PROPERTIES,
  COMPLETENESS_FIELDS,
} from "./data/atlasConstants.js";
import { ELEMENTS } from "./data/elementsBase.js";
import { EMPTY_ELEMENT_PROPERTIES, PROPERTY_SEEDS } from "./data/propertySeeds.js";
import { PROPERTY_FIELD_LABELS, PROPERTY_META } from "./data/propertyMeta.js";
import { runDataValidation } from "./data/dataValidation.js";

function cardStyle(extra = {}) {
  return {
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(217, 119, 6, 0.22)",
    borderRadius: 22,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.08)",
    ...extra,
  };
}

function buttonStyle(active = false) {
  return {
    appearance: "none",
    border: active ? "1px solid #111827" : "1px solid rgba(148, 163, 184, 0.65)",
    background: active ? "#111827" : "#ffffff",
    color: active ? "#ffffff" : "#111827",
    borderRadius: 999,
    padding: "7px 10px",
    fontSize: 12,
    cursor: "pointer",
  };
}

function detailsPanelStyle(extra = {}) {
  return {
    ...cardStyle({ padding: 16 }),
    overflow: "hidden",
    ...extra,
  };
}

const summaryStyle = {
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 16,
  listStyle: "none",
};

function digitalRoot(n) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return ((Math.trunc(n) - 1) % 9) + 1;
}

function sectorFromAngle(theta) {
  const a = ((theta % 360) + 360) % 360;
  if (a >= 90 && a < 210) return 1;
  if (a >= 210 && a < 330) return 2;
  return 3;
}

function bandFromZ(z) {
  if (z <= 2) return 1;
  if (z <= 10) return 2;
  if (z <= 18) return 3;
  if (z <= 36) return 4;
  if (z <= 54) return 5;
  return 6;
}

function getProps(z) {
  const props = PROPERTY_SEEDS[z] || {};
  const fallbackStable = z <= 82 ? true : z <= 118 ? false : null;
  return {
    ...EMPTY_ELEMENT_PROPERTIES,
    ...props,
    stable: props.stable ?? fallbackStable,
  };
}

function heatColor(value, min, max) {
  if (value === null || value === undefined || Number.isNaN(value) || !Number.isFinite(value)) return "#e5e7eb";
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max !== safeMin ? max : safeMin + 1;
  const t = Math.max(0, Math.min(1, (value - safeMin) / (safeMax - safeMin)));
  const hue = 220 - 180 * t;
  return `hsl(${hue}, 78%, 76%)`;
}

function colorFor(element, overlay) {
  if (!Array.isArray(element)) return FAMILY_COLORS.unknown;
  const [z, , , family = "unknown", period = 1, , block = "unknown"] = element;
  const safeOverlay = PROPERTY_PRESETS[overlay] ? overlay : "family";
  const props = getProps(z);
  const dr = digitalRoot(z);

  if (safeOverlay === "family") return FAMILY_COLORS[family] || FAMILY_COLORS.unknown;
  if (safeOverlay === "digitalRoot") {
    if (dr === 3) return "#c4b5fd";
    if (dr === 6) return "#93c5fd";
    if (dr === 9) return "#fbbf24";
    return "#e7e5e4";
  }
  if (safeOverlay === "period") {
    const shades = ["#fef3c7", "#dcfce7", "#dbeafe", "#ede9fe", "#fae8ff", "#ccfbf1", "#fee2e2", "#e5e7eb"];
    const index = Math.max(0, Math.min(shades.length - 1, Number(period || 1) - 1));
    return shades[index] || FAMILY_COLORS.unknown;
  }
  if (safeOverlay === "block") return BLOCK_COLORS[block] || BLOCK_COLORS.unknown;
  if (safeOverlay === "frontier") {
    if (z <= 82) return "#d1fae5";
    if (z <= 118) return "#fde68a";
    return "#e5e7eb";
  }
  if (safeOverlay === "stability") {
    if (props.stable === true) return "#bbf7d0";
    if (props.stable === false) return "#fecaca";
    return "#e5e7eb";
  }
  if (PROPERTY_META[safeOverlay]) {
    const meta = PROPERTY_META[safeOverlay];
    return heatColor(props[safeOverlay], meta.min, meta.max);
  }
  return FAMILY_COLORS[family] || FAMILY_COLORS.unknown;
}

function computeNodes(scale = 24, center = 380, viewMode = "seed") {
  const safeViewMode = VIEW_PRESETS[viewMode] ? viewMode : "seed";
  return ELEMENTS.map((entry) => {
    const [z, , , family, period, group] = entry;
    const goldenTheta = (z * GOLDEN_ANGLE) % 360;
    let theta = goldenTheta;
    let r = scale * Math.sqrt(z);
    let x = center + r * Math.cos((theta - 90) * DEG);
    let y = center + r * Math.sin((theta - 90) * DEG);

    if (safeViewMode === "ribbon") {
      theta = (z * 22.5) % 360;
      r = 34 + z * 2.55;
      x = center + r * Math.cos((theta - 90) * DEG);
      y = center + r * Math.sin((theta - 90) * DEG);
    }

    if (safeViewMode === "table") {
      const left = 55;
      const top = 55;
      const cellX = 36;
      const cellY = 62;
      let row = period;
      let col = Number.isFinite(group) ? group : 3;

      if (family === "lanthanide") {
        row = 8;
        col = z - 54;
      } else if (family === "actinide") {
        row = 9;
        col = z - 86;
      } else if (family === "future") {
        row = 10;
        col = z - 116;
      }

      x = left + (col - 1) * cellX;
      y = top + (row - 1) * cellY;
      theta = goldenTheta;
      r = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
    }

    return {
      raw: entry,
      z,
      theta,
      r,
      x,
      y,
      dr: digitalRoot(z),
      sector: sectorFromAngle(goldenTheta),
      band: bandFromZ(z),
      props: getProps(z),
    };
  });
}

function averageKnown(nodes, property, filterFn) {
  const values = nodes
    .filter(filterFn)
    .map((node) => node.props?.[property])
    .filter((value) => Number.isFinite(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildPatternScan(nodes) {
  const properties = ["atomicMass", "electronegativity", "ionization", "density"];
  const lines = [3, 6, 9];
  return properties.map((property) => {
    const meta = PROPERTY_META[property];
    const lineAverages = lines.map((line) => ({
      line,
      average: averageKnown(nodes, property, (node) => node.dr === line && node.z <= 118),
    }));
    const known = lineAverages.filter((item) => item.average !== null);
    const spread = known.length > 1 ? Math.max(...known.map((item) => item.average)) - Math.min(...known.map((item) => item.average)) : null;
    const normalizedSpread = spread !== null ? spread / Math.max(1, meta.max - meta.min) : null;
    let strength = "insufficient data";
    if (normalizedSpread !== null) {
      if (normalizedSpread < 0.08) strength = "weak difference";
      else if (normalizedSpread < 0.22) strength = "moderate difference";
      else strength = "strong difference";
    }
    return { property, label: meta.label, unit: meta.unit, lineAverages, strength };
  });
}

function buildOverlayStats(nodes, property) {
  const meta = PROPERTY_META[property];
  if (!meta) return null;
  const real = nodes.filter((node) => node.z <= 118);
  const known = real
    .map((node) => ({ node, value: node.props?.[property] }))
    .filter((item) => Number.isFinite(item.value));
  if (!known.length) return { property, label: meta.label, unit: meta.unit, count: 0, average: null, min: null, max: null };
  const values = known.map((item) => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  return {
    property,
    label: meta.label,
    unit: meta.unit,
    count: known.length,
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    min: known.find((item) => item.value === minValue),
    max: known.find((item) => item.value === maxValue),
  };
}

function buildFrontierCorridor(nodes) {
  const candidates = nodes.filter((node) => node.z >= 119);
  return candidates.map((node) => {
    const harmonicScore = [3, 6, 9].includes(node.dr) ? 3 : [1, 2, 4, 5, 7, 8].includes(node.dr) ? 1 : 0;
    const sectorScore = node.sector === 3 ? 2 : 1;
    const bandScore = node.band === 6 ? 1 : 0;
    const frontierScore = harmonicScore + sectorScore + bandScore;
    let label = "visual placeholder";
    if (frontierScore >= 6) label = "high visual-priority placeholder";
    else if (frontierScore >= 4) label = "medium visual-priority placeholder";
    return {
      z: node.z,
      symbol: node.raw[1],
      name: node.raw[2],
      digitalRoot: node.dr,
      sector: node.sector,
      band: node.band,
      frontierScore,
      label,
      note: "Geometry-only score; not an experimental prediction.",
    };
  });
}


function nearestMagic(value, magicNumbers) {
  const nearest = magicNumbers.reduce((best, candidate) => {
    const distance = Math.abs(candidate - value);
    return distance < best.distance ? { value: candidate, distance } : best;
  }, { value: magicNumbers[0], distance: Math.abs(magicNumbers[0] - value) });
  return nearest;
}

function parityLabel(z, n) {
  const zEven = z % 2 === 0;
  const nEven = n % 2 === 0;
  if (zEven && nEven) return "even-even";
  if (!zEven && !nEven) return "odd-odd";
  return zEven ? "even-odd" : "odd-even";
}

function scoreIsotopeCandidate(node, neutronNumber) {
  if (!node || !Number.isFinite(neutronNumber)) return null;
  const z = node.z;
  const n = Math.max(1, Math.round(neutronNumber));
  const a = z + n;
  const nearestProtonMagic = nearestMagic(z, MAGIC_PROTONS);
  const nearestNeutronMagic = nearestMagic(n, MAGIC_NEUTRONS);
  const islandDistance = Math.abs(n - 184) + Math.abs(z - 120) * 0.5;
  const parity = parityLabel(z, n);
  const parityBonus = parity === "even-even" ? 2 : parity === "odd-odd" ? -1 : 0.5;
  const magicBonus = Math.max(0, 4 - nearestProtonMagic.distance / 7) + Math.max(0, 5 - nearestNeutronMagic.distance / 10);
  const harmonicBonus = [3, 6, 9].includes(node.dr) ? 1 : 0;
  const islandBonus = Math.max(0, 4 - islandDistance / 18);
  const rawScore = magicBonus + parityBonus + harmonicBonus + islandBonus;
  const score = Math.max(0, Math.min(10, rawScore));
  let label = "low preview signal";
  if (score >= 7.5) label = "high preview signal";
  else if (score >= 5) label = "medium preview signal";
  return {
    z,
    symbol: node.raw[1],
    name: node.raw[2],
    n,
    a,
    nToZ: Number((n / z).toFixed(3)),
    parity,
    nearestProtonMagic,
    nearestNeutronMagic,
    islandDistance: Number(islandDistance.toFixed(2)),
    score: Number(score.toFixed(3)),
    label,
    note: "Educational heuristic only; not a nuclear-physics prediction or discovery claim.",
  };
}

function buildIsotopeRunway(nodes, neutronNumber) {
  return nodes
    .filter((node) => node.z >= 110 && node.z <= 120)
    .map((node) => scoreIsotopeCandidate(node, neutronNumber))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

function resonanceReason(selectedNode, node, mode, isotopeN) {
  if (!selectedNode || !node || selectedNode.z === node.z) return null;
  if (mode === "harmonic" && selectedNode.dr === node.dr) return `same digital root ${node.dr}`;
  if (mode === "family" && selectedNode.raw[3] === node.raw[3]) return `same family: ${FAMILY_LABELS[node.raw[3]] || node.raw[3]}`;
  if (mode === "period" && selectedNode.raw[4] === node.raw[4]) return `same period ${node.raw[4]}`;
  if (mode === "band" && selectedNode.band === node.band) return `same radial band ${node.band}`;
  if (mode === "isotope") {
    const selectedScore = scoreIsotopeCandidate(selectedNode, isotopeN);
    const nodeScore = scoreIsotopeCandidate(node, isotopeN);
    if (!selectedScore || !nodeScore) return null;
    const closeScore = Math.abs(selectedScore.score - nodeScore.score) <= 1.35;
    const closeIsland = Math.abs(selectedScore.islandDistance - nodeScore.islandDistance) <= 8;
    if (node.z >= 110 && node.z <= 120 && (closeScore || closeIsland)) return `near isotope-runway signal at N=${isotopeN}`;
  }
  return null;
}

function buildResonanceGraph(selectedNode, nodes, mode, isotopeN, limit = 14) {
  if (!selectedNode) return { mode, edges: [], summary: [] };
  const safeMode = RESONANCE_MODES[mode] ? mode : "harmonic";
  const edges = nodes
    .filter((node) => node.z <= 120 && node.z !== selectedNode.z)
    .map((node) => {
      const reason = resonanceReason(selectedNode, node, safeMode, isotopeN);
      if (!reason) return null;
      const atomicDistance = Math.abs(node.z - selectedNode.z);
      const rootBonus = node.dr === selectedNode.dr ? 2 : 0;
      const sectorBonus = node.sector === selectedNode.sector ? 1 : 0;
      const bandBonus = node.band === selectedNode.band ? 1 : 0;
      const familyBonus = node.raw[3] === selectedNode.raw[3] ? 2 : 0;
      const distanceScore = Math.max(0, 3 - atomicDistance / 24);
      const isotopeScore = safeMode === "isotope" ? (scoreIsotopeCandidate(node, isotopeN)?.score || 0) / 3 : 0;
      const score = rootBonus + sectorBonus + bandBonus + familyBonus + distanceScore + isotopeScore;
      return {
        from: selectedNode,
        to: node,
        reason,
        atomicDistance,
        score,
        sameRoot: node.dr === selectedNode.dr,
        sameSector: node.sector === selectedNode.sector,
        sameBand: node.band === selectedNode.band,
        sameFamily: node.raw[3] === selectedNode.raw[3],
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.atomicDistance - b.atomicDistance)
    .slice(0, limit);

  const summary = edges.slice(0, 6).map((edge) => ({
    z: edge.to.z,
    symbol: edge.to.raw[1],
    name: edge.to.raw[2],
    reason: edge.reason,
    score: Number(edge.score.toFixed(3)),
  }));

  return { mode: safeMode, edges, summary };
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function simpleHash(input) {
  const text = String(input);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function buildPropertyExtremes(nodes) {
  return Object.entries(PROPERTY_META).map(([property, meta]) => {
    const known = nodes
      .filter((node) => node.z <= 118)
      .map((node) => ({ node, value: node.props?.[property] }))
      .filter((item) => Number.isFinite(item.value))
      .sort((a, b) => a.value - b.value);
    const low = known[0] || null;
    const high = known[known.length - 1] || null;
    return {
      property,
      label: meta.label,
      unit: meta.unit,
      count: known.length,
      low: low ? { z: low.node.z, symbol: low.node.raw[1], name: low.node.raw[2], value: low.value } : null,
      high: high ? { z: high.node.z, symbol: high.node.raw[1], name: high.node.raw[2], value: high.value } : null,
    };
  });
}

function buildHarmonicPropertyMatrix(nodes) {
  const roots = Array.from({ length: 9 }, (_, index) => index + 1);
  return Object.entries(PROPERTY_META).map(([property, meta]) => {
    const rows = roots.map((root) => {
      const values = nodes
        .filter((node) => node.z <= 118 && node.dr === root)
        .map((node) => node.props?.[property])
        .filter((value) => Number.isFinite(value));
      const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
      return { root, count: values.length, average };
    });
    const known = rows.filter((row) => row.average !== null);
    const spread = known.length > 1 ? Math.max(...known.map((row) => row.average)) - Math.min(...known.map((row) => row.average)) : null;
    const strongestRoot = known.length ? known.reduce((best, row) => (best.average === null || row.average > best.average ? row : best), { root: null, count: 0, average: null }) : null;
    const weakestRoot = known.length ? known.reduce((best, row) => (best.average === null || row.average < best.average ? row : best), { root: null, count: 0, average: null }) : null;
    return {
      property,
      label: meta.label,
      unit: meta.unit,
      rows,
      spread,
      normalizedSpread: spread === null ? null : spread / Math.max(1, meta.max - meta.min),
      strongestRoot,
      weakestRoot,
    };
  }).sort((a, b) => (b.normalizedSpread || 0) - (a.normalizedSpread || 0));
}

function buildSelectedInsightTags(selectedNode, resonanceGraph, isotopeCandidate) {
  if (!selectedNode) return [];
  const tags = [];
  const [z, symbol, , family] = selectedNode.raw;
  if ([3, 6, 9].includes(selectedNode.dr)) tags.push(`PHI369 harmonic root ${selectedNode.dr}`);
  if (z >= 104 && z <= 118) tags.push("confirmed superheavy zone");
  if (z >= 119) tags.push("future / unconfirmed ghost node");
  if (selectedNode.props?.stable === false) tags.push("radioactive/frontier seed");
  if (family === "noble") tags.push("noble-gas closure family");
  if (family === "lanthanide" || family === "actinide") tags.push(`${FAMILY_LABELS[family]} f-block corridor`);
  if (Number.isFinite(selectedNode.props?.density) && selectedNode.props.density >= 10) tags.push("high-density seeded material");
  if (Number.isFinite(selectedNode.props?.electronegativity) && selectedNode.props.electronegativity >= 3) tags.push("high-electronegativity seed");
  if (resonanceGraph?.edges?.length) tags.push(`${resonanceGraph.edges.length} active resonance links`);
  if (isotopeCandidate?.score >= 7.5) tags.push("high isotope-preview signal");
  if (!tags.length) tags.push(`${symbol}${z} has sparse seeded insight data`);
  return tags;
}


function scaleForViewMode(viewMode) {
  // v2.0.1 visual balance:
  // seed view uses a larger radius scale so the public demo fills the atlas card;
  // ribbon/table preserve earlier spacing for readability.
  if (viewMode === "seed") return 34;
  if (viewMode === "ribbon") return 26;
  return 26;
}

function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window === "undefined" ? 1440 : window.innerWidth));
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

function buildAtlasReceipt({ selectedNode, viewMode, overlay, harmonicFilter, resonanceMode, isotopeN, showResonance, insightEngine }) {
  const payload = {
    version: "2.0",
    selectedZ: selectedNode?.z || null,
    symbol: selectedNode?.raw?.[1] || null,
    viewMode,
    overlay,
    harmonicFilter,
    resonanceMode,
    isotopeN,
    showResonance,
    topInsight: insightEngine?.topHarmonicSpread?.property || null,
    edgeCount: insightEngine?.edgeCount || 0,
  };
  const hash = simpleHash(stableStringify(payload));
  return {
    id: `esa_v1_6_${hash}`,
    schema: "phi369.element_spiral_atlas.receipt.v1",
    createdBy: "PHI369 Element Spiral Atlas",
    payload,
    claim: "Interface receipt only; not an experimental chemistry or nuclear-physics claim.",
  };
}

function buildInsightEngine({ nodes, selectedNode, resonanceGraph, isotopeCandidate }) {
  const propertyExtremes = buildPropertyExtremes(nodes);
  const harmonicMatrix = buildHarmonicPropertyMatrix(nodes);
  const topHarmonicSpread = harmonicMatrix[0] || null;
  const selectedTags = buildSelectedInsightTags(selectedNode, resonanceGraph, isotopeCandidate);
  const edgeCount = resonanceGraph?.edges?.length || 0;
  const selectedPropertyCoverage = Object.keys(PROPERTY_META).filter((property) => Number.isFinite(selectedNode?.props?.[property])).length;
  return {
    selectedTags,
    propertyExtremes,
    harmonicMatrix,
    topHarmonicSpread,
    edgeCount,
    selectedPropertyCoverage,
  };
}

function buildResearchPrompts({ selectedNode, comparison, insightEngine, isotopeCandidate, resonanceGraph }) {
  const [z, symbol, name, family] = selectedNode?.raw || [];
  const prompts = [];
  if (!selectedNode) return prompts;

  prompts.push({
    type: "selected-node",
    title: `Profile ${symbol}${z} in the atlas`,
    prompt: `Review ${name} (${symbol}, Z=${z}) across chemical family, PHI369 root ${selectedNode.dr}, sector ${selectedNode.sector}, and seeded numeric overlays. Separate confirmed chemistry from visualization-only structure.`,
  });

  if (insightEngine?.topHarmonicSpread) {
    const spread = insightEngine.topHarmonicSpread;
    prompts.push({
      type: "harmonic-matrix",
      title: `Audit ${spread.label} harmonic spread`,
      prompt: `Check whether the observed ${spread.label} spread across digital-root families remains after replacing seed data with a complete curated dataset. Treat the current signal as provisional until coverage is high.`,
    });
  }

  if (resonanceGraph?.summary?.length) {
    const first = resonanceGraph.summary[0];
    prompts.push({
      type: "resonance-graph",
      title: `Explain ${symbol}${z} ↔ ${first.symbol}${first.z}`,
      prompt: `Investigate the resonance link between ${symbol}${z} and ${first.symbol}${first.z}. Compare the graph reason (${first.reason}) with real periodic trends, electron configuration, and known physical properties.`,
    });
  }

  if (isotopeCandidate && isotopeCandidate.z >= 104) {
    prompts.push({
      type: "isotope-frontier",
      title: `Superheavy isotope preview for ${symbol}-${isotopeCandidate.a}`,
      prompt: `Use the isotope preview for ${symbol}-${isotopeCandidate.a} as a heuristic starting point only. Compare Z=${isotopeCandidate.z}, N=${isotopeCandidate.n}, N/Z=${isotopeCandidate.nToZ}, and magic-number proximity against real nuclear-shell literature before making any claim.`,
    });
  }

  if (comparison) {
    prompts.push({
      type: "comparison",
      title: `Compare ${comparison.selected.raw[1]}${comparison.selected.z} with ${comparison.compare.raw[1]}${comparison.compare.z}`,
      prompt: `Compare ${comparison.selected.raw[2]} and ${comparison.compare.raw[2]} using both standard chemistry and atlas coordinates. Look for property deltas that are explained by normal periodic trends before attributing anything to PHI369 geometry.`,
    });
  }

  if (family === "future") {
    prompts.push({
      type: "claim-discipline",
      title: "Future-node boundary check",
      prompt: `Because ${symbol}${z} is future/unconfirmed, keep it labeled as a ghost node. Do not phrase atlas geometry as evidence for existence; use it only as a visualization and hypothesis organizer.`,
    });
  }

  return prompts.slice(0, 6);
}

function buildResearchSnapshot({ atlasReceipt, selectedNode, overlay, viewMode, harmonicFilter, isotopeN, resonanceMode, insightEngine, note }) {
  const [z, symbol, name, family] = selectedNode?.raw || [];
  const payload = {
    receiptId: atlasReceipt?.id || null,
    selectedZ: z || null,
    symbol: symbol || null,
    name: name || null,
    family: family || null,
    overlay,
    viewMode,
    harmonicFilter,
    isotopeN,
    resonanceMode,
    topInsight: insightEngine?.topHarmonicSpread?.property || null,
    selectedTags: insightEngine?.selectedTags || [],
    note: note || "",
  };
  return {
    id: `note_${simpleHash(stableStringify(payload))}`,
    schema: "phi369.element_spiral_atlas.research_snapshot.v1",
    createdAt: new Date().toISOString(),
    payload,
  };
}

function buildSnapshotDelta(current, previous) {
  if (!current || !previous) return null;
  const a = current.payload || {};
  const b = previous.payload || {};
  return {
    selectedChanged: a.selectedZ !== b.selectedZ,
    overlayChanged: a.overlay !== b.overlay,
    viewChanged: a.viewMode !== b.viewMode,
    harmonicChanged: a.harmonicFilter !== b.harmonicFilter,
    isotopeChanged: a.isotopeN !== b.isotopeN,
    resonanceChanged: a.resonanceMode !== b.resonanceMode,
    from: { selectedZ: b.selectedZ, symbol: b.symbol, overlay: b.overlay, viewMode: b.viewMode },
    to: { selectedZ: a.selectedZ, symbol: a.symbol, overlay: a.overlay, viewMode: a.viewMode },
  };
}

function buildCorrelationStudy(nodes, xProperty, yProperty) {
  const xMeta = PROPERTY_META[xProperty];
  const yMeta = PROPERTY_META[yProperty];
  if (!xMeta || !yMeta) {
    return { xProperty, yProperty, count: 0, correlation: null, pairs: [], interpretation: "Choose two numeric overlays." };
  }

  const pairs = nodes
    .filter((node) => node.z <= 118)
    .map((node) => ({
      node,
      x: node.props?.[xProperty],
      y: node.props?.[yProperty],
    }))
    .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y));

  if (pairs.length < 3) {
    return { xProperty, yProperty, count: pairs.length, correlation: null, pairs, interpretation: "Insufficient seeded overlap for correlation." };
  }

  const meanX = pairs.reduce((sum, item) => sum + item.x, 0) / pairs.length;
  const meanY = pairs.reduce((sum, item) => sum + item.y, 0) / pairs.length;
  const numerator = pairs.reduce((sum, item) => sum + (item.x - meanX) * (item.y - meanY), 0);
  const denomX = Math.sqrt(pairs.reduce((sum, item) => sum + (item.x - meanX) ** 2, 0));
  const denomY = Math.sqrt(pairs.reduce((sum, item) => sum + (item.y - meanY) ** 2, 0));
  const correlation = denomX && denomY ? numerator / (denomX * denomY) : null;
  const abs = Math.abs(correlation ?? 0);
  let interpretation = "weak / provisional";
  if (correlation === null) interpretation = "insufficient variance";
  else if (abs >= 0.75) interpretation = correlation > 0 ? "strong positive provisional" : "strong negative provisional";
  else if (abs >= 0.4) interpretation = correlation > 0 ? "moderate positive provisional" : "moderate negative provisional";

  return {
    xProperty,
    yProperty,
    xLabel: xMeta.label,
    yLabel: yMeta.label,
    count: pairs.length,
    correlation,
    interpretation,
    pairs: pairs.slice(0, 28).map((item) => ({
      z: item.node.z,
      symbol: item.node.raw[1],
      name: item.node.raw[2],
      x: item.x,
      y: item.y,
      root: item.node.dr,
    })),
  };
}

function buildExperimentPlan({ labExperiment, selectedNode, overlay, viewMode, harmonicFilter, resonanceMode, isotopeN, correlationStudy, insightEngine }) {
  const [z, symbol, name] = selectedNode?.raw || [];
  const base = {
    experiment: labExperiment,
    label: LAB_EXPERIMENTS[labExperiment] || "Custom experiment",
    selected: selectedNode ? `${symbol}${z} ${name}` : "none",
    state: { overlay, viewMode, harmonicFilter, resonanceMode, isotopeN },
    receiptId: `lab_${simpleHash(stableStringify({ labExperiment, z, overlay, viewMode, harmonicFilter, resonanceMode, isotopeN }))}`,
    claimBoundary: "Visualization and hypothesis organization only; confirm all scientific claims against curated chemistry/nuclear data.",
  };

  if (labExperiment === "correlationStudy") {
    return {
      ...base,
      objective: `Measure provisional relation between ${correlationStudy.xLabel || correlationStudy.xProperty} and ${correlationStudy.yLabel || correlationStudy.yProperty}.`,
      steps: ["Confirm data coverage", "Inspect correlation sign and strength", "Look for periodic-table explanations", "Record whether PHI369 grouping adds useful visualization only"],
      resultHint: correlationStudy.correlation === null ? "Need more overlapping data." : `r = ${correlationStudy.correlation.toFixed(3)} (${correlationStudy.interpretation})`,
    };
  }

  if (labExperiment === "frontierRunway") {
    return {
      ...base,
      objective: `Review the superheavy runway at N=${isotopeN}.`,
      steps: ["Rank 110–120 by heuristic score", "Check magic-number proximity", "Keep 119/120 ghost-labeled", "Do not infer discovery from geometry"],
      resultHint: `Selected isotope preview: ${symbol}-${z + isotopeN}.`,
    };
  }

  if (labExperiment === "resonanceTrace") {
    return {
      ...base,
      objective: `Trace ${symbol}${z} relationship links using ${RESONANCE_MODES[resonanceMode] || resonanceMode}.`,
      steps: ["Review graph edges", "Separate visual affinity from physical similarity", "Compare against seeded property deltas", "Save a snapshot if the relation is useful"],
      resultHint: `${insightEngine?.edgeCount || 0} active resonance edges.`,
    };
  }

  if (labExperiment === "claimDiscipline") {
    return {
      ...base,
      objective: "Audit the current state for overclaim risk.",
      steps: ["Label ghost nodes as unconfirmed", "Treat seeded data as incomplete", "Distinguish PHI369 coordinates from chemical causation", "Write conclusions as hypotheses or visual observations"],
      resultHint: base.claimBoundary,
    };
  }

  return {
    ...base,
    objective: `Audit harmonic behavior for ${symbol}${z} using current overlays.`,
    steps: ["Check data completeness", "Inspect harmonic root family", "Compare pattern scanner output", "Capture a notebook snapshot", "Export JSON receipt"],
    resultHint: insightEngine?.topHarmonicSpread ? `Strongest provisional split: ${insightEngine.topHarmonicSpread.label}` : "No harmonic split available yet.",
  };
}

function buildLabReportMarkdown({ experimentPlan, correlationStudy, atlasReceipt, selectedNode, researchNotebook }) {
  const [z, symbol, name] = selectedNode?.raw || [];
  return [
    `# PHI369 Element Spiral Atlas v2.0 Lab Report`,
    ``,
    `## Active Element`,
    `- ${symbol || "—"}${z || ""} — ${name || "—"}`,
    ``,
    `## Experiment`,
    `- ${experimentPlan?.label || "—"}`,
    `- Receipt: ${experimentPlan?.receiptId || "—"}`,
    `- Objective: ${experimentPlan?.objective || "—"}`,
    `- Result hint: ${experimentPlan?.resultHint || "—"}`,
    ``,
    `## Protocol Steps`,
    ...(experimentPlan?.steps || []).map((step, index) => `${index + 1}. ${step}`),
    ``,
    `## Correlation Study`,
    `- ${correlationStudy?.xLabel || correlationStudy?.xProperty || "—"} × ${correlationStudy?.yLabel || correlationStudy?.yProperty || "—"}`,
    `- Count: ${correlationStudy?.count ?? 0}`,
    `- r: ${correlationStudy?.correlation === null || correlationStudy?.correlation === undefined ? "—" : correlationStudy.correlation.toFixed(3)}`,
    `- Interpretation: ${correlationStudy?.interpretation || "—"}`,
    ``,
    `## Claim Boundary`,
    `${experimentPlan?.claimBoundary || "Visualization only; verify externally before making scientific claims."}`,
    ``,
    `## Atlas Receipt`,
    `- ${atlasReceipt?.id || "—"}`,
    ``,
    `## Notebook Snapshots`,
    `- ${researchNotebook?.length || 0} saved snapshot(s)`,
  ].join("\n");
}

function copyToClipboard(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
  }
}

function normalizedPropertyDistance(aValue, bValue, meta) {
  if (!Number.isFinite(aValue) || !Number.isFinite(bValue) || !meta) return null;
  const span = Math.max(1, meta.max - meta.min);
  return Math.abs(aValue - bValue) / span;
}

function buildSimilarityScan(selectedNode, nodes) {
  if (!selectedNode) return [];
  const realNodes = nodes.filter((node) => node.z <= 118 && node.z !== selectedNode.z);
  const properties = Object.keys(PROPERTY_META);
  return realNodes
    .map((node) => {
      const distances = properties
        .map((property) => normalizedPropertyDistance(selectedNode.props?.[property], node.props?.[property], PROPERTY_META[property]))
        .filter((value) => Number.isFinite(value));
      if (!distances.length) return null;
      const avgDistance = distances.reduce((sum, value) => sum + value, 0) / distances.length;
      const sameFamilyBonus = selectedNode.raw[3] === node.raw[3] ? 0.08 : 0;
      const sameRootBonus = selectedNode.dr === node.dr ? 0.05 : 0;
      const score = Math.max(0, 1 - avgDistance + sameFamilyBonus + sameRootBonus);
      return {
        node,
        score,
        comparedFields: distances.length,
        sameFamily: selectedNode.raw[3] === node.raw[3],
        sameRoot: selectedNode.dr === node.dr,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function buildComparison(selectedNode, compareNode) {
  if (!selectedNode || !compareNode) return null;
  const properties = Object.keys(PROPERTY_META).map((property) => {
    const meta = PROPERTY_META[property];
    const a = selectedNode.props?.[property];
    const b = compareNode.props?.[property];
    const delta = Number.isFinite(a) && Number.isFinite(b) ? b - a : null;
    return { property, label: meta.label, unit: meta.unit, selected: a ?? null, compare: b ?? null, delta };
  });
  return {
    selected: selectedNode,
    compare: compareNode,
    properties,
    phi369: {
      digitalRootDelta: compareNode.dr - selectedNode.dr,
      sameRoot: compareNode.dr === selectedNode.dr,
      sameSector: compareNode.sector === selectedNode.sector,
      sameBand: compareNode.band === selectedNode.band,
      atomicDistance: compareNode.z - selectedNode.z,
    },
  };
}

function buildHarmonicSummary(nodes, harmonicFilter) {
  const realNodes = nodes.filter((node) => node.z <= 118);
  const groups = Array.from({ length: 9 }, (_, index) => index + 1).map((root) => {
    const members = realNodes.filter((node) => node.dr === root);
    const stableCount = members.filter((node) => node.props?.stable === true).length;
    return {
      root,
      count: members.length,
      stableCount,
      sample: members.slice(0, 6).map((node) => `${node.raw[1]}${node.z}`),
      active: harmonicFilter === "all" || Number(harmonicFilter) === root,
    };
  });
  return groups;
}

function formatProp(value, unit = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value}${unit ? ` ${unit}` : ""}`;
}

function formatYear(year) {
  if (year === null || year === undefined) return "—";
  return year < 0 ? `${Math.abs(year)} BCE` : String(year);
}


function isFilled(value) {
  return value !== null && value !== undefined && value !== "";
}

function buildCompletenessReport(nodes) {
  const realNodes = nodes.filter((node) => node.z <= 118);
  return COMPLETENESS_FIELDS.map((field) => {
    const filled = realNodes.filter((node) => isFilled(node.props?.[field.key])).length;
    const total = realNodes.length || 1;
    return {
      ...field,
      filled,
      total,
      pct: Math.round((filled / total) * 100),
    };
  });
}

function downloadBlob(blob, filename) {
  if (typeof document === "undefined" || typeof URL === "undefined") return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportJson(data, filename = "phi369-element-spiral-atlas-v1-view.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, filename);
}

function exportSvg(svgEl, filename = "phi369-element-spiral-atlas-v1.svg") {
  if (!svgEl) return;
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const source = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
}

function exportPng(svgEl, filename = "phi369-element-spiral-atlas-v1.png") {
  if (!svgEl) return;
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const source = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const viewBox = svgEl.viewBox.baseVal;
    const width = viewBox?.width || 760;
    const height = viewBox?.height || 760;
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      return;
    }
    ctx.fillStyle = "#fffaf0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob((pngBlob) => {
      if (pngBlob) downloadBlob(pngBlob, filename);
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

runDataValidation({
  elements: ELEMENTS,
  familyColors: FAMILY_COLORS,
  blockColors: BLOCK_COLORS,
  propertyPresets: PROPERTY_PRESETS,
  viewPresets: VIEW_PRESETS,
  harmonicFilters: HARMONIC_FILTERS,
  resonanceModes: RESONANCE_MODES,
  propertyMeta: PROPERTY_META,
  propertySeeds: PROPERTY_SEEDS,
  emptyElementProperties: EMPTY_ELEMENT_PROPERTIES,
  completenessFields: COMPLETENESS_FIELDS,
  digitalRoot,
});

function SpiralGuides({ center, maxR, show369 }) {
  const bands = [1, 2, 3, 4, 5, 6].map((i) => (maxR / 6) * i);
  const sectorAngles = [90, 210, 330];
  const nodeAngles = Array.from({ length: 8 }, (_, i) => 90 + i * 45);

  return (
    <g>
      {bands.map((r) => (
        <circle key={`band-${r}`} cx={center} cy={center} r={r} fill="none" stroke="#d6a642" strokeDasharray="4 6" strokeOpacity="0.38" />
      ))}
      {sectorAngles.map((a) => (
        <line key={`sector-${a}`} x1={center} y1={center} x2={center + maxR * Math.cos((a - 90) * DEG)} y2={center + maxR * Math.sin((a - 90) * DEG)} stroke="#b45309" strokeDasharray="5 7" strokeOpacity="0.45" />
      ))}
      {show369 && nodeAngles.map((a, i) => {
        const x = center + (maxR + 14) * Math.cos((a - 90) * DEG);
        const y = center + (maxR + 14) * Math.sin((a - 90) * DEG);
        return (
          <g key={`node-${a}`}>
            <circle cx={x} cy={y} r="13" fill="#a16207" stroke="#fef3c7" strokeWidth="2" />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fill="white" fontWeight="700">{i + 1}</text>
          </g>
        );
      })}
      {show369 && (
        <g>
          <circle cx={center} cy={center} r="15" fill="#a16207" stroke="#fef3c7" strokeWidth="2" />
          <text x={center} y={center + 5} textAnchor="middle" fontSize="14" fill="white" fontWeight="800">9</text>
        </g>
      )}
      <text x={center} y={center - maxR - 35} textAnchor="middle" fontSize="16" fill="#92400e">90°</text>
      <text x={center - maxR - 42} y={center + 6} textAnchor="middle" fontSize="16" fill="#1d4ed8">210°</text>
      <text x={center} y={center + maxR + 48} textAnchor="middle" fontSize="16" fill="#1d4ed8">270°</text>
      <text x={center + maxR + 48} y={center + 6} textAnchor="middle" fontSize="16" fill="#92400e">330°</text>
    </g>
  );
}

function LegendSwatch({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 12, height: 12, borderRadius: 3, border: "1px solid #cbd5e1", background: color }} />
      <span>{label}</span>
    </div>
  );
}

function Legend({ overlay }) {
  if (overlay === "family") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
        {Object.entries(FAMILY_LABELS).filter(([key]) => key !== "unknown").map(([key, label]) => (
          <LegendSwatch key={key} color={FAMILY_COLORS[key] || FAMILY_COLORS.unknown} label={label} />
        ))}
      </div>
    );
  }

  if (overlay === "digitalRoot") {
    return (
      <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
        <div><b style={{ background: "#c4b5fd", borderRadius: 999, padding: "2px 7px" }}>3-line</b> Digital root 3: 3, 12, 21, 30…</div>
        <div><b style={{ background: "#93c5fd", borderRadius: 999, padding: "2px 7px" }}>6-line</b> Digital root 6: 6, 15, 24, 33…</div>
        <div><b style={{ background: "#fbbf24", borderRadius: 999, padding: "2px 7px" }}>9-line</b> Digital root 9: 9, 18, 27, 36…</div>
        <div style={{ color: "#64748b" }}>Other residues remain muted for comparison.</div>
      </div>
    );
  }

  if (overlay === "stability") {
    return (
      <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
        <LegendSwatch color="#bbf7d0" label="Stable / long-lived seed classification" />
        <LegendSwatch color="#fecaca" label="Radioactive / synthetic frontier" />
        <LegendSwatch color="#e5e7eb" label="Unknown / future placeholder" />
      </div>
    );
  }

  if (PROPERTY_META[overlay]) {
    const meta = PROPERTY_META[overlay];
    return (
      <div style={{ display: "grid", gap: 8, fontSize: 12, color: "#334155" }}>
        <div style={{ fontWeight: 700 }}>{meta.label} heatmap ({meta.unit})</div>
        <div style={{ height: 12, borderRadius: 999, background: "linear-gradient(90deg, #93c5fd, #86efac, #fbbf24)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>low</span><span>seeded values</span><span>high</span></div>
        <div>Gray means the property is not filled in yet.</div>
      </div>
    );
  }

  return <div style={{ fontSize: 12, color: "#475569" }}>Current overlay: {PROPERTY_PRESETS[overlay] || "Unknown overlay"}.</div>;
}


function CompletenessPanel({ report }) {
  return (
    <div style={{ display: "grid", gap: 9 }}>
      {report.map((item) => (
        <div key={item.key} style={{ display: "grid", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
            <span>{item.label}</span>
            <span style={{ color: "#64748b" }}>{item.filled}/{item.total} ({item.pct}%)</span>
          </div>
          <div style={{ height: 9, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                width: `${item.pct}%`,
                height: "100%",
                background: item.pct >= 90 ? "#22c55e" : item.pct >= 50 ? "#f59e0b" : "#94a3b8",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ExportPanel({ svgRef, payload }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button style={buttonStyle(false)} onClick={() => exportSvg(svgRef.current)}>Export SVG</button>
      <button style={buttonStyle(false)} onClick={() => exportPng(svgRef.current)}>Export PNG</button>
      <button style={buttonStyle(false)} onClick={() => exportJson(payload)}>Export JSON</button>
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 10, padding: 8, gridColumn: wide ? "1 / -1" : undefined }}>
      <b>{label}</b><br />{children}
    </div>
  );
}

export default function ElementSpiralAtlas() {
  const [overlay, setOverlay] = useState("family");
  const [viewMode, setViewMode] = useState("seed");
  const [harmonicFilter, setHarmonicFilter] = useState("all");
  const [show369, setShow369] = useState(true);
  const [showFuture, setShowFuture] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedZ, setSelectedZ] = useState(1);
  const [compareZ, setCompareZ] = useState(26);
  const [isotopeN, setIsotopeN] = useState(184);
  const [resonanceMode, setResonanceMode] = useState("harmonic");
  const [showResonance, setShowResonance] = useState(true);
  const [researchNotebook, setResearchNotebook] = useState([]);
  const [researchNote, setResearchNote] = useState("");
  const [labExperiment, setLabExperiment] = useState("harmonicAudit");
  const [xProperty, setXProperty] = useState("atomicMass");
  const [yProperty, setYProperty] = useState("ionization");
  const [labLog, setLabLog] = useState([]);
  const svgRef = useRef(null);

  const center = 380;
  const maxR = 290;

  const viewportWidth = useViewportWidth();
  const isCompact = viewportWidth < 1180;
  const nodeScale = scaleForViewMode(viewMode);
  const nodes = useMemo(() => computeNodes(nodeScale, center, viewMode), [center, nodeScale, viewMode]);
  const selectedNode = useMemo(() => nodes.find((node) => node.z === selectedZ) || nodes[0], [nodes, selectedZ]);
  const compareNode = useMemo(() => nodes.find((node) => node.z === compareZ) || nodes.find((node) => node.z === 26) || nodes[0], [nodes, compareZ]);
  const visibleNodes = useMemo(() => nodes.filter((node) => showFuture || node.z <= 118), [nodes, showFuture]);
  const patternScan = useMemo(() => buildPatternScan(nodes), [nodes]);
  const activePropertyStats = useMemo(() => buildOverlayStats(nodes, overlay), [nodes, overlay]);
  const frontierCorridor = useMemo(() => buildFrontierCorridor(nodes), [nodes]);
  const completenessReport = useMemo(() => buildCompletenessReport(nodes), [nodes]);
  const similarityScan = useMemo(() => buildSimilarityScan(selectedNode, nodes), [selectedNode, nodes]);
  const comparison = useMemo(() => buildComparison(selectedNode, compareNode), [selectedNode, compareNode]);
  const harmonicSummary = useMemo(() => buildHarmonicSummary(nodes, harmonicFilter), [nodes, harmonicFilter]);
  const isotopeCandidate = useMemo(() => scoreIsotopeCandidate(selectedNode, isotopeN), [selectedNode, isotopeN]);
  const isotopeRunway = useMemo(() => buildIsotopeRunway(nodes, isotopeN), [nodes, isotopeN]);
  const resonanceGraph = useMemo(() => buildResonanceGraph(selectedNode, visibleNodes, resonanceMode, isotopeN), [selectedNode, visibleNodes, resonanceMode, isotopeN]);
  const insightEngine = useMemo(() => buildInsightEngine({ nodes, selectedNode, resonanceGraph, isotopeCandidate }), [nodes, selectedNode, resonanceGraph, isotopeCandidate]);
  const atlasReceipt = useMemo(() => buildAtlasReceipt({ selectedNode, viewMode, overlay, harmonicFilter, resonanceMode, isotopeN, showResonance, insightEngine }), [selectedNode, viewMode, overlay, harmonicFilter, resonanceMode, isotopeN, showResonance, insightEngine]);
  const researchPrompts = useMemo(() => buildResearchPrompts({ selectedNode, comparison, insightEngine, isotopeCandidate, resonanceGraph }), [selectedNode, comparison, insightEngine, isotopeCandidate, resonanceGraph]);
  const currentSnapshot = useMemo(() => buildResearchSnapshot({ atlasReceipt, selectedNode, overlay, viewMode, harmonicFilter, isotopeN, resonanceMode, insightEngine, note: researchNote }), [atlasReceipt, selectedNode, overlay, viewMode, harmonicFilter, isotopeN, resonanceMode, insightEngine, researchNote]);
  const snapshotDelta = useMemo(() => buildSnapshotDelta(currentSnapshot, researchNotebook[0]), [currentSnapshot, researchNotebook]);
  const correlationStudy = useMemo(() => buildCorrelationStudy(nodes, xProperty, yProperty), [nodes, xProperty, yProperty]);
  const experimentPlan = useMemo(() => buildExperimentPlan({ labExperiment, selectedNode, overlay, viewMode, harmonicFilter, resonanceMode, isotopeN, correlationStudy, insightEngine }), [labExperiment, selectedNode, overlay, viewMode, harmonicFilter, resonanceMode, isotopeN, correlationStudy, insightEngine]);
  const labReportMarkdown = useMemo(() => buildLabReportMarkdown({ experimentPlan, correlationStudy, atlasReceipt, selectedNode, researchNotebook }), [experimentPlan, correlationStudy, atlasReceipt, selectedNode, researchNotebook]);

  function captureResearchSnapshot() {
    const next = buildResearchSnapshot({ atlasReceipt, selectedNode, overlay, viewMode, harmonicFilter, isotopeN, resonanceMode, insightEngine, note: researchNote });
    setResearchNotebook((items) => [next, ...items.filter((item) => item.id !== next.id)].slice(0, 12));
  }

  function captureLabRun() {
    const entry = {
      id: experimentPlan?.receiptId || `lab_${Date.now()}`,
      createdAt: new Date().toISOString(),
      experimentPlan,
      correlationStudy: { ...correlationStudy, pairs: correlationStudy.pairs?.slice(0, 12) || [] },
      selectedZ,
      overlay,
      viewMode,
    };
    setLabLog((items) => [entry, ...items.filter((item) => item.id !== entry.id)].slice(0, 10));
  }

  const searchMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return visibleNodes.filter((node) => {
      const [z, symbol, name] = node.raw;
      return String(z) === q || symbol.toLowerCase().includes(q) || name.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [query, visibleNodes]);

  const [z, symbol, name, family, period, group, block] = selectedNode.raw;
  const selectedProps = selectedNode.props;
  const exportPayload = useMemo(() => ({
    version: "2.0",
    app: "PHI369 Element Spiral Atlas",
    viewMode,
    overlay,
    harmonicFilter,
    show369,
    showFuture,
    selectedZ,
    compareZ,
    isotopeN,
    isotopeCandidate,
    isotopeRunway,
    selectedElement: { z, symbol, name, family, period, group, block, props: selectedProps, phi369: { digitalRoot: selectedNode.dr, sector: selectedNode.sector, band: selectedNode.band, theta: selectedNode.theta } },
    completeness: completenessReport,
    patternScan,
    activePropertyStats,
    frontierCorridor,
    similarityScan: similarityScan.map((item) => ({ z: item.node.z, symbol: item.node.raw[1], name: item.node.raw[2], score: Number(item.score.toFixed(4)), comparedFields: item.comparedFields, sameFamily: item.sameFamily, sameRoot: item.sameRoot })),
    comparison: comparison ? {
      selectedZ: comparison.selected.z,
      compareZ: comparison.compare.z,
      phi369: comparison.phi369,
      properties: comparison.properties,
    } : null,
    harmonicSummary,
    researchPrompts,
    researchNotebook,
    currentSnapshot,
    snapshotDelta,
    v2Lab: {
      labExperiment,
      xProperty,
      yProperty,
      correlationStudy,
      experimentPlan,
      labLog,
      labReportMarkdown,
    },
    nodes: visibleNodes.map((node) => ({
      z: node.z, symbol: node.raw[1], name: node.raw[2], family: node.raw[3], period: node.raw[4], group: node.raw[5], block: node.raw[6],
      x: Number(node.x.toFixed(3)), y: Number(node.y.toFixed(3)), theta: Number(node.theta.toFixed(3)), r: Number(node.r.toFixed(3)),
      digitalRoot: node.dr, sector: node.sector, band: node.band, props: node.props,
    })),
  }), [viewMode, overlay, harmonicFilter, show369, showFuture, selectedZ, compareZ, z, symbol, name, family, period, group, block, selectedProps, selectedNode, completenessReport, visibleNodes, patternScan, activePropertyStats, frontierCorridor, similarityScan, comparison, harmonicSummary, isotopeN, isotopeCandidate, isotopeRunway, resonanceMode, showResonance, resonanceGraph, insightEngine, atlasReceipt, researchPrompts, researchNotebook, currentSnapshot, snapshotDelta, labExperiment, xProperty, yProperty, correlationStudy, experimentPlan, labLog, labReportMarkdown]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f1df", color: "#0f172a", padding: 16, fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, color: "#b45309" }}>
            <span>✦</span><span style={{ letterSpacing: "0.35em", textTransform: "uppercase", fontSize: 13 }}>PHI369 Labs v2.2</span><span>✦</span>
          </div>
          <h1 style={{ margin: "8px 0 0", fontFamily: "Georgia, ui-serif, serif", fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 650, letterSpacing: "0.02em" }}>Element Spiral Atlas</h1>
          <p style={{ margin: "8px 0 0", fontSize: 18, color: "#475569" }}>Fibonacci / 369 Harmonic Periodic Table — v2.2 research lab, correlation engine, and protocol compiler</p>
        </header>

        <main style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "300px minmax(680px, 1fr) 320px", gap: 16, alignItems: "start" }}>
          <aside style={{ display: "grid", gap: 16 }}>
            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 8px", fontSize: 16 }}>◎ How to read</h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "#475569" }}>Atomic number <b>Z</b> increases outward along a golden-angle spiral. Hydrogen begins near the center; Oganesson marks the confirmed known boundary.</p>
            </section>

            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 8px", fontSize: 16 }}>◉ Measurable mapping</h2>
              <div style={{ background: "#fffbeb", borderRadius: 14, padding: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, lineHeight: 1.8 }}>Z → (r, θ)<br />θ = Z × 137.507°<br />r = c√Z</div>
              <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>This turns the periodic table into a coordinate system. The PHI369 layer is an overlay, not a replacement for chemistry.</p>
            </section>

            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 12px", fontSize: 16 }}>▦ Controls</h2>
              <div style={{ display: "grid", gap: 14 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#64748b" }}>Search</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Symbol, name, or Z…" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 14, padding: "9px 11px", fontSize: 14, outline: "none" }} />
                </label>
                {searchMatches.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {searchMatches.map((node) => <button key={node.z} style={buttonStyle(selectedZ === node.z)} onClick={() => setSelectedZ(node.z)}>{node.z} {node.raw[1]}</button>)}
                  </div>
                )}

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#64748b" }}>View mode</span>
                  <select value={viewMode} onChange={(event) => setViewMode(event.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "9px 11px", background: "white", fontSize: 14 }}>
                    {Object.entries(VIEW_PRESETS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                  <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "#64748b" }}>Tip: Spiral ribbon is best for presentation; golden seed field is best for clustering and heatmaps.</p>
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#64748b" }}>Overlay</span>
                  <select value={overlay} onChange={(event) => setOverlay(event.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "9px 11px", background: "white", fontSize: 14 }}>
                    {Object.entries(PROPERTY_PRESETS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#64748b" }}>Harmonic lens</span>
                  <select value={harmonicFilter} onChange={(event) => setHarmonicFilter(event.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "9px 11px", background: "white", fontSize: 14 }}>
                    {Object.entries(HARMONIC_FILTERS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#64748b" }}>Resonance graph</span>
                  <select value={resonanceMode} onChange={(event) => setResonanceMode(event.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "9px 11px", background: "white", fontSize: 14 }}>
                    {Object.entries(RESONANCE_MODES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </label>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "#f8fafc", borderRadius: 14, padding: 12, fontSize: 14 }}><span>Show resonance links</span><input type="checkbox" checked={showResonance} onChange={(event) => setShowResonance(event.target.checked)} /></label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#64748b" }}>Isotope neutron N</span>
                  <input type="number" min="1" max="260" value={isotopeN} onChange={(event) => setIsotopeN(Math.max(1, Math.min(260, Number(event.target.value) || 184)))} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 14, padding: "9px 11px", fontSize: 14, outline: "none" }} />
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button style={buttonStyle(isotopeN === 184)} onClick={() => setIsotopeN(184)}>N=184</button>
                    <button style={buttonStyle(false)} onClick={() => setIsotopeN(Math.max(1, Math.round(selectedZ * 1.55)))}>Balance selected</button>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "#f8fafc", borderRadius: 14, padding: 12, fontSize: 14 }}><span>Show 369 nodes</span><input type="checkbox" checked={show369} onChange={(event) => setShow369(event.target.checked)} /></label>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "#f8fafc", borderRadius: 14, padding: 12, fontSize: 14 }}><span>Show 119–120</span><input type="checkbox" checked={showFuture} onChange={(event) => setShowFuture(event.target.checked)} /></label>
              </div>
            </section>

            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px", fontSize: 16 }}>⇩ Export current view</h2>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Save the active atlas projection as SVG, PNG, or JSON.</p>
              <ExportPanel svgRef={svgRef} payload={exportPayload} />
            </section>

            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px", fontSize: 16 }}>⚗ v2.0 Lab controls</h2>
              <div style={{ display: "grid", gap: 12 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#64748b" }}>Experiment</span>
                  <select value={labExperiment} onChange={(event) => setLabExperiment(event.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: "9px 11px", background: "white", fontSize: 14 }}>
                    {Object.entries(LAB_EXPERIMENTS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>X property</span>
                    <select value={xProperty} onChange={(event) => setXProperty(event.target.value)} style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "8px 9px", background: "white", fontSize: 12 }}>
                      {CORRELATION_PROPERTIES.map((property) => <option key={property} value={property}>{PROPERTY_META[property].label}</option>)}
                    </select>
                  </label>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Y property</span>
                    <select value={yProperty} onChange={(event) => setYProperty(event.target.value)} style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "8px 9px", background: "white", fontSize: 12 }}>
                      {CORRELATION_PROPERTIES.map((property) => <option key={property} value={property}>{PROPERTY_META[property].label}</option>)}
                    </select>
                  </label>
                </div>
                <button style={buttonStyle(false)} onClick={captureLabRun}>Capture lab run</button>
              </div>
            </section>
          </aside>

          <section style={cardStyle({ overflow: "hidden", borderRadius: 28, border: "1px solid rgba(217, 119, 6, 0.36)", padding: 10 })}>
            <svg ref={svgRef} viewBox="0 0 760 760" role="img" aria-label="Fibonacci spiral map of periodic table elements" style={{ display: "block", width: "100%", minHeight: 640, maxHeight: "78vh", borderRadius: 22, background: "#fffaf0" }}>
              <defs><filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" /></filter></defs>

              {viewMode !== "table" ? (
                <SpiralGuides center={center} maxR={maxR} show369={show369} />
              ) : (
                <g>
                  {Array.from({ length: 18 }, (_, i) => <text key={`group-${i + 1}`} x={55 + i * 36} y={30} textAnchor="middle" fontSize="9" fill="#64748b">{i + 1}</text>)}
                  {Array.from({ length: 7 }, (_, i) => <text key={`period-${i + 1}`} x={24} y={58 + i * 62} textAnchor="middle" fontSize="10" fill="#64748b">P{i + 1}</text>)}
                  <text x="24" y="495" textAnchor="middle" fontSize="10" fill="#64748b">Ln</text>
                  <text x="24" y="557" textAnchor="middle" fontSize="10" fill="#64748b">An</text>
                  <text x="24" y="619" textAnchor="middle" fontSize="10" fill="#64748b">F</text>
                </g>
              )}

              {showResonance && resonanceGraph.edges.map((edge, index) => {
                const opacity = Math.max(0.18, 0.68 - index * 0.035);
                const width = Math.max(1.2, 4.4 - index * 0.18);
                const color = edge.sameRoot ? "#a16207" : edge.sameFamily ? "#7c3aed" : edge.sameBand ? "#2563eb" : "#64748b";
                return (
                  <g key={`resonance-${edge.to.z}`} pointerEvents="none">
                    <line x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y} stroke={color} strokeWidth={width} strokeOpacity={opacity} strokeDasharray={resonanceMode === "isotope" ? "7 6" : edge.sameSector ? "" : "5 7"} />
                    <circle cx={edge.to.x} cy={edge.to.y} r={5 + Math.max(0, 6 - index) * 0.35} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1.6" />
                  </g>
                );
              })}

              {visibleNodes.map((node) => {
                const [nodeZ, nodeSymbol, nodeName, nodeFamily] = node.raw;
                const isFuture = nodeFamily === "future";
                const isSelected = selectedNode.z === nodeZ;
                const matchesHarmonic = harmonicFilter === "all" || node.dr === Number(harmonicFilter);
                const tileW = isFuture ? 44 : 36;
                const tileH = isFuture ? 34 : 30;
                return (
                  <g key={nodeZ} transform={`translate(${node.x - tileW / 2}, ${node.y - tileH / 2})`} onClick={() => setSelectedZ(nodeZ)} style={{ cursor: "pointer" }}>
                    <rect width={tileW} height={tileH} rx="7" fill={colorFor(node.raw, overlay)} stroke={isSelected ? "#111827" : isFuture ? "#9ca3af" : "#ffffff"} strokeDasharray={isFuture ? "4 3" : undefined} strokeWidth={isSelected ? 2.5 : 1.2} opacity={!matchesHarmonic ? 0.18 : isFuture ? 0.72 : 0.95} filter="url(#softShadow)" />
                    <text x={tileW / 2} y="10" textAnchor="middle" fontSize="7" fill="#111827" fontWeight="700" opacity={!matchesHarmonic ? 0.35 : 1}>{nodeZ}</text>
                    <text x={tileW / 2} y={isFuture ? 25 : 23} textAnchor="middle" fontSize={isFuture ? 11 : 13} fill="#111827" fontWeight="800" opacity={!matchesHarmonic ? 0.35 : 1}>{nodeSymbol}</text>
                    <title>{nodeZ} {nodeSymbol} — {nodeName}</title>
                  </g>
                );
              })}

              {viewMode !== "table" && (
                <>
                  <text x="108" y="96" fill="#6d28d9" fontSize="18" fontWeight="800">SECTOR 1</text>
                  <text x="584" y="588" fill="#1d4ed8" fontSize="18" fontWeight="800">SECTOR 2</text>
                  <text x="92" y="628" fill="#92400e" fontSize="18" fontWeight="800">SECTOR 3</text>
                </>
              )}
            </svg>
          </section>

          <aside style={{ display: "grid", gap: 16 }}>
            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px", fontSize: 16 }}>⚛ Selected node</h2>
              <div style={{ border: "1px solid rgba(15, 23, 42, 0.18)", borderRadius: 20, padding: 16, background: colorFor(selectedNode.raw, overlay) }}><div style={{ fontSize: 13, fontWeight: 800 }}>{z}</div><div style={{ fontSize: "clamp(42px, 4vw, 52px)", fontWeight: 950, lineHeight: 0.95 }}>{symbol}</div><div style={{ marginTop: 4, fontSize: 18, fontWeight: 750 }}>{name}</div></div>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                <Field label="Family">{FAMILY_LABELS[family] || FAMILY_LABELS.unknown}</Field><Field label="Period">{period}</Field><Field label="Group">{group ?? "—"}</Field><Field label="Block">{block}</Field><Field label="Digital root">{selectedNode.dr}</Field><Field label="Sector / Band">{selectedNode.sector} / {selectedNode.band}</Field><Field label="Atomic mass">{formatProp(selectedProps.atomicMass, "u")}</Field><Field label="Electronegativity">{formatProp(selectedProps.electronegativity)}</Field><Field label="Ionization">{formatProp(selectedProps.ionization, "eV")}</Field><Field label="Density">{formatProp(selectedProps.density, "g/cm³")}</Field><Field label="Stability">{selectedProps.stable === true ? "stable seed" : selectedProps.stable === false ? "radioactive/frontier" : "unknown"}</Field><Field label="Discovered">{formatYear(selectedProps.discovered)}</Field><Field label="Angle" wide>{selectedNode.theta.toFixed(3)}° from golden-angle projection</Field>
              </div>
              <details style={{ marginTop: 10 }}>
                <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#334155" }}>Extended properties</summary>
                <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  <Field label="Phase">{selectedProps.phaseAtSTP || "—"}</Field>
                  <Field label="Occurrence">{selectedProps.occurrence || "—"}</Field>
                  <Field label="Electron config" wide>{selectedProps.electronConfiguration || "—"}</Field>
                  <Field label="Melting point">{formatProp(selectedProps.meltingPointK, "K")}</Field>
                  <Field label="Boiling point">{formatProp(selectedProps.boilingPointK, "K")}</Field>
                  <Field label="Stable isotopes">{formatProp(selectedProps.stableIsotopeCount)}</Field>
                  <Field label="Half-life">{selectedProps.halfLife || "—"}</Field>
                  <Field label="Decay mode">{selectedProps.decayMode || "—"}</Field>
                </div>
              </details>
            </section>

            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>Atomic neighbors</h2>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Jump along the atomic-number chain while keeping the active projection and overlay.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={buttonStyle(false)} disabled={selectedZ <= 1} onClick={() => setSelectedZ(Math.max(1, selectedZ - 1))}>← Z-{selectedZ > 1 ? selectedZ - 1 : 1}</button>
                <button style={buttonStyle(false)} disabled={selectedZ >= (showFuture ? 120 : 118)} onClick={() => setSelectedZ(Math.min(showFuture ? 120 : 118, selectedZ + 1))}>Z+{Math.min(showFuture ? 120 : 118, selectedZ + 1)} →</button>
              </div>
            </section>

            <section style={cardStyle({ padding: 16 })}>
              <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>Resonance graph</h2>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Draws relationship corridors from the selected element using the active graph mode.</p>
              <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
                <div><b>Mode:</b> {RESONANCE_MODES[resonanceMode] || resonanceMode}</div>
                <div><b>Edges:</b> {resonanceGraph.edges.length}</div>
                {resonanceGraph.summary.length ? resonanceGraph.summary.slice(0, 6).map((item) => (
                  <button key={`res-panel-${item.z}`} style={{ ...buttonStyle(false), textAlign: "left", borderRadius: 12 }} onClick={() => setSelectedZ(item.z)}>
                    {item.symbol}{item.z} — {item.reason} · score {item.score}
                  </button>
                )) : <div style={{ color: "#64748b" }}>No graph links for this mode.</div>}
                {resonanceGraph.summary.length > 6 && (
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    +{resonanceGraph.summary.length - 6} more links in export payload
                  </div>
                )}
              </div>
            </section>

                      </aside>
        </main>

        <section style={{ marginTop: 12 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Advanced panels are grouped below so the atlas remains the visual center.</p>
        </section>

        <section style={cardStyle({ marginTop: 16, padding: 16 })}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 22 }}>Research Workbench</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Advanced analysis, notebook, frontier, and data panels.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : viewportWidth < 1500 ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))", gap: 12, alignItems: "start" }}>
<details open style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Insight engine</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>v1.5 converts the active atlas state into a lightweight research receipt and data-driven prompts for deeper investigation.</p>
              <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 10 }}>
                  <b>Receipt</b><br />
                  <code style={{ fontSize: 11, wordBreak: "break-all" }}>{atlasReceipt.id}</code><br />
                  <span style={{ color: "#92400e" }}>{atlasReceipt.claim}</span>
                </div>
                <div><b>Selected data coverage:</b> {insightEngine.selectedPropertyCoverage}/{Object.keys(PROPERTY_META).length} seeded numeric fields</div>
                {insightEngine.topHarmonicSpread && (
                  <div style={{ background: "#f8fafc", borderRadius: 12, padding: 10 }}>
                    <b>Strongest harmonic split:</b> {insightEngine.topHarmonicSpread.label}<br />
                    <span>root {insightEngine.topHarmonicSpread.weakestRoot?.root ?? "—"} → root {insightEngine.topHarmonicSpread.strongestRoot?.root ?? "—"}</span><br />
                    <span>spread {insightEngine.topHarmonicSpread.spread === null ? "—" : `${insightEngine.topHarmonicSpread.spread.toFixed(3)} ${insightEngine.topHarmonicSpread.unit}`}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {insightEngine.selectedTags.map((tag) => (
                    <span key={tag} style={{ border: "1px solid #e2e8f0", background: "#ffffff", borderRadius: 999, padding: "5px 8px" }}>{tag}</span>
                  ))}
                </div>
                <button style={buttonStyle(false)} onClick={() => navigator?.clipboard?.writeText?.(JSON.stringify(atlasReceipt, null, 2))}>Copy receipt JSON</button>
              </div>
            </details>

            <details open style={detailsPanelStyle()}>
              <summary style={summaryStyle}>v2.2 Research Lab</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Compile the current atlas state into an experiment protocol, correlation check, and report-ready receipt.</p>
              <div style={{ display: "grid", gap: 10, fontSize: 12 }}>
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 10 }}>
                  <b>{experimentPlan.label}</b><br />
                  <span>{experimentPlan.objective}</span><br />
                  <span style={{ color: "#92400e" }}>{experimentPlan.resultHint}</span>
                </div>
                <div style={{ display: "grid", gap: 5 }}>
                  {(experimentPlan.steps || []).map((step, index) => (
                    <div key={`${experimentPlan.receiptId}-${index}`} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 6 }}>
                      <b>{index + 1}</b><span>{step}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10, background: "#ffffff" }}>
                  <b>Correlation Lab</b><br />
                  <span>{correlationStudy.xLabel || correlationStudy.xProperty} × {correlationStudy.yLabel || correlationStudy.yProperty}</span><br />
                  <span>n={correlationStudy.count}; r={correlationStudy.correlation === null ? "—" : correlationStudy.correlation.toFixed(3)} · {correlationStudy.interpretation}</span>
                  <div style={{ marginTop: 8, height: 96, border: "1px solid #e2e8f0", borderRadius: 10, background: "#f8fafc", position: "relative", overflow: "hidden" }}>
                    {correlationStudy.pairs.map((pair) => {
                      const xMeta = PROPERTY_META[xProperty];
                      const yMeta = PROPERTY_META[yProperty];
                      const xPct = xMeta ? Math.max(4, Math.min(96, ((pair.x - xMeta.min) / Math.max(1, xMeta.max - xMeta.min)) * 92 + 4)) : 50;
                      const yPct = yMeta ? Math.max(4, Math.min(96, 100 - (((pair.y - yMeta.min) / Math.max(1, yMeta.max - yMeta.min)) * 92 + 4))) : 50;
                      const color = pair.root === 3 ? "#7c3aed" : pair.root === 6 ? "#2563eb" : pair.root === 9 ? "#a16207" : "#64748b";
                      return <span key={`${pair.z}-${xProperty}-${yProperty}`} title={`${pair.symbol}${pair.z}`} style={{ position: "absolute", left: `${xPct}%`, top: `${yPct}%`, width: 7, height: 7, borderRadius: 999, background: color, transform: "translate(-50%, -50%)" }} />;
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button style={buttonStyle(false)} onClick={() => copyToClipboard(experimentPlan)}>Copy protocol</button>
                  <button style={buttonStyle(false)} onClick={() => copyToClipboard(labReportMarkdown)}>Copy lab report MD</button>
                  <button style={buttonStyle(false)} onClick={() => exportJson({ experimentPlan, correlationStudy, labReportMarkdown, labLog }, "phi369-element-spiral-atlas-v2-lab.json")}>Export lab JSON</button>
                </div>
                {labLog.length > 0 && (
                  <div style={{ display: "grid", gap: 6 }}>
                    <b>Lab run log ({labLog.length})</b>
                    {labLog.slice(0, 4).map((item) => (
                      <button key={item.id} style={{ ...buttonStyle(false), borderRadius: 12, textAlign: "left" }} onClick={() => copyToClipboard(item)}>
                        {item.experimentPlan?.label || "Lab run"}<br />
                        <span style={{ fontSize: 11, opacity: 0.75 }}>{item.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </details>

            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Research notebook</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>v2.0 pairs the notebook with lab protocols, correlation checks, and report-ready exports.</p>
              <textarea
                value={researchNote}
                onChange={(event) => setResearchNote(event.target.value)}
                placeholder="Add a note about what you are testing…"
                style={{ width: "100%", boxSizing: "border-box", minHeight: 70, border: "1px solid #cbd5e1", borderRadius: 12, padding: 10, fontSize: 12, resize: "vertical" }}
              />
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button style={buttonStyle(false)} onClick={captureResearchSnapshot}>Capture snapshot</button>
                <button style={buttonStyle(false)} onClick={() => copyToClipboard(currentSnapshot)}>Copy current snapshot</button>
                <button style={buttonStyle(false)} onClick={() => setResearchNotebook([])}>Clear notebook</button>
              </div>
              {snapshotDelta && (
                <div style={{ marginTop: 10, background: "#f8fafc", borderRadius: 12, padding: 10, fontSize: 12 }}>
                  <b>Delta from last snapshot</b><br />
                  {snapshotDelta.from.symbol || "—"}{snapshotDelta.from.selectedZ || ""} → {snapshotDelta.to.symbol || "—"}{snapshotDelta.to.selectedZ || ""}<br />
                  {snapshotDelta.overlayChanged ? "overlay changed; " : ""}{snapshotDelta.viewChanged ? "view changed; " : ""}{snapshotDelta.isotopeChanged ? "isotope N changed; " : ""}{snapshotDelta.resonanceChanged ? "resonance mode changed; " : ""}
                </div>
              )}
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <b style={{ fontSize: 12 }}>Hypothesis prompts</b>
                {researchPrompts.map((item) => (
                  <button key={`${item.type}-${item.title}`} style={{ ...buttonStyle(false), borderRadius: 14, padding: 10, textAlign: "left" }} onClick={() => setResearchNote(item.prompt)}>
                    <b>{item.title}</b><br />
                    <span style={{ fontSize: 11, opacity: 0.78 }}>{item.prompt.slice(0, 120)}{item.prompt.length > 120 ? "…" : ""}</span>
                  </button>
                ))}
              </div>
              {researchNotebook.length > 0 && (
                <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
                  <b style={{ fontSize: 12 }}>Saved snapshots ({researchNotebook.length})</b>
                  {researchNotebook.slice(0, 5).map((item) => (
                    <button key={item.id} style={{ ...buttonStyle(false), borderRadius: 12, padding: 9, textAlign: "left" }} onClick={() => item.payload?.selectedZ && setSelectedZ(item.payload.selectedZ)}>
                      <b>{item.payload.symbol}{item.payload.selectedZ}</b> · {item.payload.overlay} · {item.payload.viewMode}<br />
                      <span style={{ fontSize: 11, opacity: 0.75 }}>{item.id}</span>
                    </button>
                  ))}
                </div>
              )}
            </details>

            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Comparison lens</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Compare the selected element against a second element without changing the active node.</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <input type="number" min="1" max={showFuture ? 120 : 118} value={compareZ} onChange={(event) => setCompareZ(Math.max(1, Math.min(showFuture ? 120 : 118, Number(event.target.value) || 1)))} style={{ width: 84, border: "1px solid #cbd5e1", borderRadius: 12, padding: "8px 9px", fontSize: 13 }} />
                <button style={buttonStyle(false)} onClick={() => setCompareZ(selectedZ)}>Use selected</button>
                <button style={buttonStyle(false)} onClick={() => setSelectedZ(compareZ)}>Jump</button>
              </div>
              {comparison && (
                <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
                  <div><b>{comparison.selected.raw[1]}{comparison.selected.z}</b> ↔ <b>{comparison.compare.raw[1]}{comparison.compare.z}</b></div>
                  <div>Atomic distance: {comparison.phi369.atomicDistance > 0 ? "+" : ""}{comparison.phi369.atomicDistance}</div>
                  <div>PHI369: {comparison.phi369.sameRoot ? "same root" : `root Δ ${comparison.phi369.digitalRootDelta}`}; {comparison.phi369.sameSector ? "same sector" : "different sector"}; {comparison.phi369.sameBand ? "same band" : "different band"}</div>
                  <div style={{ display: "grid", gap: 5 }}>
                    {comparison.properties.map((item) => (
                      <div key={item.property} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, background: "#f8fafc", borderRadius: 9, padding: 7 }}>
                        <span>{item.label}</span>
                        <span>{item.delta === null ? "—" : `${item.delta > 0 ? "+" : ""}${item.delta.toFixed(3)} ${item.unit}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </details>

            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Active overlay stats</summary>
              {activePropertyStats ? (
                <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
                  <div><b>{activePropertyStats.label}</b> coverage: {activePropertyStats.count}/118</div>
                  <div>Average: {activePropertyStats.average === null ? "—" : `${activePropertyStats.average.toFixed(3)} ${activePropertyStats.unit}`}</div>
                  <div>Low: {activePropertyStats.min ? `${activePropertyStats.min.node.raw[1]} (${activePropertyStats.min.value})` : "—"}</div>
                  <div>High: {activePropertyStats.max ? `${activePropertyStats.max.node.raw[1]} (${activePropertyStats.max.value})` : "—"}</div>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Switch to a numeric heatmap overlay to see min / max / average summaries.</p>
              )}
            </details>

            <details open style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Data completeness</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>v1.1 tracks scientific-property coverage and separates seeded values from unknown/null fields.</p>
              <CompletenessPanel report={completenessReport} />
            </details>

            <details style={detailsPanelStyle()}><summary style={summaryStyle}>Legend</summary><Legend overlay={overlay} /></details>
            <details style={detailsPanelStyle()}><summary style={summaryStyle}>Claim discipline</summary><p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.52, color: "#475569" }}>This atlas is an alternate visualization of known element data. It can compare patterns, highlight superheavy frontier zones, and test correlations, but it does not claim new elements without experimental evidence.</p></details>
            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Next frontier</summary>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.52, color: "#475569" }}>Ghost nodes 119 and 120 are future/unconfirmed placeholders. The corridor score below is geometry-only and is not an experimental discovery claim.</p>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}><button style={buttonStyle(selectedZ === 119)} onClick={() => setSelectedZ(119)}>E119</button><button style={buttonStyle(selectedZ === 120)} onClick={() => setSelectedZ(120)}>E120</button></div>
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {frontierCorridor.map((item) => (
                  <button key={item.z} style={{ ...buttonStyle(selectedZ === item.z), textAlign: "left", borderRadius: 14, padding: 10 }} onClick={() => setSelectedZ(item.z)}>
                    <b>{item.z} {item.symbol}</b> · score {item.frontierScore}/6<br />
                    <span style={{ fontSize: 11, opacity: 0.8 }}>{item.label}; dr {item.digitalRoot}, sector {item.sector}, band {item.band}</span>
                  </button>
                ))}
              </div>
            </details>

            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Isotope stability preview</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Educational N/Z and magic-number lens for the selected element. This is a heuristic preview only.</p>
              {isotopeCandidate && (
                <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 10 }}>
                    <b>{isotopeCandidate.symbol}-{isotopeCandidate.a}</b> · Z={isotopeCandidate.z}, N={isotopeCandidate.n}, A={isotopeCandidate.a}<br />
                    <span>N/Z {isotopeCandidate.nToZ}; {isotopeCandidate.parity}; score {isotopeCandidate.score}/10</span>
                  </div>
                  <div>Nearest proton magic: {isotopeCandidate.nearestProtonMagic.value} (Δ {isotopeCandidate.nearestProtonMagic.distance})</div>
                  <div>Nearest neutron magic: {isotopeCandidate.nearestNeutronMagic.value} (Δ {isotopeCandidate.nearestNeutronMagic.distance})</div>
                  <div>Island-distance preview: {isotopeCandidate.islandDistance}</div>
                  <div style={{ color: "#92400e" }}>{isotopeCandidate.label}</div>
                </div>
              )}
              <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                <b style={{ fontSize: 12 }}>Superheavy runway at N={isotopeN}</b>
                {isotopeRunway.slice(0, 5).map((item) => (
                  <button key={item.z} style={{ ...buttonStyle(selectedZ === item.z), borderRadius: 14, padding: 9, textAlign: "left" }} onClick={() => setSelectedZ(item.z)}>
                    <b>{item.symbol}-{item.a}</b> · score {item.score}/10<br />
                    <span style={{ fontSize: 11, opacity: 0.8 }}>Z={item.z}, N/Z {item.nToZ}, {item.parity}</span>
                  </button>
                ))}
              </div>
            </details>

            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Harmonic families</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Root-family counts for known elements. Use the Harmonic Lens control to isolate a family on the atlas.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, fontSize: 11 }}>
                {harmonicSummary.map((item) => (
                  <button key={item.root} style={{ ...buttonStyle(harmonicFilter !== "all" && Number(harmonicFilter) === item.root), borderRadius: 12, padding: 8, textAlign: "left", opacity: item.active ? 1 : 0.58 }} onClick={() => setHarmonicFilter(String(item.root))}>
                    <b>Root {item.root}</b><br />{item.count} elements<br />{item.stableCount} stable seeds
                  </button>
                ))}
              </div>
              <button style={{ ...buttonStyle(harmonicFilter === "all"), marginTop: 8 }} onClick={() => setHarmonicFilter("all")}>Show all roots</button>
            </details>

            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Nearest seeded matches</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Similarity uses available seeded numeric properties, with tiny bonuses for matching family or digital root.</p>
              <div style={{ display: "grid", gap: 8 }}>
                {similarityScan.map((item) => (
                  <button key={item.node.z} style={{ ...buttonStyle(false), borderRadius: 14, padding: 10, textAlign: "left" }} onClick={() => setSelectedZ(item.node.z)}>
                    <b>{item.node.raw[1]}{item.node.z}</b> · score {item.score.toFixed(3)}<br />
                    <span style={{ fontSize: 11, opacity: 0.8 }}>{item.comparedFields} fields; {item.sameFamily ? "same family" : "different family"}; {item.sameRoot ? "same root" : "different root"}</span>
                  </button>
                ))}
              </div>
            </details>

            <details  style={detailsPanelStyle()}>
              <summary style={summaryStyle}>Pattern scanner</summary>
              <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.45, color: "#64748b" }}>Compares seeded scientific values across the 3-line, 6-line, and 9-line digital-root families.</p>
              <div style={{ display: "grid", gap: 10 }}>
                {patternScan.map((scan) => (
                  <div key={scan.property} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 10, background: "#ffffff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}><b style={{ fontSize: 12 }}>{scan.label}</b><span style={{ fontSize: 11, color: "#92400e" }}>{scan.strength}</span></div>
                    <div style={{ marginTop: 7, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, fontSize: 11 }}>
                      {scan.lineAverages.map((item) => <div key={`${scan.property}-${item.line}`} style={{ background: item.line === 3 ? "#ede9fe" : item.line === 6 ? "#dbeafe" : "#fef3c7", borderRadius: 9, padding: 6 }}><b>{item.line}-line</b><br />{item.average === null ? "—" : `${item.average.toFixed(2)} ${scan.unit}`}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </details>

          </div>
        </section>

        <footer style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          <section style={cardStyle({ padding: 16 })}><h3 style={{ margin: "0 0 6px" }}>v2.2 Research Lab</h3><p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Adds lab protocols, correlation checks, report compiler, snapshots, and notebook-aware export payloads.</p></section>
          <section style={cardStyle({ padding: 16 })}><h3 style={{ margin: "0 0 6px" }}>6 Bands</h3><p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Six radial layers compress period-like growth into a readable spiral atlas.</p></section>
          <section style={cardStyle({ padding: 16 })}><h3 style={{ margin: "0 0 6px" }}>9 Nodes</h3><p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Nine harmonic anchors mark modular families and make the structure easy to scan.</p></section>
        </footer>
      </div>
    </div>
  );
}
