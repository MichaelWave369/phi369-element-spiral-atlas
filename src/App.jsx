import React from "react";
import ElementSpiralAtlas from "./phi369ElementSpiralAtlas.jsx";

const BUILD_LABEL = "v2.6.3";

class AtlasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("PHI369 Element Spiral Atlas render error:", error, info);
    this.setState({ error, info });
  }

  handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  handleCopyErrorDetails = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    const payload = {
      build: BUILD_LABEL,
      errorMessage: String(this.state.error?.message || this.state.error || "Unknown runtime error"),
      errorStack: this.state.error?.stack || null,
      componentStack: this.state.info?.componentStack || null,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      url: typeof window !== "undefined" ? window.location?.href : null,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    } catch {
      // no-op fallback for blocked clipboard environments
    }
  };

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", background: "#f8f1df", color: "#0f172a", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 760, background: "rgba(255,255,255,0.82)", border: "1px solid rgba(217,119,6,0.28)", borderRadius: 22, padding: 24, boxShadow: "0 18px 50px rgba(15,23,42,0.12)" }}>
            <h1 style={{ marginTop: 0 }}>PHI369 Element Spiral Atlas</h1>
            <p>The atlas encountered a runtime render error.</p>
            <p style={{ color: "#64748b" }}>The React error boundary prevented a blank page and keeps this failure visible for debugging.</p>
            <p style={{ color: "#64748b" }}>The stack details below help isolate the UI/runtime bug. This is not a scientific/data claim issue.</p>
            <p style={{ margin: "8px 0", fontSize: 12, color: "#475569" }}>Build: {BUILD_LABEL}</p>
            <div style={{ display: "flex", gap: 8, margin: "8px 0 14px" }}>
              <button type="button" onClick={this.handleReload} style={{ border: "1px solid rgba(148, 163, 184, 0.65)", background: "#ffffff", color: "#111827", borderRadius: 999, padding: "7px 12px", fontSize: 12, cursor: "pointer" }}>
                Reload page
              </button>
              <button type="button" onClick={this.handleCopyErrorDetails} style={{ border: "1px solid rgba(148, 163, 184, 0.65)", background: "#ffffff", color: "#111827", borderRadius: 999, padding: "7px 12px", fontSize: 12, cursor: "pointer" }}>
                Copy error details
              </button>
            </div>
            <pre style={{ whiteSpace: "pre-wrap", background: "#fff7ed", borderRadius: 12, padding: 12, fontSize: 12, overflow: "auto" }}>
              {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
            </pre>
            {this.state.info?.componentStack && (
              <pre style={{ whiteSpace: "pre-wrap", background: "#f8fafc", borderRadius: 12, padding: 12, fontSize: 12, overflow: "auto" }}>
                {this.state.info.componentStack}
              </pre>
            )}
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
