import React, { useMemo } from "react";
import { ELEMENTS } from "./data/elementsBase.js";
import {
  nearestPhiNeighbors,
  periodicGroupPeers,
  COMPARATIVE_EXPERIMENT_CONTRACT,
} from "./lib/comparativeAnalysis.js";

const CONFIRMED_ELEMENTS = ELEMENTS.filter(([z]) => z <= 118);

function card(extra = {}) {
  return {
    background: "rgba(255,255,255,0.80)",
    border: "1px solid rgba(217,119,6,0.22)",
    borderRadius: 22,
    boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
    padding: 18,
    ...extra,
  };
}

function chipStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid rgba(148,163,184,0.45)",
    background: "#fff",
    borderRadius: 999,
    padding: "6px 9px",
    fontSize: 12,
    color: "#334155",
  };
}

function ElementChip({ entry, detail }) {
  const [z, symbol, name] = entry;
  return (
    <span style={chipStyle()} title={name}>
      <b style={{ color: "#111827" }}>{symbol}</b>
      <span>Z={z}</span>
      {detail ? <span style={{ color: "#94a3b8" }}>{detail}</span> : null}
    </span>
  );
}

export default function ComparativeRelationshipAnalysis({ selectedZ }) {
  const element = useMemo(
    () => CONFIRMED_ELEMENTS.find(([z]) => z === selectedZ) || CONFIRMED_ELEMENTS[0],
    [selectedZ]
  );
  const [z, symbol, name, , , group] = element;
  const neighbors = useMemo(() => nearestPhiNeighbors(CONFIRMED_ELEMENTS, z, 6), [z]);
  const peers = useMemo(() => periodicGroupPeers(CONFIRMED_ELEMENTS, z), [z]);

  return (
    <section style={{ marginTop: 16 }}>
      <div style={{ ...card(), marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: "#b45309", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          v3.1.1 relationship analysis
        </div>
        <h2 style={{ margin: "6px 0 6px", fontSize: 23 }}>What is {symbol} close to, and under which representation?</h2>
        <p style={{ margin: 0, maxWidth: 980, color: "#64748b", fontSize: 13, lineHeight: 1.55 }}>
          {name} stays fixed as Z={z}. The lists below deliberately separate geometric neighbors in the PHI369 projection from conventional periodic-group peers so visual proximity cannot silently inherit chemical meaning.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <article style={card()}>
          <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Nearest PHI spiral neighbors</h3>
          <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>
            Ranked only by Euclidean distance in the golden-angle projection. This is a computed geometric relationship, not a chemistry claim.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {neighbors.map(({ entry, distance }) => (
              <ElementChip key={entry[0]} entry={entry} detail={`Dφ=${distance.toFixed(3)}`} />
            ))}
          </div>
        </article>

        <article style={card()}>
          <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Standard group peers</h3>
          <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>
            Confirmed elements sharing conventional periodic group {group}. These are reference-table peers, not selected by PHI distance.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {peers.length ? peers.map((entry) => <ElementChip key={entry[0]} entry={entry} />) : <span style={{ color: "#94a3b8", fontSize: 12 }}>No comparable confirmed group peers in the current identity table.</span>}
          </div>
        </article>
      </div>

      <article style={{ ...card(), marginTop: 16 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>Representation-distance experiment</h3>
        <p style={{ margin: "0 0 12px", color: "#475569", fontSize: 13, lineHeight: 1.55 }}>
          <b>Question:</b> {COMPARATIVE_EXPERIMENT_CONTRACT.question}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          {[
            ["PHI distance", COMPARATIVE_EXPERIMENT_CONTRACT.phiDistance],
            ["Russell distance", COMPARATIVE_EXPERIMENT_CONTRACT.russellDistance],
            ["Chemical similarity", COMPARATIVE_EXPERIMENT_CONTRACT.chemicalSimilarity],
            ["Null / controls", COMPARATIVE_EXPERIMENT_CONTRACT.nullModel],
          ].map(([label, text]) => (
            <div key={label} style={{ border: "1px solid rgba(148,163,184,0.24)", borderRadius: 14, padding: 12, background: "#f8fafc" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 900, color: "#94a3b8" }}>{label}</div>
              <div style={{ marginTop: 5, fontSize: 12, lineHeight: 1.5, color: "#475569" }}>{text}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 11, borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", fontSize: 12, lineHeight: 1.5 }}>
          <b>Authority boundary:</b> {COMPARATIVE_EXPERIMENT_CONTRACT.authority}
        </div>
      </article>
    </section>
  );
}
