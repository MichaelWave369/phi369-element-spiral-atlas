# Deployment

This project deploys to GitHub Pages using GitHub Actions.

## Live URL

https://michaelwave369.github.io/phi369-element-spiral-atlas/

## GitHub Pages settings

In the repository:

1. Go to Settings
2. Go to Pages
3. Set Build and deployment source to GitHub Actions

## Vite base path

Because this is a project page, vite.config.js must use:

```js
base: "/phi369-element-spiral-atlas/"
```

## Troubleshooting

If the workflow fails with “Dependencies lock file is not found,” remove npm caching from actions/setup-node or commit a package-lock.json. This public-alpha workflow intentionally avoids caching until a lockfile is committed.


## Troubleshooting

If the deployed page is blank:
- open browser devtools console
- check for runtime TypeError or missing asset 404
- verify Vite base path is /phi369-element-spiral-atlas/
- verify the React error boundary is rendering any crash message


## Runtime fallback

The app includes a React error boundary and static boot fallback. If GitHub Pages shows an atlas error card instead of the app, copy the error details and inspect the browser console. This is usually a UI/data-shape issue, not a Pages deployment failure.

See [Runtime Safety](./RUNTIME_SAFETY.md).
