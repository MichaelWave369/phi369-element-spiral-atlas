# Data Provenance

PHI369 Element Spiral Atlas currently uses two layers of element data:

## 1. Element identity data

The base element list contains:
- atomic number
- chemical symbol
- element name
- chemical family
- period
- group
- electron block

Elements 119 and 120 are included only as future/unconfirmed ghost placeholders.

## 2. Seeded scientific property data

The current property layer is intentionally incomplete and used as a seed dataset for interface development.

Seeded properties include:
- atomic mass
- electronegativity
- first ionization energy
- density
- stability flag
- discovery year

Missing values are represented as null.

## Important boundary

The current scientific-property layer should not be treated as a complete authoritative dataset.

Future versions should add curated data sources, citations, uncertainty notes, and validation fixtures.

The atlas does not claim discovery of new elements and does not replace the standard periodic table.


## Expanded v2.2 schema

v2.2 expands the property schema to prepare for future curation. New supported fields include:
- melting point K
- boiling point K
- phase at STP
- occurrence
- electron configuration
- stable isotope count
- standard atomic weight note
- half-life
- decay mode

These fields may remain null until curated values are added.
