# Release Checklist

- [ ] License file present and valid (MIT)
- [ ] README includes claim boundaries and local setup
- [ ] docs/CLAIM_BOUNDARIES.md reviewed
- [ ] No private or sensitive files committed
- [ ] `npm run check` passes
- [ ] Public screenshots placed under `public/screenshots/`
- [ ] GitHub Pages source set to GitHub Actions
- [ ] Deploy Pages workflow succeeds
- [ ] Live demo URL loads
- [ ] Vite base path matches repository name
- [ ] GitHub Actions workflow does not enable npm cache unless package-lock.json exists

## v0.1.0-public-alpha checklist

- [ ] npm install succeeds
- [ ] npm run build succeeds
- [ ] GitHub Pages deployment succeeds
- [ ] Live demo URL loads
- [ ] README includes live demo URL
- [ ] README includes license/deploy badges
- [ ] Claim boundaries are present
- [ ] LICENSE is present
- [ ] RELEASE_NOTES.md exists
- [ ] Screenshots are added, or screenshot placeholder is documented
- [ ] Tag v0.1.0-public-alpha is ready to create

- [ ] Data provenance doc updated
- [ ] Data validation passes without console errors
- [ ] Ghost nodes 119/120 remain labeled future/unconfirmed
- [ ] Data source notes updated
- [ ] Expanded property schema validated
- [ ] Missing fields remain null-safe
- [ ] No invented values added for uncurated fields