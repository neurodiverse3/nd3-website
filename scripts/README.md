# Interactive Demo Generator

This script automatically generates interactive product demos from your Notion pages and PDFs using the open-source [Spotlane](https://spotlane.dev) format.

## How It Works

1. **PDFs** → High-quality PNG images using `pdfjs-dist` + `@napi-rs/canvas` (no browser needed, no external dependencies)
2. **Notion pages** → Screenshots via Playwright (requires browser for web rendering)
3. **JSON generation** → A Spotlane demo file is created with screens, hotspots, and navigation
4. **Embed** → The `SpotlaneViewer` React component renders the interactive walkthrough on your site

## Usage

### 1. Auto-scan PDFs (default)

The script automatically scans `workspace/content/product-pdfs` and creates demos for every PDF found:

```bash
npm run generate-demos
```

### 2. Manual configuration

Edit `scripts/generate-spotlane-demos.js` to add Notion URLs or customize settings:

```js
export const demos = [
  {
    name: 'my-notion-template',
    title: 'My Notion Template',
    description: 'Walkthrough of my Notion template.',
    sources: [
      { type: 'url', url: 'https://oliver-ridsdale.notion.site/...' }
    ]
  }
];
```

**Notion pages** must be public ("Share to web" enabled).

### 3. Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `AUTO_SCAN_PDFS` | `true` | Automatically scan the PDF folder |
| `PDF_FOLDER` | `workspace/content/product-pdfs` | Where to look for PDFs |
| `MAX_PAGES_PER_PDF` | `10` | Max pages per demo (set `null` for all) |
| `VIEWPORT_SCALE` | `2.0` | PNG quality multiplier (1.0 = default, 2.0 = 2x resolution) |

### 4. View the demos

Visit the demo at:

```
https://yourdomain.com/demos/interactive/{slug}
```

For example: `/demos/interactive/nd3-weeklyplanner-printable-v1-0`

Or use the `SpotlaneViewer` component directly:

```jsx
import SpotlaneViewer from "@/components/SpotlaneViewer";

<SpotlaneViewer slug="nd3-weeklyplanner-printable-v1-0" />
```

## Customizing Hotspots

After generating, edit the `demo.json` to:
- Reposition hotspots (`x`, `y` coordinates are 0–1 fractions)
- Change labels and descriptions
- Add branching paths (different `targetScreenId` values)
- Adjust colors and ripple effects

## File Structure

```
scripts/
  generate-spotlane-demos.js     # Automation script
src/
  components/
    SpotlaneViewer.jsx           # React demo player
  app/
    demos/
      interactive/
        [slug]/
          page.jsx               # Demo page route
public/
  spotlane-demos/
    {name}/
      demo.json                  # Generated demo data
      page-1.png                 # High-quality PNG renders
      page-2.png
      ...
```

## Technical Details

- **PDF rendering** uses `pdfjs-dist` (Mozilla's PDF.js) with `@napi-rs/canvas` for hardware-accelerated rendering
- **No external dependencies** like `pdftoppm`, ImageMagick, or GraphicsMagick needed
- **Notion pages** still use Playwright for accurate web rendering
- **Output quality** is 2x A4 resolution (approx. 1190×1684 pixels at `VIEWPORT_SCALE: 2.0`)
- **All platforms** supported thanks to `@napi-rs/canvas` pre-built binaries
