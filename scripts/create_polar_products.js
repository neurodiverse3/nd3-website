import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { workspacePaths } from './workspace-paths.js';

const token = process.env.POLAR_ACCESS_TOKEN;
const productsDir = workspacePaths.finalProducts;
const coversDir = 'public/store/covers';
const productsTsPath = 'src/data/products.ts';

if (!token) {
  throw new Error('Missing POLAR_ACCESS_TOKEN. Set it in your environment before running this script.');
}

const productsToProcess = [
  {
    slug: "dopamine-menu-template",
    title: "Dopamine Menu Template",
    price: 5,
    tagline: "A pre-built menu of inputs your brain finds rewarding, sorted by intensity. Built for the days when “just start” doesn't work.",
    coverImage: "nd3-store-cover-dopamine-menu-template-1280.png",
    zipFile: "ND3__DopamineMenuTemplate__Launch.zip"
  },
  {
    slug: "sensory-audit-workbook",
    title: "Sensory Audit Workbook",
    price: 5,
    tagline: "A 28-page workbook for finding the sensory drains you've stopped noticing.",
    coverImage: "nd3-store-cover-sensory-audit-workbook-1280.png",
    zipFile: "ND3__SensoryAuditWorkbook__Launch.zip"
  },
  {
    slug: "masking-recovery-pack",
    title: "Masking Recovery Pack",
    price: 5,
    tagline: "A two-part pack for the slump after heavy masking.",
    coverImage: "nd3-store-cover-masking-recovery-pack-1280.png",
    zipFile: "ND3__MaskingRecoveryPack__Launch.zip"
  },
  {
    slug: "communication-templates-bundle",
    title: "Communication Templates Bundle",
    price: 5,
    tagline: "Pre-written messages for the conversations that take more energy than they should.",
    coverImage: "nd3-store-cover-communication-templates-bundle-1280.png",
    zipFile: "ND3__CommunicationTemplatesBundle__Launch.zip"
  },
  {
    slug: "burnout-recovery-roadmap",
    title: "Burnout Recovery Roadmap",
    price: 7,
    tagline: "A Notion workspace for recovery, not productivity.",
    coverImage: "nd3-store-cover-burnout-recovery-roadmap-1280.png",
    zipFile: "ND3__BurnoutRecoveryRoadmap__Launch.zip"
  },
  {
    slug: "neurodivergent-weekly-planner",
    title: "Weekly Planner",
    price: 7,
    tagline: "A weekly planner for a brain whose capacity varies.",
    coverImage: "nd3-store-cover-neurodivergent-weekly-planner-1280.png",
    zipFile: "ND3__WeeklyPlanner__Launch.zip"
  },
  {
    slug: "the-toolkit",
    title: "The Toolkit",
    price: 19,
    tagline: "All six paid neurodivers³ products in one bundle.",
    coverImage: "nd3-store-cover-the-toolkit-1280.png",
    zipFile: "ND3__TheToolkit__Launch.zip"
  },
  {
    slug: "1-page-dopamine-menu",
    title: "1-Page Dopamine Menu",
    price: 0,
    tagline: "A free single-page printable for trying the Dopamine Menu format.",
    coverImage: "nd3-store-cover-1-page-dopamine-menu-1280.png",
    zipFile: "ND3__OnePageDopamineMenu__Free.zip"
  }
];

