# Deployment Organization

This repository now separates the live website from local-only working material.

## Keep in the deployable repo

These are the folders and files that matter for the Next.js site and its hosted assets:

- `src/`
- `public/`
- `local-cms/` if you want the Strapi source alongside the site
- `scripts/`
- `tests/`
- root config files such as `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.js`, `eslint.config.js`, and `playwright.config.js`

## Now treated as local-only workspace material

These have been moved under `workspace/` so they are no longer mixed into the site root:

- `workspace/content/product-pdfs/`
- `workspace/content/final-products/`
- `workspace/content/templates/`
- `workspace/content/Master Blog Posts.md`
- `workspace/content/neurodivers3_master_style_guide.md`
- `workspace/media/polar-store-design-assets/`
- `workspace/media/product-preview-videos/`
- `workspace/artifacts/audit/`
- `workspace/artifacts/screenshots/`
- `workspace/artifacts/temp_store/`
- `workspace/artifacts/AUDIT_REPORT.md`
- `workspace/artifacts/build-output.txt`

## Hosted vs non-hosted assets

Anything inside `public/` is part of the website and can be served publicly.

Anything inside `workspace/` is local working material, packaging input, design source, or generated output. It is not part of the deployed site.

## Script compatibility

The following scripts were updated to use the new `workspace/` layout:

- `scripts/package_products.js`
- `scripts/create_polar_products.js`
- `scripts/upload_medias.js`
- `scripts/generate-spotlane-demos.js`
- `scripts/inspect_pdf.js`
- `scripts/reorganize_bundle.js`
- `scripts/take_all_screenshots.js`
- `scripts/take_review_screenshots.js`

Shared local-only paths now live in `scripts/workspace-paths.js`.