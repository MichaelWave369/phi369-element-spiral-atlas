import React, { useMemo, useState } from "react";
import { ELEMENTS } from "./data/elementsBase.js";
import { PROPERTY_SEEDS } from "./data/propertySeeds.js";
import { FAMILY_LABELS } from "./data/atlasConstants.js";
import { GOLDEN_ANGLE, DEG, digitalRoot } from "./lib/atlasMath.js";
import {
  COMPARATIVE_MODEL_SOURCES,
  COMPARATIVE_RESEARCH_QUESTIONS,
  getNasaOrigin,
  getRussellSeed,
} from "./data/comparativeElementModels.js";

const CONFIRMED_ELEMENTS = ELEMENTS.filter(([z]) => z <= 118);

function cardStyle(extra = {}) {
  return {
    background: "rgba(255,255,255,0.80)",
    border: "1px solid rgba(217,119,6,0.22)",
    borderRadius: 22,
    boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
    padding: 18,
    ...extra,
  };
}

function badgeStyle(kind = "reference") {
  const palettes = {
    reference: { background: "#ecfdf5", border: "#a7f3d0", color: "#065f46" },
    "experimental projection": { background: "#eff6ff", border: "#bfdbfe", color: "#1e40af" },
    "historical model": { background: "#fff7ed", border: "#fed7aa", color: "#9a3412" },
    "modern astrophysics": { background: "#f5f3ff", border: "#ddd6fe", color: "#5b21b6" },
  };
  const palette = palettes[kind] || palettes.reference;
  return {
    display: "inline-flex",
    alignItems: "center",
    border: `1px solid ${palette.border}`,
    background: palette.background,
    color: palette.color,
    borderRadius: 999,
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.02em",
  };
}

function SourceLink({ model }) {
  if (!model?.sourceUrl) return null;
  return (
    <a href={model.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#92400e", fontSize: 12, fontWeight: 700 }}>
      {model.sourceLabel || "Source"}
    </a>
  );
}

function ModelHeader({ model }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#111827" }}>{model.label}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>{model.claimClass}</div>
      </div>
      <span style={badgeStyle(model.authority)}>{model.authority}</span>
    </div>
  );
}

