# Data Sources

PHI369 Element Spiral Atlas currently uses a seeded scientific-property dataset for interface development.

Future full-data curation should prefer public, authoritative references such as:

- IUPAC Periodic Table of the Elements
- NIST Chemistry WebBook
- Royal Society of Chemistry Periodic Table
- Los Alamos National Laboratory element references
- PubChem element data
- Peer-reviewed nuclear/isotope datasets for half-life and decay modes

## Source discipline

Future property additions should record:
- source name
- source URL or citation
- retrieval date
- field name
- unit
- uncertainty or note if applicable

## Current status

The current public alpha data is not yet a complete authoritative scientific database.

Missing fields are represented as null.

Elements 119 and 120 are included only as future/unconfirmed ghost placeholders.


## v2.3 source registry

The codebase now includes src/data/propertySources.js as the source registry for intended curation references.

Source ids currently include:
- iupac
- rsc
- nist
- pubchem

## v2.5 batch notes

phaseAtSTP and occurrence sourceRefs use:
- rsc
- pubchem
- iupac where applicable for occurrence/identity boundaries

Future versions should add retrieval dates and per-field citations.

## v2.6 source metadata

The source registry now tracks:
- retrievalDate
- licenseNote

These fields support future data-review and redistribution discipline.


## v2.7 electron configuration sources

electronConfiguration batch values reference:
- rsc
- pubchem

Future versions should add per-field retrieval dates and source-specific notes.


## v2.8 electron configuration sources

electronConfiguration batch values reference:
- rsc
- pubchem

Future versions should add per-field retrieval dates and source-specific notes.


## v2.9 electron configuration sources

electronConfiguration batch values reference:
- rsc
- pubchem

Lanthanide and heavy-element notation may vary by source. Future versions should add per-field retrieval dates, source-specific notes, and source-difference notes.


## v3.0 electron configuration completion sources

electronConfiguration completion values reference:
- rsc
- pubchem

Actinide and superheavy notation may vary by source or prediction model. Future versions should add source-specific notes, retrieval dates per field batch, and notation-difference notes.
