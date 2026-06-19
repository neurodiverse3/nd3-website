/**
 * Spotlane Demo Generator
 * Automates PDF page rendering to PNG images and screenshots from Notion pages (URLs),
 * then generates a Spotlane JSON demo file for each.
 */
import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { workspacePaths } from './workspace-paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * DEMO CONFIGURATION
 * Define your demos here. Each demo is an array of sources.
 *
 * Source types:
 * - { type: 'url', url: 'https://...' }          → Notion page or any website
 * - { type: 'pdf', path: '...absolute or relative path...' } → Local PDF file (renders ALL pages to high-quality PNG)
 *
 * Or set `autoScanPdfs` to true to automatically create demos for every PDF in the folder.
 */
const AUTO_SCAN_PDFS = true;           // Automatically scan the PDF folder below
const PDF_FOLDER = workspacePaths.productPdfs;
const MAX_PAGES_PER_PDF = 10;          // Limit pages per PDF (null for all pages)
const VIEWPORT_SCALE = 2.0;            // PNG quality: 1.0 = default, 2.0 = 2x resolution

export const demos = [
  // Example: explicit manual entries
  // {
  //   name: 'my-notion-template',
  //   title: 'My Notion Template',
  //   description: 'Walkthrough of my Notion template.',
  //   sources: [
  //     { type: 'url', url: 'https://oliver-ridsdale.notion.site/...' }
  //   ]
  // }
];

/**
 * Auto-scan the PDF folder and create demo configs for each PDF found.
 */
async function buildDemoConfigsFromPdfs() {
  const pdfFolderPath = PDF_FOLDER;

  let files;
  try {
    files = await fs.readdir(pdfFolderPath);
  } catch {
    console.warn(`  PDF folder not found: ${pdfFolderPath}`);
    return [];
  }

  const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`  Found ${pdfFiles.length} PDF(s) in ${pdfFolderPath}`);

  return pdfFiles.map((file) => {
    // Clean filename for slug: remove extension, version tags, double underscores
    const baseName = file.replace(/\.pdf$/i, '');
    const slug = baseName
      .toLowerCase()
      .replace(/__+/g, '-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Create a friendly title from the filename
    const title = baseName
      .replace(/__/g, ' ')
      .replace(/_/g, ' ')
      .replace(/v\d+\.\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      name: slug,
      title: title || slug,
      description: `Interactive walkthrough of ${title || slug}.`,
      sources: [
        { type: 'pdf', path: path.join(PDF_FOLDER, file) }
      ]
    };
  });
}

/**
 * Generates a UUID v4.
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Screenshot a URL using Playwright.
 */
async function screenshotUrl(browser, url, outputPath) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  // Wait a bit for any lazy loading / animations
  await page.waitForTimeout(2000);
  await page.screenshot({ path: outputPath, fullPage: true });
  await page.close();
  console.log(`  Screenshot saved: ${outputPath}`);
}

/**
 * Convert PDF pages to high-quality PNG images using pdfjs-dist + @napi-rs/canvas.
 * Returns array of file paths to the generated PNGs.
 */
async function renderPdfToImages(pdfPath, outputDir, maxPages = null) {
  const absolutePath = path.resolve(pdfPath);
  const projectRoot = path.resolve(__dirname, '..');

  console.log(`  Rendering PDF: ${path.basename(pdfPath)}`);

  // Dynamically import pdfjs-dist (ESM)
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { createCanvas } = await import('@napi-rs/canvas');

  // Resolve cmaps and standard fonts paths using file:// URLs
  const cMapUrl = 'file:///' + path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'cmaps').replace(/\\/g, '/') + '/';
  const standardFontDataUrl = 'file:///' + path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'standard_fonts').replace(/\\/g, '/') + '/';

  // Read PDF file
  const pdfBuffer = await fs.readFile(absolutePath);

  // Load PDF document
  const pdfDocument = await pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    cMapUrl,
    cMapPacked: true,
    standardFontDataUrl,
    verbosity: 0,
  }).promise;

  const numPages = pdfDocument.numPages;
  const pagesToRender = maxPages ? Math.min(numPages, maxPages) : numPages;

  const outputPaths = [];

  for (let i = 1; i <= pagesToRender; i++) {
    const page = await pdfDocument.getPage(i);
    const viewport = page.getViewport({ scale: VIEWPORT_SCALE });

    // Create canvas
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    // Render PDF page to canvas
    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    // Save as PNG
    const outputFileName = `page-${i}.png`;
    const outputPath = path.join(outputDir, outputFileName);
    const pngBuffer = await canvas.encode('png');
    await fs.writeFile(outputPath, pngBuffer);

    outputPaths.push(outputPath);
    console.log(`  PNG saved: ${outputFileName} (${viewport.width}x${viewport.height}px)`);

    page.cleanup();
  }

  return outputPaths;
}

