import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    console.error("PHI369 global error:", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("PHI369 unhandled rejection:", event.reason);
  });
}

console.info("PHI369 Element Spiral Atlas boot", { version: "2.6.3" });

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
