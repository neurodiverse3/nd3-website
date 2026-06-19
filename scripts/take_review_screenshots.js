import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { workspacePaths } from './workspace-paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function run() {
  const reviewsDir = path.join(workspacePaths.screenshots, 'reviews');
  if (!fs.existsSync(reviewsDir)) {
    fs.mkdirSync(reviewsDir, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await chromium.launch();

  const captures = [
    // Blog page in 3 styles/themes
    {
      name: 'blog_page_void.png',
      path: '/blog',
      theme: 'void'
    },
    {
      name: 'blog_page_parchment.png',
      path: '/blog',
      theme: 'parchment'
    },
    {
      name: 'blog_page_incubation.png',
      path: '/blog',
      theme: 'incubation'
    },
    // 3 different blog posts in 3 different themes
    {
      name: 'post_47_tabs_hyperfocus_void.png',
      path: '/blog/47-tabs-hyperfocus',
      theme: 'void'
    },
    {
      name: 'post_adhd_active_rest_parchment.png',
      path: '/blog/adhd-active-rest',
      theme: 'parchment'
    },
    {
      name: 'post_adhd_momentum_incubation.png',
      path: '/blog/adhd-momentum',
      theme: 'incubation'
    }
  ];

  for (let i = 0; i < captures.length; i++) {
    const { name, path: routePath, theme } = captures[i];
    const url = `http://localhost:3000${routePath}`;
    const outputPath = path.join(reviewsDir, name);

    console.log(`[${i + 1}/${captures.length}] Capturing ${name} (${theme} theme) at ${url}...`);

    try {
      const context = await browser.newContext();
      
      // Inject local storage setting to select the theme before loading the page
      await context.addInitScript((themeName) => {
        localStorage.setItem('nd3-theme', themeName);
        localStorage.setItem('nd3_telemetry_acknowledged', 'true');
      }, theme);

      const page = await context.newPage();
      await page.setViewportSize({ width: 1440, height: 900 });

      // Navigate
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Inject custom CSS to:
      // 1. Disable all transitions/animations to avoid mid-transition states
      // 2. Remove backdrop-filter blurs which render blurry/messy top sections in full-page screenshots
      // 3. Hide cookie/telemetry banners
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-delay: 0s !important;
            animation-duration: 0s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0s !important;
            transition-property: none !important;
            scroll-behavior: auto !important;
          }
          * {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          [role="status"], 
          .fixed.bottom-6.right-6.z-50,
          div[class*="ZeroTelemetryBanner"] { 
            display: none !important; 
          }
        `
      });

      // Extra wait for any late hydration/layout settling
      await page.waitForTimeout(2500);

      // Take the full page screenshot
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log(`Successfully saved screenshot to ${outputPath}`);

      await context.close();
    } catch (err) {
      console.error(`Failed to capture ${name}:`, err.message);
    }
  }

  await browser.close();
  console.log(`\nAll screenshots successfully saved to: ${reviewsDir}`);
}

run().catch(err => {
  console.error('Error running screenshots script:', err);
  process.exit(1);
});
