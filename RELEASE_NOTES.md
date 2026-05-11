# Release Notes

## v3.0.0-electron-config-complete

Electron Configuration Completion milestone.

### Highlights

- Completed electronConfiguration coverage for confirmed elements 1–118.
- Preserved elements 119 and 120 as future/unconfirmed ghost placeholders with null electronConfiguration.
- Added sourceRefs.electronConfiguration for confirmed elements.
- Added sourceNotes caveats for selected actinide/superheavy entries.
- Updated curation status to schema 3.0.
- Added validation rules enforcing confirmed-element coverage and ghost-node null boundaries.
- Added regression checks for key actinide and superheavy reference values.
- Preserved runtime safety features:
  - static boot fallback
  - React error boundary
  - copyable error diagnostics
  - reload control
  - global runtime logs
  - source maps
  - array-safe rendering posture

### Data Boundary

electronConfiguration is now complete for confirmed elements 1–118 in the public-alpha dataset, but actinide and superheavy configurations may vary by source notation or model. These values are staged curated display data and should be verified against source references before being treated as authoritative.

Elements 119 and 120 remain future/unconfirmed placeholders.

### Validation

This release should pass:

```bash
npm test
npm run build
npm run check
npm run diagnose
```


## v0.1.0-public-alpha

Initial public alpha of PHI369 Element Spiral Atlas.

### Includes

- Vite + React public demo
- GitHub Pages deployment
- MIT License
- Claim-boundary documentation
- Golden-angle / Fibonacci seed-field view
- Spiral-ribbon view
- Standard periodic-table reference view
- Chemical-family overlay
- 369 / digital-root harmonic lens
- Scientific-property heatmap overlays
- Search by element name, symbol, or atomic number
- Selected-element detail panel
- Superheavy placeholders for elements 119 and 120
- Data completeness meter
- Export to SVG, PNG, and JSON
- Pattern scanner
- Comparison lens
- Isotope preview
- Superheavy runway
- Resonance graph
- Insight engine
- Research notebook
- Research lab / correlation lab
- v2.0.1 visual-balance pass

### Claim Boundary

This release is an experimental visualization and research-notebook interface. It does not replace the standard periodic table, does not claim discovery of new elements, and does not claim that Fibonacci/369 geometry proves chemistry or nuclear physics.
