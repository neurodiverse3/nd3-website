import fs from 'fs';
import path from 'path';

const token = process.env.POLAR_ACCESS_TOKEN;
const orgId = 'ba989293-b94d-4b4a-85b9-54e6cf16eb0a';
const apiBase = 'https://api.polar.sh';
const productsTsPath = 'c:\\Users\\Ollie\\Documents\\Projects\\ND3 Website\\src\\data\\products.ts';

if (!token) {
  throw new Error('Missing POLAR_ACCESS_TOKEN. Set it in your environment before running this script.');
}

const SLUG_TO_TITLE_PREFIX = {
  'dopamine-menu-template': 'Dopamine Menu Template',
  'sensory-audit-workbook': 'Sensory Audit Workbook',
  'masking-recovery-pack': 'Masking Recovery Pack',
  'communication-templates-bundle': 'Communication Templates Bundle',
  'burnout-recovery-roadmap': 'Burnout Recovery Roadmap',
  'neurodivergent-weekly-planner': 'Weekly Planner',
  'the-toolkit': 'The Toolkit',
  '1-page-dopamine-menu': '1-Page Dopamine Menu'
};

async function apiFetch(endpoint, options = {}) {
  const url = `${apiBase}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  if (options.body && !(options.body instanceof Buffer)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error on ${endpoint}: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

async function run() {
  console.log('Fetching live products from Polar...');
  const productsData = await apiFetch(`/v1/products?organization_id=${orgId}`);
  const products = productsData.items || [];

  let productsTsContent = fs.readFileSync(productsTsPath, 'utf8');
  let updatedCount = 0;

  for (const [slug, titlePrefix] of Object.entries(SLUG_TO_TITLE_PREFIX)) {
    console.log(`\nProcessing: ${titlePrefix} (${slug})`);
    
    // Find matching Polar product
    const polarProduct = products.find(p => p.name.startsWith(titlePrefix));
    if (!polarProduct) {
      console.error(`Error: Could not find Polar product matching prefix "${titlePrefix}"`);
      continue;
    }

    const price = polarProduct.prices?.[0];
    if (!price || !price.id) {
      console.error(`Error: Polar product "${polarProduct.name}" has no prices configured.`);
      continue;
    }

    console.log(`Creating Checkout Link for Price ID: ${price.id}...`);
    
    try {
      const checkoutLink = await apiFetch('/v1/checkout-links', {
        method: 'POST',
        body: JSON.stringify({
          product_price_id: price.id,
          payment_processor: 'stripe'
        })
      });

      const checkoutUrl = checkoutLink.url;
      console.log(`Checkout Link Created: ${checkoutUrl}`);

      // Update in products.ts
      const regex = new RegExp(`(slug:\\s*"${slug}",[\\s\\S]*?checkoutUrl:\\s*")([^"]+)`, 'g');
      if (regex.test(productsTsContent)) {
        productsTsContent = productsTsContent.replace(regex, `$1${checkoutUrl}`);
        console.log(`Updated products.ts for "${slug}"`);
        updatedCount++;
      } else {
        console.warn(`Warning: Could not find slug "${slug}" in products.ts`);
      }

    } catch (err) {
      console.error(`Error creating checkout link for ${titlePrefix}:`, err);
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(productsTsPath, productsTsContent, 'utf8');
    console.log(`\nSuccessfully updated ${updatedCount} products in products.ts with working checkout links!`);
  }
}

run().catch(console.error);
