# PHI369 Element Spiral Atlas

A golden-angle / Fibonacci periodic-table visualization and research-lab interface for exploring chemical families, modular 369 groupings, isotope previews, superheavy frontier nodes, scientific-property overlays, and comparative representations of elemental structure and origin.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy Pages](https://github.com/MichaelWave369/phi369-element-spiral-atlas/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/MichaelWave369/phi369-element-spiral-atlas/actions/workflows/deploy-pages.yml)

## Live Demo

https://michaelwave369.github.io/phi369-element-spiral-atlas/

## Screenshot

> Screenshot coming soon.

## What this is

PHI369 Element Spiral Atlas is an experimental visual research interface that remaps the periodic table into alternate coordinate systems:

- Golden-angle / Fibonacci seed-field projection
- Spiral-ribbon projection
- Standard periodic-table reference view
- 3 / 6 / 9 modular grouping overlays
- Scientific-property heatmaps
- Superheavy frontier placeholders for elements 119 and 120
- Isotope-preview tools
- Resonance graph relationships
- Research notebook / lab-report exports
- Comparative Element Cosmology Lab for synchronized cross-model inspection

## What this is not

This project does not replace the standard periodic table.

This project does not claim discovery of new elements.

This project does not claim that Fibonacci, golden-angle, or 369 geometry proves chemical or nuclear behavior.

Historical models such as Walter Russell's 1926 ten-octave framework are presented as historical models unless a claim is independently supported by modern evidence.

This project is a visualization and research-notebook tool for exploring patterns, asking better questions, and comparing projections against known scientific data.

## Features

- Golden-angle element placement
- 369 harmonic root-family lens
- Chemical-family coloring
- Period, block, stability, frontier, and property overlays
- Search by element name, symbol, or atomic number
- Element detail panel
- Pattern scanner
- Resonance graph
- Isotope preview
- Superheavy runway
- Research notebook
- Export to SVG, PNG, and JSON
- Lab report compiler
- Comparative Element Cosmology Lab
- “Follow an element” cross-model workflow
- Explicit evidence/authority labels for modern reference data, experimental geometry, historical models, and modern astrophysics

## Comparative Element Cosmology Lab

The v3.1 research module lets one element be followed across four representations while keeping the evidence boundary visible:

1. **Modern periodic reference** — period, group, block, family, and curated atlas properties.
2. **PHI369 spiral projection** — golden-angle coordinate, radial coordinate, and digital-root lens.
3. **Walter Russell 1926** — source-attributed historical framework. Element-level mappings remain `not curated` until transcribed from a primary source.
4. **NASA nucleosynthesis** — simplified source-backed origin summaries. Missing classifications remain `not curated` rather than being inferred.

The module is designed around a simple rule: the element identity is fixed while the representation changes. Geometry, historical placement, and origin models therefore cannot silently overwrite the underlying scientific record.

Initial source-backed seeds include NASA summaries for H, C, O, Fe, and Au, plus Russell's explicit Chapter VI statement describing carbon as a dividing point in his ten-octave cycle.

## Local development

```bash
npm install
npm run dev
```

## Live demo deployment

GitHub Pages is configured to deploy from GitHub Actions using the repository workflow.

## Data status

The current public alpha uses a seeded scientific-property dataset for interface development. Missing values are shown as unknown/null. See docs/DATA_PROVENANCE.md for data boundaries and future data-curation plans.

v2.2 expands the property schema for future curated data sources. The app remains null-safe: missing fields render as unknown rather than being guessed.

See docs/DATA_SOURCES.md.

v2.3 adds a source registry and curation-status registry. It begins a limited curated seed layer for phase-at-STP and occurrence while preserving null-safe behavior for incomplete fields.

See docs/CURATION_NOTES.md and docs/DATA_SOURCES.md.

## Validation

The project includes lightweight Node-based validation tests for:
- element identity data
- ghost-node boundaries
- property schema keys
- source references
- atlas math helpers
- comparative-model authority boundaries
- comparative-model source-backed seed constraints

Run:

```bash
npm test
```

Pull requests also run `npm test` and `npm run build` in GitHub Actions.

v2.5 adds simplified phase-at-STP and occurrence coverage for confirmed elements, with sourceRefs and validation tests. Future versions may refine occurrence categories.

v2.6 adds source retrieval metadata and a limited electron-configuration seed batch for elements 1–18. Electron configurations for later elements remain null until curated.

## Runtime safety

The public demo includes a static loading fallback, React error boundary, and source maps so runtime data-shape issues can be debugged instead of producing a blank page.

See docs/RUNTIME_SAFETY.md.

v2.7 expands electronConfiguration coverage through element 36 (Kr), with sourceRefs and tests. Later elements remain null-safe until curated.

v2.8 expands electronConfiguration coverage through element 54 (Xe), with sourceRefs and regression tests for key transition-metal configurations. Later elements remain null-safe until curated.

v2.9 expands electronConfiguration coverage through element 86 (Rn), with sourceRefs and regression tests for key lanthanide/heavy-element configurations. Later elements remain null-safe until curated.

v3.0 completes electronConfiguration coverage for confirmed elements 1–118, with sourceRefs and regression tests. Elements 119 and 120 remain future/unconfirmed ghost nodes with null electronConfiguration. Actinide and superheavy configurations should be treated as staged display data pending further source-specific review.

v3.0 marks electronConfiguration as the first complete curated field family for confirmed elements 1–118. Elements 119 and 120 remain future/unconfirmed ghost placeholders with null electronConfiguration. Actinide and superheavy configurations remain staged display data pending future source-specific review.

## Current milestone

Current milestone: `v3.1.0-comparative-cosmology-lab`

The v3.1 milestone adds a source-disciplined comparative layer without changing the core atlas's scientific boundary: one element can be inspected across modern chemistry, PHI369 geometry, Russell's historical model, and modern nucleosynthesis while unknown data remains explicitly uncurated.
