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


## v2.6.3 Runtime Safety
- Improve error-boundary fallback copy
- Add reload and copy-error controls
- Document runtime safety model
- Preserve source maps for debugging
- Confirm array-safe rendering posture


## v2.7 Electron Configuration Batch 2
- Expand electronConfiguration coverage through Kr
- Preserve Cr/Cu ground-state exception values
- Add sourceRefs for covered batch
- Add validation tests for coverage and exception values

## v2.8 Electron Configuration Batch 3
- Expand electronConfiguration coverage through Xe
- Add additional exception regression checks
- Continue staged sourceRefs and sourceNotes


## v2.8 Electron Configuration Batch 3
- Expand electronConfiguration coverage through Xe
- Preserve Nb/Mo/Ru/Rh/Pd/Ag configuration values
- Add sourceRefs for covered batch
- Add validation tests for coverage and exception values

## v2.9 Electron Configuration Batch 4
- Expand electronConfiguration coverage through Rn
- Add lanthanide/f-block boundary notes if needed
- Continue staged sourceRefs and sourceNotes
- Add additional exception regression checks


## v2.9 Electron Configuration Batch 4
- Expand electronConfiguration coverage through Rn
- Preserve key lanthanide/heavy-element configuration values
- Add sourceRefs for covered batch
- Add sourceNotes for f-block and exception/reference entries
- Add validation tests for coverage and key values

## v3.0 Electron Configuration Completion
- Expand electronConfiguration coverage through Og
- Keep 119/120 ghost placeholders null-safe
- Add actinide/superheavy notation notes
- Add additional exception regression checks
- Prepare data status for full electronConfiguration coverage


## v3.0 Electron Configuration Completion
- Complete electronConfiguration coverage for confirmed elements 1–118
- Keep 119/120 ghost placeholders null-safe
- Add actinide/superheavy caveat notes
- Add sourceRefs for confirmed elements
- Add regression tests for key values and ghost boundaries

## v3.1 Data Quality Review
- Add per-batch retrieval-date notes
- Add notation-difference notes for actinides/superheavy elements
- Add optional data review table
- Audit sourceRefs coverage
- Begin next curated field family after electronConfiguration
