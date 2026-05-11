# Runtime Safety

PHI369 Element Spiral Atlas uses runtime safeguards to prevent blank-page failures in the public demo.

## Safeguards

- Static loading fallback in index.html
- React error boundary around the atlas app
- Visible runtime error fallback with stack details
- Global browser error and unhandled-rejection logging
- Null-safe rendering for sparse/incomplete data
- Array-safe render helpers for workbench panels
- Vite source maps enabled for deployed debugging

## Why this matters

The atlas contains many panels driven by evolving scientific-data structures. During public-alpha development, data-shape changes can create render-time issues even when build and test checks pass.

Runtime safeguards make these failures visible and debuggable instead of producing a blank white page.

## Public boundary

Runtime errors are software issues, not scientific claims. If an error appears, it should be treated as a UI/data-shape bug and not as a statement about the periodic table, PHI369 geometry, chemistry, or nuclear physics.

## Debug checklist

If the deployed page fails:

1. Confirm the visible build version.
2. Copy the error details from the fallback UI.
3. Check the browser console.
4. Confirm GitHub Pages deployed the newest commit.
5. Run `npm test`.
6. Run `npm run build`.
7. Run `npm run check`.
8. Inspect source maps if the stack points into a bundled asset.
