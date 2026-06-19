# GitHub Push Checklist

Use this before pushing the site repo or connecting it to Vercel.

## Files that should stay in GitHub

- `src/`
- `public/`
- `scripts/`
- `tests/`
- `local-cms/` if you want the CMS source in the same repo
- root config files such as `package.json`, `package-lock.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.mjs`, `eslint.config.js`, and `playwright.config.js`
- documentation that explains setup or deployment

## Files that should stay out of GitHub

- everything under `workspace/` except `workspace/README.md`
- `.env.local` and other local env files
- build output such as `.next/`, `dist/`, `coverage/`, and `test-results/`
- large local-only design, packaging, screenshot, audit, and PDF source material

## Before you push

1. Run `git status --short` and make sure only website code, config, docs, and intended public assets are listed.
2. Check `public/` carefully because anything there is deployable and publicly accessible.
3. Confirm no secrets are hardcoded in scripts, config, or source files.
4. Confirm `.env.local` is not staged.
5. Run `npm run build` before connecting the repo to production deployment.

## Secret handling

- Keep `POLAR_ACCESS_TOKEN`, `STRAPI_API_TOKEN`, `RESEND_API_KEY`, and other secrets in `.env.local` or your deployment platform environment settings.
- Do not commit live API tokens into `scripts/`, `src/`, or config files.
- If a token has already appeared in git history, rotate or revoke it before pushing publicly.

## Deployable website boundary

The live site is the Next.js app at the repo root.

Local supporting material has been moved to `workspace/` so it no longer needs to sit beside the deployable app.