import React from "react";
import ElementSpiralAtlas from "./phi369ElementSpiralAtlas.jsx";

class AtlasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("PHI369 Element Spiral Atlas render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", background: "#f8f1df", color: "#0f172a", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 760, background: "rgba(255,255,255,0.82)", border: "1px solid rgba(217,119,6,0.28)", borderRadius: 22, padding: 24, boxShadow: "0 18px 50px rgba(15,23,42,0.12)" }}>
            <h1 style={{ marginTop: 0 }}>PHI369 Element Spiral Atlas</h1>
            <p>The atlas encountered a runtime render error.</p>
            <p style={{ color: "#64748b" }}>This fallback prevents a blank page while the data/UI issue is fixed.</p>
            <pre style={{ whiteSpace: "pre-wrap", background: "#fff7ed", borderRadius: 12, padding: 12, fontSize: 12, overflow: "auto" }}>
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AtlasErrorBoundary>
      <ElementSpiralAtlas />
    </AtlasErrorBoundary>
  );
}