/**
 * Build a Spotlane demo JSON from screens.
 */
function buildSpotlaneJson(title, description, screenPaths) {
  const screens = screenPaths.map((imagePath, index) => {
    const isLast = index === screenPaths.length - 1;
    const nextId = isLast ? null : `screen-${index + 2}`;

    return {
      id: `screen-${index + 1}`,
      title: `Page ${index + 1}`,
      image: imagePath,
      description: '',
      descriptionPosition: 'bottom',
      hotspots: [
        {
          id: uuid(),
          x: 0.5,
          y: 0.5,
          width: 0.022,
          height: 0.022,
          shape: 'circle',
          label: isLast ? 'End of demo' : 'Next page',
          description: isLast ? 'Thanks for viewing!' : 'Click to continue',
          targetScreenId: nextId,
          color: '#7c6af7',
          rippleScale: 2.6
        }
      ]
    };
  });

  return {
    version: '1.0',
    meta: {
      title,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    startScreenId: 'screen-1',
    screens
  };
}

/**
 * Main generator.
 */
async function generateDemos() {
  const projectRoot = path.resolve(__dirname, '..');
  const outputDir = path.join(projectRoot, 'public', 'spotlane-demos');

  await fs.mkdir(outputDir, { recursive: true });

  // Merge manual configs + auto-scanned PDFs
  let allDemos = [...demos];
  if (AUTO_SCAN_PDFS) {
    const autoDemos = await buildDemoConfigsFromPdfs();
    allDemos = allDemos.concat(autoDemos);
  }

  if (allDemos.length === 0) {
    console.log('No demos configured. Set AUTO_SCAN_PDFS=true or add entries to the `demos` array.');
    return;
  }

  console.log(`\nGenerating ${allDemos.length} demo(s)...\n`);

  // For URLs we still need Playwright; PDFs are handled by pdfjs-dist
  const hasUrls = allDemos.some(d => d.sources.some(s => s.type === 'url'));
  let browser;
  if (hasUrls) {
    console.log('Launching browser for URL screenshots...');
    browser = await chromium.launch();
  }

  for (const demo of allDemos) {
    console.log(`Generating demo: "${demo.name}"`);
    const demoDir = path.join(outputDir, demo.name);
    await fs.mkdir(demoDir, { recursive: true });

    const screenPaths = [];

    for (const source of demo.sources) {
      if (source.type === 'url') {
        const outputPath = path.join(demoDir, `screen-${screenPaths.length + 1}.png`);
        await screenshotUrl(browser, source.url, outputPath);
        screenPaths.push(`/spotlane-demos/${demo.name}/screen-${screenPaths.length + 1}.png`);
      } else if (source.type === 'pdf') {
        const pngPaths = await renderPdfToImages(source.path, demoDir, MAX_PAGES_PER_PDF);
        for (const p of pngPaths) {
          const relativePath = `/spotlane-demos/${demo.name}/${path.basename(p)}`;
          screenPaths.push(relativePath);
        }
      }
    }

    const spotlaneJson = buildSpotlaneJson(demo.title, demo.description, screenPaths);
    const jsonPath = path.join(demoDir, 'demo.json');
    await fs.writeFile(jsonPath, JSON.stringify(spotlaneJson, null, 2));
    console.log(`  Spotlane JSON saved: ${jsonPath}\n`);
  }

  if (browser) {
    await browser.close();
  }

  console.log('All demos generated!');
  console.log(`Output directory: ${outputDir}`);
  console.log('\nView your demos at:');
  for (const demo of allDemos) {
    console.log(`  /demos/interactive/${demo.name}`);
  }
}

// Run if called directly
if (process.argv[1] === __filename || process.argv[1] === fileURLToPath(import.meta.url)) {
  generateDemos().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

export default generateDemos;