function Metric({ label, value, note }) {
  return (
    <div style={{ borderTop: "1px solid rgba(148,163,184,0.24)", padding: "9px 0" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", fontWeight: 800 }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 14, color: "#0f172a", fontWeight: 800 }}>{value ?? "Unknown"}</div>
      {note ? <div style={{ marginTop: 3, fontSize: 12, lineHeight: 1.45, color: "#64748b" }}>{note}</div> : null}
    </div>
  );
}

function PhiMiniMap({ selectedZ }) {
  const size = 320;
  const center = size / 2;
  const maxR = 136;
  const scale = maxR / Math.sqrt(118);
  const points = useMemo(() => CONFIRMED_ELEMENTS.map(([z]) => {
    const theta = (z * GOLDEN_ANGLE) % 360;
    const r = scale * Math.sqrt(z);
    return {
      z,
      x: center + r * Math.cos((theta - 90) * DEG),
      y: center + r * Math.sin((theta - 90) * DEG),
    };
  }), [center, scale]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Golden-angle projection with element ${selectedZ} highlighted`} style={{ width: "100%", maxWidth: 320, display: "block", margin: "4px auto 8px" }}>
      <circle cx={center} cy={center} r={maxR} fill="#fffbeb" stroke="#f59e0b" strokeOpacity="0.35" />
      {points.map((point) => (
        <circle
          key={point.z}
          cx={point.x}
          cy={point.y}
          r={point.z === selectedZ ? 6.5 : 2.4}
          fill={point.z === selectedZ ? "#111827" : "#d97706"}
          fillOpacity={point.z === selectedZ ? 1 : 0.58}
          stroke={point.z === selectedZ ? "#ffffff" : "none"}
          strokeWidth={point.z === selectedZ ? 2 : 0}
        />
      ))}
    </svg>
  );
}

function RussellCycleGlyph({ active }) {
  const points = Array.from({ length: 81 }, (_, index) => {
    const x = 10 + index * 3.5;
    const phase = index / 80;
    const y = 70 - Math.sin(phase * Math.PI * 2) * 36;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 300 140" role="img" aria-label="Abstract cycle glyph representing Russell's documented rhythmic framework" style={{ width: "100%", maxWidth: 340, display: "block", margin: "6px auto 10px" }}>
      <line x1="12" y1="70" x2="288" y2="70" stroke="#cbd5e1" strokeDasharray="4 5" />
      <polyline points={points} fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="70" r={active ? 7 : 5} fill="#111827" />
      <text x="150" y="126" textAnchor="middle" fontSize="10" fill="#64748b">cycle glyph, not a digitized Russell chart</text>
    </svg>
  );
}

export default function ComparativeElementLab() {
  const [selectedZ, setSelectedZ] = useState(79);
  const element = useMemo(() => CONFIRMED_ELEMENTS.find(([z]) => z === selectedZ) || CONFIRMED_ELEMENTS[0], [selectedZ]);
  const [z, symbol, name, family, period, group, block] = element;
  const props = PROPERTY_SEEDS[z] || {};
  const nasa = getNasaOrigin(z);
  const russell = getRussellSeed(z);
  const theta = (z * GOLDEN_ANGLE) % 360;
  const radius = Math.sqrt(z);
  const dr = digitalRoot(z);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8f1df 0%, #fffdf7 48%, #f8f1df 100%)", color: "#0f172a", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "22px clamp(14px, 3vw, 34px) 40px" }}>
        <header style={cardStyle({ marginBottom: 16, padding: "20px 22px" })}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
            <div style={{ maxWidth: 860 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#b45309", letterSpacing: "0.1em", textTransform: "uppercase" }}>PHI369 Element Spiral Atlas · v3.1 research module</div>
              <h1 style={{ margin: "6px 0 6px", fontSize: "clamp(26px, 4vw, 44px)", lineHeight: 1.05 }}>Comparative Element Cosmology Lab</h1>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.55, fontSize: 14 }}>Follow one element across four representations while keeping their evidence classes separate: modern chemistry, PHI369 geometry, Russell's 1926 historical framework, and modern nucleosynthesis.</p>
            </div>
            <label style={{ display: "grid", gap: 6, minWidth: 230, fontSize: 12, fontWeight: 800, color: "#475569" }}>
              Follow an element
              <select value={selectedZ} onChange={(event) => setSelectedZ(Number(event.target.value))} style={{ border: "1px solid #cbd5e1", borderRadius: 12, background: "white", padding: "10px 12px", fontSize: 14, color: "#111827" }}>
                {CONFIRMED_ELEMENTS.map(([atomicNumber, elementSymbol, elementName]) => (
                  <option key={atomicNumber} value={atomicNumber}>{atomicNumber} · {elementSymbol} · {elementName}</option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <section style={cardStyle({ marginBottom: 16, display: "grid", gridTemplateColumns: "minmax(150px, 0.35fr) minmax(280px, 1.65fr)", gap: 18, alignItems: "center" })}>
          <div style={{ borderRadius: 18, background: "#111827", color: "white", padding: 18, textAlign: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.65 }}>Atomic number</div>
            <div style={{ fontSize: 22, marginTop: 4 }}>Z = {z}</div>
            <div style={{ fontSize: 60, lineHeight: 1, fontWeight: 900, margin: "7px 0" }}>{symbol}</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{name}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Fixed identity, changing representation</div>
            <h2 style={{ margin: "6px 0", fontSize: 24 }}>Same element. Four different questions.</h2>
            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.55, fontSize: 14 }}>The element identity does not change when the projection changes. This module is designed to make that boundary visible, so a historical or geometric relationship cannot silently become a scientific fact.</p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <article style={cardStyle()}>
            <ModelHeader model={COMPARATIVE_MODEL_SOURCES.modern} />
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{COMPARATIVE_MODEL_SOURCES.modern.description}</p>
            <Metric label="Period / group" value={`Period ${period} · Group ${group}`} />
            <Metric label="Block" value={`${block}-block`} />
            <Metric label="Family" value={FAMILY_LABELS[family] || family} />
            <Metric label="Electron configuration" value={props.electronConfiguration || "Not curated"} note="Displayed from the atlas property seed layer; null stays unknown." />
          </article>

          <article style={cardStyle()}>
            <ModelHeader model={COMPARATIVE_MODEL_SOURCES.phi} />
            <PhiMiniMap selectedZ={z} />
            <Metric label="Golden-angle coordinate" value={`${theta.toFixed(3)}°`} note={`θ = (Z × ${GOLDEN_ANGLE.toFixed(6)}°) mod 360`} />
            <Metric label="Radial coordinate" value={`${radius.toFixed(4)} √Z units`} note="Canonical unscaled radius r = √Z; the rendered atlas applies a display scale." />
            <Metric label="Digital root" value={dr} note={([3, 6, 9].includes(dr) ? "Falls on a PHI369 harmonic lens." : "Outside the 3/6/9 harmonic highlight.")} />
          </article>

          <article style={cardStyle()}>
            <ModelHeader model={COMPARATIVE_MODEL_SOURCES.russell} />
            <RussellCycleGlyph active={Boolean(russell)} />
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{COMPARATIVE_MODEL_SOURCES.russell.description}</p>
            {russell ? (
              <>
                <Metric label="Source-verified seed" value={russell.placementSummary} note={russell.note} />
                <a href={russell.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#92400e", fontSize: 12, fontWeight: 700 }}>{russell.sourceLabel}</a>
              </>
            ) : (
              <Metric label="Element-level Russell mapping" value="Not curated yet" note="The framework is documented, but this element has not yet been transcribed from Russell's original chart into the machine-readable comparison layer. The UI refuses to guess." />
            )}
            <div style={{ marginTop: 10 }}><SourceLink model={COMPARATIVE_MODEL_SOURCES.russell} /></div>
          </article>

          <article style={cardStyle()}>
            <ModelHeader model={COMPARATIVE_MODEL_SOURCES.nasa} />
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{COMPARATIVE_MODEL_SOURCES.nasa.description}</p>
            {nasa ? (
              <>
                <Metric label="Origin pathway" value={nasa.summary} note={nasa.note} />
                <Metric label="Evidence label" value={nasa.confidence} note="This module stores simplified high-level origin summaries, not a complete isotope-by-isotope nucleosynthesis network." />
              </>
            ) : (
              <Metric label="Origin pathway" value="Not curated yet" note="No origin category is shown until it is entered from a cited scientific source. Absence here means incomplete curation, not unknown astrophysics." />
            )}
            <div style={{ marginTop: 10 }}><SourceLink model={COMPARATIVE_MODEL_SOURCES.nasa} /></div>
          </article>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 16 }}>
          <article style={cardStyle()}>
            <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>Comparison contract</h2>
            <div style={{ display: "grid", gap: 8, color: "#475569", fontSize: 13, lineHeight: 1.5 }}>
              <div><b>Identity is fixed.</b> Atomic number and element identity are not altered by a projection.</div>
              <div><b>Geometry is not authority.</b> PHI369 proximity can generate questions, but it does not establish chemical or nuclear causation.</div>
              <div><b>Historical means historical.</b> Russell's claims remain attributed to Russell unless independently supported by modern evidence.</div>
              <div><b>Unknown stays unknown.</b> Missing Russell mappings or NASA classifications render as not curated rather than being inferred.</div>
              <div><b>Tests beat impressions.</b> Any claimed relationship should be compared against measured properties and randomized/null models.</div>
            </div>
          </article>

          <article style={cardStyle()}>
            <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>Research queue</h2>
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, color: "#475569", fontSize: 13, lineHeight: 1.45 }}>
              {COMPARATIVE_RESEARCH_QUESTIONS.map((question) => <li key={question}>{question}</li>)}
            </ol>
          </article>
        </section>
      </div>
    </div>
  );
}
