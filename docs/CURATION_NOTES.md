# Curation Notes

v2.3 begins the curated dataset foundation for PHI369 Element Spiral Atlas.

## Current approach

The project separates:
- element identity data
- property seed data
- property source registry
- curation status registry
- validation logic

## v2.3 seed additions

v2.3 adds limited phase-at-STP and occurrence seed values for:
- elements 1–18
- selected reference elements already seeded in the property layer
- ghost placeholders 119 and 120

These values are intentionally limited. The goal is to prove the curation workflow, not to complete the dataset in one pass.

## Boundaries

Missing values remain null.

No values should be guessed.

Future full-data passes should add citations, source retrieval dates, units, uncertainty notes, and validation fixtures.

## v2.5 Data Batch 1

v2.5 expands simplified phase-at-STP and occurrence coverage.

Scope:
- phaseAtSTP and occurrence for confirmed elements 1–118
- occurrence labels for 119/120 as future-unconfirmed
- sourceRefs for phaseAtSTP and occurrence

Boundary:
This is a simplified public-alpha classification. Future versions may refine occurrence categories such as trace-natural, primordial, decay-chain, or synthetic-only.

## v2.6 Data Batch 2

v2.6 adds:
- source retrieval metadata in the property source registry
- sourceNotes schema support
- limited electron-configuration seed batch for elements 1–18

Boundary:
Electron configurations remain incomplete outside elements 1–18. Missing values remain null and should not be guessed.
