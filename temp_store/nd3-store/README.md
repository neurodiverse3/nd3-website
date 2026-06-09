# neurodivers³ Store — Next.js build pack

Finalised, launch-ready React/Next.js (App Router) components for the `/store`
landing page and the `/store/[slug]` product listing template, wired to the
**Polar** checkout and conformed to the neurodivers³ voice rules.

## What's in here

```
nd3-store/
├─ app/store/page.tsx            # Store landing ("Store · The Toolkit.")
├─ app/store/[slug]/page.tsx     # Product listing template (8 products, static params)
├─ components/store/ProductCard.tsx
├─ components/store/CheckoutButton.tsx
├─ data/products.ts              # Single source of truth for all 8 listings
├─ lib/site.ts                   # Brand constants + voice rules + refund lines
├─ types/next-shims.d.ts         # Offline typecheck only — DELETE in your repo
└─ tsconfig.json
```

## Dropping it into your repo

1. Copy `app/`, `components/`, `data/`, and `lib/` into your project root
   (they assume the `@/*` path alias → project root; adjust imports if yours
   differs).
2. **Delete `types/next-shims.d.ts`** — it only exists so this folder
   typechecks in isolation. Your real `next` package provides `next/link` and
   `next/navigation`.
3. Add cover images to `public/store/covers/` using the filenames in
   `data/products.ts` (e.g. `nd3-store-cover-dopamine-menu-template-1280.png`).
4. Swap `next/image` in if you prefer — the cards/pages currently use plain
   `<img>` for portability.

A `nd3-store.patch` git patch is included alongside this folder if you'd rather
apply it in one step (`git apply nd3-store.patch`).

## Design tokens

The components use four CSS variables. Add these to your global stylesheet (or
map them to your existing Tailwind theme):

```css
:root {
  --nd3-void: #0a0a0b;   /* page / image background */
  --nd3-card: #121214;   /* card surface */
  --nd3-pink: #ff2d8e;   /* flat brand pink accent */
}
```

Styling uses Tailwind utility classes (with a few `[var(--nd3-*)]` arbitrary
values). If you're not on Tailwind, the class names map cleanly to plain CSS.

## ⚠️ Before launch

- **Replace checkout links.** Every `checkoutUrl` in `data/products.ts` is a
  `https://buy.polar.sh/REPLACE-*` placeholder. Paste the real Polar product
  links (production org, not sandbox).
- **Confirm prices** match Polar, covers, and the delivered files (£5 / £7 /
  £19 / Free).
- **Refund line** appears on every product page + CTA cluster — keep it.

## Voice rules baked in (do not regress)

- Price label renders as `// £X`, never “INVESTMENT RATE”.
- CTA reads `Launch special · £X` (paid) or `Get it free` (lead magnet), never
  “SECURE THIS RESOURCE”.
- Pillar tag top-left on every cover; no “BEST SELLER” / “PREMIUM” /
  “instant access” hype chips.
- Hero title is `STORE · THE TOOLKIT.`
- `Refundable for 14 days, no questions.`

## What this fixes vs. the current live build

| Area | Current build | This build |
|---|---|---|
| Products | 3 placeholders incl. “Exec-Function Dashboard” | 8 finalised listings + free lead magnet |
| Prices | £7 / £12 / £15 | £5 / £7 / £19 launch structure |
| Price label | “INVESTMENT RATE” | `// PRICE` |
| CTA | “SECURE THIS RESOURCE” | `Launch special · £X` / `Get it free` |
| Chips | “BEST SELLER” / “AUTISM TOOLKIT” | Pillar tag only |
| Hero | “THE · TOOLKIT” | “STORE · THE TOOLKIT.” |
| Refund | absent | on every page + CTA |
