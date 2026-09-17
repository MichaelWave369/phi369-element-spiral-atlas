import React, { useMemo, useState } from "react";
import { ELEMENTS } from "./data/elementsBase.js";
import { GOLDEN_ANGLE, DEG, digitalRoot } from "./lib/atlasMath.js";
import {
  COMPARATIVE_METHOD_NOTE,
  COMPARATIVE_VIEWS,
  FEATURED_ORIGIN_NOTES,
  RUSSELL_CURATED_NOTES,
} from "./data/comparativeElementData.js";

const REAL_ELEMENTS = ELEMENTS.filter(([z]) => z <= 118);

function card(extra = {}) {
  return {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(217,119,6,0.24)",
    borderRadius: 22,
    boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
    ...extra,
  };
}

function pill(active = false) {
  return {
    border: active ? "1px solid #111827" : "1px solid rgba(148,163,184,0.65)",
    background: active ? "#111827" : "#fff",
    color: active ? "#fff" : "#111827",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function phiPoint(z, scale = 13, center = 180) {
  const theta = (z * GOLDEN_ANGLE) % 360;
  const r = scale * Math.sqrt(z);
  return {
    theta,
    r,
    x: center + r * Math.cos((theta - 90) * DEG),
    y: center + r * Math.sin((theta - 90) * DEG),
  };
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function MiniPhiMap({ selectedZ }) {
  const points = useMemo(
    () => REAL_ELEMENTS.map((entry) => ({ entry, ...phiPoint(entry[0]) })),
    []
  );

  return (
    <svg viewBox="0 0 360 360" width="100%" role="img" aria-label="PHI369 golden-angle element spiral">
      <circle cx="180" cy="180" r="154" fill="#fffaf0" stroke="#f59e0b" strokeOpacity="0.25" />
      {points.map(({ entry, x, y }) => {
        const [z, symbol] = entry;
        const selected = z === selectedZ;
        return (
          <g key={z}>
            <circle
              cx={x}
              cy={y}
              r={selected ? 9 : 2.7}
              fill={selected ? "#111827" : "#d97706"}
              opacity={selected ? 1 : 0.56}
            />
            {selected && (
              <text x={x + 12} y={y + 4} fontSize="11" fontWeight="900" fill="#111827">
                {symbol} · {z}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function ModernMap({ element }) {
  const [z, symbol, name, family, period, group, block] = element;
  const cellW = 26;
  const cellH = 31;
  const x = 16 + (Math.max(1, group || 3) - 1) * cellW;
  const y = 24 + (Math.max(1, period || 1) - 1) * cellH;
  return (
    <div>
      <svg viewBox="0 0 500 265" width="100%" role="img" aria-label="Modern periodic-table position">
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 18 }).map((__, col) => (
            <rect
              key={`${row}-${col}`}
              x={16 + col * cellW}
              y={24 + row * cellH}
              width="22"
              height="26"
              rx="4"
              fill="#f8fafc"
              stroke="#cbd5e1"
            />
          ))
        )}
        <rect x={x} y={y} width="22" height="26" rx="4" fill="#111827" stroke="#111827" />
        <text x={x + 11} y={y + 18} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{symbol}</text>
      </svg>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: "#475569" }}>
        <strong style={{ color: "#111827" }}>{name}</strong> is Z={z}, period {period}, group {group}, {block}-block, family <code>{family}</code>.
      </div>
    </div>
  );
}

function RussellMap({ selectedZ }) {
  const note = RUSSELL_CURATED_NOTES[selectedZ];
  return (
    <div>
      <svg viewBox="0 0 500 265" width="100%" role="img" aria-label="Historical Russell cycle interpretation placeholder">
        <defs>
          <linearGradient id="russellArc" x1="0" x2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#111827" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path d="M45 142 C120 30, 205 30, 250 142 C295 254, 380 254, 455 142" fill="none" stroke="url(#russellArc)" strokeWidth="8" strokeLinecap="round" />
        <line x1="250" y1="38" x2="250" y2="232" stroke="#94a3b8" strokeDasharray="5 7" />
        <text x="55" y="112" fontSize="12" fontWeight="800" fill="#92400e">contraction / charging</text>
        <text x="276" y="205" fontSize="12" fontWeight="800" fill="#92400e">expansion / discharging</text>
        <text x="250" y="28" textAnchor="middle" fontSize="12" fontWeight="900" fill="#111827">turning / maximum</text>
        <text x="250" y="252" textAnchor="middle" fontSize="11" fill="#64748b">historical conceptual scaffold, not an asserted coordinate</text>
      </svg>
      <div style={{ padding: 12, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, fontSize: 13, lineHeight: 1.55 }}>
        <strong>Russell data status:</strong>{" "}
        {note ? note.summary : "Exact element placement has not yet been transcribed into the Atlas dataset. This view intentionally shows the claimed cycle structure without fabricating an element coordinate."}
      </div>
    </div>
  );
}

function OriginMap({ selectedZ, element }) {
  const note = FEATURED_ORIGIN_NOTES[selectedZ];
  const [, symbol, name] = element;
  return (
    <div>
      <svg viewBox="0 0 500 265" width="100%" role="img" aria-label="Element nucleosynthesis pathway overview">
        <circle cx="86" cy="132" r="44" fill="#fef3c7" stroke="#f59e0b" />
        <text x="86" y="128" textAnchor="middle" fontSize="12" fontWeight="900">cosmic</text>
        <text x="86" y="145" textAnchor="middle" fontSize="12" fontWeight="900">source</text>
        <path d="M135 132 H228" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrow)" />
        <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" /></marker></defs>
        <rect x="238" y="94" width="126" height="76" rx="18" fill="#fff7ed" stroke="#fdba74" />
        <text x="301" y="124" textAnchor="middle" fontSize="15" fontWeight="900">{symbol}</text>
        <text x="301" y="145" textAnchor="middle" fontSize="11" fill="#64748b">{name}</text>
        <path d="M366 132 H420" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrow)" />
        <circle cx="452" cy="132" r="26" fill="#e2e8f0" />
        <text x="452" y="136" textAnchor="middle" fontSize="10" fontWeight="900">matter</text>
      </svg>
      <div style={{ padding: 12, background: note ? "#f0fdf4" : "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 14, fontSize: 13, lineHeight: 1.55 }}>
        {note ? (
          <>
            <strong>{note.label}.</strong> {note.summary}
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 11 }}>Scope: {note.confidence}</div>
          </>
        ) : (
          <>A curated origin summary has not yet been added for this element. The lab leaves missing astrophysical data visibly missing instead of inferring it from neighboring elements.</>
        )}
      </div>
    </div>
  );
}

export default function ComparativeElementLab({ onBack }) {
  const [selectedZ, setSelectedZ] = useState(79);
  const [activeView, setActiveView] = useState("phi");
  const element = REAL_ELEMENTS.find(([z]) => z === selectedZ) || REAL_ELEMENTS[78];
  const [z, symbol, name, family, period, group, block] = element;
  const phi = phiPoint(z);

  const nearestPhi = useMemo(() => {
    const selected = phiPoint(selectedZ);
    return REAL_ELEMENTS
      .filter(([candidateZ]) => candidateZ !== selectedZ)
      .map((candidate) => ({ candidate, d: distance(selected, phiPoint(candidate[0])) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 6);
  }, [selectedZ]);

  const sameGroup = REAL_ELEMENTS.filter((entry) => entry[5] === group && entry[0] !== z).slice(0, 8);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 20% 10%, #fff7d6 0, #f8f1df 36%, #eef2f7 100%)", color: "#111827", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "22px 18px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.14em", color: "#b45309" }}>PHI369 ELEMENT SPIRAL ATLAS · EXPERIMENTAL MODULE</div>
            <h1 style={{ margin: "6px 0 4px", fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1 }}>Comparative Element Lab</h1>
            <p style={{ maxWidth: 880, margin: 0, color: "#475569", lineHeight: 1.6 }}>
              One element, four representations. Keep the underlying element fixed while comparing standard periodic organization, PHI369 geometry, Russell's historical framework, and modern nucleosynthesis context.
            </p>
          </div>
          {onBack && <button type="button" onClick={onBack} style={pill(false)}>← Back to Atlas</button>}
        </div>

        <div style={{ ...card({ padding: 16, marginTop: 18 }), display: "grid", gridTemplateColumns: "minmax(230px, 0.8fr) minmax(0, 2fr)", gap: 16 }}>
          <div>
            <label htmlFor="element-picker" style={{ display: "block", fontSize: 12, fontWeight: 900, marginBottom: 7 }}>FOLLOW AN ELEMENT</label>
            <select id="element-picker" value={selectedZ} onChange={(e) => setSelectedZ(Number(e.target.value))} style={{ width: "100%", padding: "11px 12px", borderRadius: 14, border: "1px solid #cbd5e1", background: "#fff", fontWeight: 800 }}>
              {REAL_ELEMENTS.map(([ez, es, en]) => <option key={ez} value={ez}>{ez} · {es} · {en}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            <div><div style={{ fontSize: 11, color: "#64748b" }}>Selected</div><strong style={{ fontSize: 20 }}>{symbol} · {name}</strong></div>
            <div><div style={{ fontSize: 11, color: "#64748b" }}>Modern</div><strong>Period {period} · Group {group}</strong></div>
            <div><div style={{ fontSize: 11, color: "#64748b" }}>PHI angle</div><strong>{phi.theta.toFixed(3)}°</strong></div>
            <div><div style={{ fontSize: 11, color: "#64748b" }}>Digital root</div><strong>{digitalRoot(z)}</strong></div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
          {COMPARATIVE_VIEWS.map((view) => (
            <button key={view.id} type="button" onClick={() => setActiveView(view.id)} style={pill(activeView === view.id)}>{view.shortLabel}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) minmax(290px, 0.8fr)", gap: 16 }}>
          <section style={card({ padding: 18 })}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#b45309", textTransform: "uppercase" }}>{COMPARATIVE_VIEWS.find((v) => v.id === activeView)?.status}</div>
                <h2 style={{ margin: "3px 0" }}>{COMPARATIVE_VIEWS.find((v) => v.id === activeView)?.label}</h2>
              </div>
              <div style={{ maxWidth: 460, color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>{COMPARATIVE_VIEWS.find((v) => v.id === activeView)?.description}</div>
            </div>
            {activeView === "modern" && <ModernMap element={element} />}
            {activeView === "phi" && <MiniPhiMap selectedZ={selectedZ} />}
            {activeView === "russell" && <RussellMap selectedZ={selectedZ} />}
            {activeView === "origin" && <OriginMap selectedZ={selectedZ} element={element} />}
          </section>

          <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <div style={card({ padding: 16 })}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#b45309" }}>FIXED ELEMENT RECORD</div>
              <h3 style={{ margin: "5px 0 10px" }}>{z} · {symbol} · {name}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                <div><span style={{ color: "#64748b" }}>family</span><br/><strong>{family}</strong></div>
                <div><span style={{ color: "#64748b" }}>block</span><br/><strong>{block}</strong></div>
                <div><span style={{ color: "#64748b" }}>period</span><br/><strong>{period}</strong></div>
                <div><span style={{ color: "#64748b" }}>group</span><br/><strong>{group}</strong></div>
                <div><span style={{ color: "#64748b" }}>phi radius</span><br/><strong>{phi.r.toFixed(2)}</strong></div>
                <div><span style={{ color: "#64748b" }}>phi angle</span><br/><strong>{phi.theta.toFixed(2)}°</strong></div>
              </div>
            </div>

            <div style={card({ padding: 16 })}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#b45309" }}>PHI NEAREST NEIGHBORS</div>
              <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.45 }}>Pure geometric proximity. It does not imply chemical similarity.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {nearestPhi.map(({ candidate, d }) => (
                  <button key={candidate[0]} type="button" onClick={() => setSelectedZ(candidate[0])} style={pill(false)}>{candidate[1]} · {candidate[0]} <span style={{ opacity: 0.55 }}>d={d.toFixed(1)}</span></button>
                ))}
              </div>
            </div>

            <div style={card({ padding: 16 })}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#b45309" }}>STANDARD GROUP PEERS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                {sameGroup.length ? sameGroup.map((peer) => <button key={peer[0]} type="button" onClick={() => setSelectedZ(peer[0])} style={pill(false)}>{peer[1]} · {peer[0]}</button>) : <span style={{ color: "#64748b", fontSize: 12 }}>No directly encoded peers.</span>}
              </div>
            </div>
          </aside>
        </div>

        <div style={{ ...card({ padding: 18, marginTop: 16 }), display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#b45309" }}>NEXT EXPERIMENT</div>
            <h3 style={{ margin: "5px 0" }}>Representation distance vs. measured similarity</h3>
            <p style={{ color: "#475569", lineHeight: 1.55, marginBottom: 0 }}>
              Compute pairwise distance in PHI geometry and curated Russell topology, then compare those distances against standardized vectors of measured chemical properties. Randomized placements provide the null model. A pretty pattern does not get promoted just because human brains enjoy spirals.
            </p>
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", background: "#111827", color: "#f8fafc", borderRadius: 16, padding: 14, fontSize: 12, lineHeight: 1.55 }}>{`D_phi(i,j) ↔ S_chem(i,j)\nD_russell(i,j) ↔ S_chem(i,j)\n\ncompare against shuffled baselines\nreport effect size + uncertainty`}</pre>
        </div>

        <details style={card({ padding: 16, marginTop: 16 })}>
          <summary style={{ cursor: "pointer", fontWeight: 900 }}>Method / epistemic boundary</summary>
          <p style={{ whiteSpace: "pre-line", color: "#475569", lineHeight: 1.6, marginBottom: 0 }}>{COMPARATIVE_METHOD_NOTE.trim()}</p>
        </details>
      </div>
    </div>
  );
}