// Helper to make Polar API requests
async function apiFetch(endpoint, options = {}) {
  const url = `https://api.polar.sh${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  if (options.body && !(options.body instanceof Buffer)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error on ${endpoint}: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

// Upload file to Polar (creates record, PUTs to S3, completes upload)
async function uploadFile(filePath, service, mimeType) {
  const name = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);
  const size = buffer.length;
  const sha256Base64 = crypto.createHash('sha256').update(buffer).digest('base64');

  console.log(`Uploading ${name} (${size} bytes) as ${service}...`);

  // 1. Create file record
  const fileRecord = await apiFetch('/v1/files/', {
    method: 'POST',
    body: JSON.stringify({
      name,
      mime_type: mimeType,
      size,
      service,
      upload: {
        parts: [
          {
            number: 1,
            chunk_start: 0,
            chunk_end: size,
            checksum_sha256_base64: sha256Base64
          }
        ]
      }
    })
  });

  const fileId = fileRecord.id;
  const s3UploadId = fileRecord.upload.id;
  const s3Path = fileRecord.upload.path;
  const part = fileRecord.upload.parts[0];

  // 2. Upload to S3
  const s3Headers = { 'Content-Type': mimeType };
  if (part.checksum_sha256_base64) {
    s3Headers['x-amz-checksum-sha256'] = part.checksum_sha256_base64;
  }
  if (part.headers) {
    Object.assign(s3Headers, part.headers);
  }

  const s3Res = await fetch(part.url, {
    method: 'PUT',
    headers: s3Headers,
    body: buffer
  });

  if (!s3Res.ok) {
    throw new Error(`S3 upload failed for ${name}: ${s3Res.status} ${s3Res.statusText}`);
  }

  const rawEtag = s3Res.headers.get('etag');
  const cleanEtag = rawEtag ? rawEtag.replace(/"/g, '') : '';

  // 3. Complete upload on Polar
  await apiFetch(`/v1/files/${fileId}/uploaded`, {
    method: 'POST',
    body: JSON.stringify({
      id: s3UploadId,
      path: s3Path,
      parts: [
        {
          number: 1,
          checksum_etag: cleanEtag,
          checksum_sha256_base64: sha256Base64
        }
      ]
    })
  });

  console.log(`Upload complete for ${name}. File ID: ${fileId}`);
  return fileId;
}

// Update products.ts with the new checkout URL
function updateProductsTs(slug, checkoutUrl) {
  let content = fs.readFileSync(productsTsPath, 'utf8');
  
  // Find the product block by its slug and replace its checkoutUrl line
  const regex = new RegExp(`(slug:\\s*"${slug}",[\\s\\S]*?checkoutUrl:\\s*")([^"]+)`, 'g');
  if (regex.test(content)) {
    content = content.replace(regex, `$1${checkoutUrl}`);
    fs.writeFileSync(productsTsPath, content, 'utf8');
    console.log(`Updated checkoutUrl in ${productsTsPath} for ${slug} to ${checkoutUrl}`);
  } else {
    console.warn(`Could not find checkoutUrl pattern for slug ${slug} in ${productsTsPath}`);
  }
}

async function run() {
  console.log('Fetching existing products from Polar...');
  const existingProductsRes = await apiFetch('/v1/products/?limit=100');
  const existingProducts = existingProductsRes.items || [];

  for (const product of productsToProcess) {
    console.log(`\n========================================`);
    console.log(`Processing Product: ${product.title}`);
    console.log(`========================================`);

    // Check if product already exists by matching the title (ignoring suffix) or slug in description/metadata
    const existing = existingProducts.find(p => p.name.startsWith(product.title));
    if (existing) {
      const checkoutUrl = `https://buy.polar.sh/${existing.id}`;
      console.log(`Product already exists on Polar: ${existing.name} (ID: ${existing.id})`);
      updateProductsTs(product.slug, checkoutUrl);
      continue;
    }

    try {
      // 1. Upload cover image
      const coverPath = path.join(coversDir, product.coverImage);
      if (!fs.existsSync(coverPath)) {
        throw new Error(`Cover image not found: ${coverPath}`);
      }
      const coverMediaId = await uploadFile(coverPath, 'product_media', 'image/png');

      // 2. Upload zip delivery package
      const zipPath = path.join(productsDir, product.zipFile);
      if (!fs.existsSync(zipPath)) {
        throw new Error(`ZIP delivery file not found: ${zipPath}`);
      }
      const zipFileId = await uploadFile(zipPath, 'downloadable', 'application/zip');

      // 3. Create downloadables benefit
      console.log(`Creating downloadable benefit for ${product.title}...`);
      const benefitDescription = `Download ${product.title}`;
      // Description must be between 3 and 42 characters
      const trimmedDescription = benefitDescription.substring(0, 42);
      const benefit = await apiFetch('/v1/benefits/', {
        method: 'POST',
        body: JSON.stringify({
          type: 'downloadables',
          description: trimmedDescription,
          properties: {
            files: [zipFileId]
          }
        })
      });
      console.log(`Benefit created successfully. Benefit ID: ${benefit.id}`);

      // 4. Create the product
      console.log(`Creating product on Polar...`);
      const createdProduct = await apiFetch('/v1/products/', {
        method: 'POST',
        body: JSON.stringify({
          name: `${product.title} · Launch special`,
          description: product.tagline,
          visibility: 'public',
          prices: [
            {
              amount_type: 'fixed',
              price_amount: product.price * 100,
              price_currency: 'gbp'
            }
          ],
          medias: [coverMediaId]
        })
      });
      console.log(`Product created successfully. Product ID: ${createdProduct.id}`);

      // 5. Link the benefit to the product
      console.log(`Linking benefit ${benefit.id} to product ${createdProduct.id}...`);
      await apiFetch(`/v1/products/${createdProduct.id}/benefits`, {
        method: 'POST',
        body: JSON.stringify({
          benefits: [benefit.id]
        })
      });
      console.log('Benefit linked successfully.');

      const checkoutUrl = `https://buy.polar.sh/${createdProduct.id}`;
      console.log(`Product creation and linking workflow complete!`);
      console.log(`Checkout URL: ${checkoutUrl}`);

      // 6. Update products.ts
      updateProductsTs(product.slug, checkoutUrl);

    } catch (err) {
      console.error(`Error processing product ${product.title}:`, err);
      process.exit(1);
    }
  }

  console.log('\nAll products processed successfully!');
}

run().catch(err => {
  console.error('Fatal error in script:', err);
  process.exit(1);
});
