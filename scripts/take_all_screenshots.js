import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { workspacePaths } from './workspace-paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
}

// Load env vars
const projectRoot = path.resolve(__dirname, '..');
loadEnv(path.join(projectRoot, '.env.local'));
loadEnv(path.join(projectRoot, '.env'));

async function fetchStrapi(endpoint) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    if (!res.ok) {
      console.warn(`[Strapi] Fetch to ${endpoint} returned status ${res.status}`);
      return { data: [] };
    }
    return await res.json();
  } catch (error) {
    console.error(`[Strapi] Error fetching from ${endpoint}:`, error.message);
    return { data: [] };
  }
}

function getSlug(item) {
  if (!item) return '';
  const attrs = item.attributes || item;
  const slugVal = attrs.slug?.current || attrs.slug;
  if (slugVal && typeof slugVal === 'object') {
    return slugVal.current || '';
  }
  return slugVal || '';
}

async function run() {
  const screenshotsDir = workspacePaths.screenshots;
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Fetching dynamic routes from Strapi...');
  const routes = [
    { name: '01_home', path: '/' },
    { name: '02_about', path: '/about' },
    { name: '03_accessibility', path: '/accessibility' },
    { name: '04_labs', path: '/labs' },
    { name: '05_store', path: '/store' },
    { name: '06_memoir', path: '/memoir' },
    { name: '07_privacy', path: '/privacy' },
    { name: '08_terms', path: '/terms' },
    { name: '09_downloads', path: '/downloads' },
    { name: '10_blog', path: '/blog' },
    { name: '11_contact', path: '/contact' },
  ];

  // Fetch blog posts
  const postsRes = await fetchStrapi('posts');
  const posts = postsRes.data || [];
  console.log(`Found ${posts.length} blog posts.`);
  posts.forEach(post => {
    const slug = getSlug(post);
    if (slug) {
      routes.push({ name: `blog_${slug}`, path: `/blog/${slug}` });
    }
  });

  // Fetch labs
  const labsRes = await fetchStrapi('labs');
  const labs = labsRes.data || [];
  console.log(`Found ${labs.length} labs.`);
  labs.forEach(lab => {
    const slug = getSlug(lab);
    if (slug) {
      routes.push({ name: `lab_${slug}`, path: `/labs/${slug}` });
    }
  });

  // Fetch products
  const productsRes = await fetchStrapi('products');
  const products = productsRes.data || [];
  console.log(`Found ${products.length} products.`);
  products.forEach(prod => {
    const slug = getSlug(prod);
    if (slug) {
      routes.push({ name: `store_${slug}`, path: `/store/${slug}` });
    }
  });

  // Fetch memoir chapters
  const memoirRes = await fetchStrapi('memoir-chapters');
  const chapters = memoirRes.data || [];
  console.log(`Found ${chapters.length} memoir chapters.`);
  chapters.forEach(chap => {
    const slug = getSlug(chap);
    if (slug) {
      routes.push({ name: `memoir_${slug}`, path: `/memoir/${slug}` });
    }
  });

  console.log(`Total routes to screenshot: ${routes.length}`);

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  // Add init script to prevent telemetry banner from showing up
  await context.addInitScript(() => {
    localStorage.setItem('nd3_telemetry_acknowledged', 'true');
  });

  const page = await context.newPage();
  
  // Set a standard desktop viewport
  await page.setViewportSize({ width: 1280, height: 800 });

  for (let i = 0; i < routes.length; i++) {
    const { name, path: routePath } = routes[i];
    const url = `http://localhost:3000${routePath}`;
    console.log(`[${i + 1}/${routes.length}] Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Inject CSS fallback to hide the telemetry/cookie banner just in case
      try {
        await page.addStyleTag({
          content: `
            [role="status"], 
            .fixed.bottom-6.right-6.z-50,
            div[class*="ZeroTelemetryBanner"] { 
              display: none !important; 
            }
          `
        });
      } catch (styleErr) {
        console.warn('Failed to inject style tag:', styleErr.message);
      }

      // Extra wait for dynamic animations / content rendering
      await page.waitForTimeout(2000);
      
      const fileName = `${name.replace(/[^a-zA-Z0-9_]/g, '_')}.png`;
      const outputPath = path.join(screenshotsDir, fileName);
      
      console.log(`Capturing full page screenshot: ${fileName}`);
      await page.screenshot({ path: outputPath, fullPage: true });
    } catch (err) {
      console.error(`Failed to capture screenshot for ${routePath}:`, err.message);
    }
  }

  await browser.close();
  console.log(`\nDone! All screenshots saved to: ${screenshotsDir}`);
}

run().catch(err => {
  console.error('Error running screenshot task:', err);
  process.exit(1);
});
