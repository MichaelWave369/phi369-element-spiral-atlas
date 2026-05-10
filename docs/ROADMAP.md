# Public Alpha Roadmap

## v0.1 Public Alpha
- Repository skeleton and licensing
- React + Vite app shell
- Initial atlas component integration
- Claim-boundary and science-note docs

## v0.2 Visualization Expansion
- Golden-angle atlas interactions
- Overlay toggles and filters
- Element detail and isotope preview improvements

## v0.3 Research Lab Features
- Notebook persistence
- Export pipeline (SVG/PNG/JSON)
- Lab report compiler and shareable bundles

## v2.1 Data Core
- Extract base element data into src/data/elementsBase.js
- Extract seeded property data into src/data/propertySeeds.js
- Extract constants and metadata
- Add data validation module
- Add data provenance documentation


## v2.2 Schema Expansion
- Add expanded property schema
- Add source-prep documentation
- Add numeric metadata for melting/boiling/stable-isotope count
- Improve completeness reporting for future data fields

## v2.3 Curated Dataset Pass
- Begin filling complete 118-element property data
- Add citations per data field
- Add uncertainty/source notes
- Add data fixtures and validation tests


## v2.3 Curated Dataset Foundation
- Add property source registry
- Add curation status registry
- Add limited phase/occurrence seed layer
- Add source-ref validation
- Add curation notes

## v2.4 Dataset Fixtures
- Add fixture tests for data schema
- Add curated values in batches
- Add source retrieval dates
- Add per-field uncertainty notes

## v2.5 Data Batch 1
- Fill simplified phase-at-STP coverage for confirmed elements
- Fill simplified occurrence classification
- Add sourceRefs for phase/occurrence
- Add validation tests for coverage
- Preserve 119/120 ghost-node boundaries

## v2.6 Data Batch 2
- Add retrieval-date metadata
- Refine occurrence categories
- Begin electron-configuration batch
- Add per-field source notes

## v2.6 Data Batch 2
- Add source retrieval metadata
- Add sourceNotes schema support
- Add limited electron-configuration batch for elements 1–18
- Add validation/tests for source metadata and electronConfiguration batch

## v2.7 Electron Configuration Batch 2
- Expand electronConfiguration coverage beyond Ar
- Add source notes and retrieval dates per batch
- Add fixture tests for expanded coverage
- Keep null-safe incomplete fields
