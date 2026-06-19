import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { workspacePaths } from './workspace-paths.js';

const token = process.env.POLAR_ACCESS_TOKEN;
const apiBase = 'https://api.polar.sh';
const assetsDir = workspacePaths.designAssets;

if (!token) {
  throw new Error('Missing POLAR_ACCESS_TOKEN. Set it in your environment before running this script.');
}

// Mapping from Polar Product ID to visual assets in the assets folder
const PRODUCT_ASSETS_MAP = {
  // 1-Page Dopamine Menu (Free)
  '9c444fa8-97a2-4cf2-aa8d-439801cdfcc2': {
    cover: 'nd3-store-cover-one-page-dopamine-menu-1280 (1).png',
    card: 'nd3-product-card-one-page-dopamine-menu.png',
    previews: ['nd3-free-one-page-preview.png']
  },
  // The Toolkit (£19)
  'aa67927b-5e29-4969-a5e1-cb8790c8f82e': {
    cover: 'nd3-store-cover-the-toolkit-1280 (1).png',
    card: 'nd3-product-card-the-toolkit.png',
    previews: ['nd3-toolkit-inside-preview.png', 'nd3-toolkit-days-preview.png']
  },
  // Weekly Planner (£7)
  '1015a410-9289-4067-8f9f-d1d6e143d353': {
    cover: 'nd3-store-cover-weekly-planner-1280 (1).png',
    card: 'nd3-product-card-weekly-planner.png',
    previews: ['nd3-weekly-brain-state-preview.png', 'nd3-weekly-momentum-preview.png']
  },
  // Burnout Recovery Roadmap (£7)
  '69ee93a4-130e-4e78-89df-dcbe154c0d68': {
    cover: 'nd3-store-cover-burnout-recovery-roadmap-1280 (1).png',
    card: 'nd3-product-card-burnout-recovery-roadmap.png',
    previews: ['nd3-burnout-phases-preview.png', 'nd3-burnout-protocol-preview.png']
  },
  // Masking Recovery Pack (£5)
  'ba59cf40-9a78-4062-bbb6-5ea5f536c73d': {
    cover: 'nd3-store-cover-masking-recovery-pack-1280 (1).png',
    card: 'nd3-product-card-masking-recovery-pack.png',
    previews: ['nd3-masking-inside-preview.png', 'nd3-masking-tracker-preview.png']
  },
  // Sensory Audit Workbook (£5)
  '1f53de85-ed4e-4beb-a00f-afeb2f23bcd1': {
    cover: 'nd3-store-cover-sensory-audit-workbook-1280 (1).png',
    card: 'nd3-product-card-sensory-audit-workbook.png',
    previews: ['nd3-sensory-domains-preview.png', 'nd3-sensory-example-preview.png']
  },
  // Dopamine Menu Template (£5)
  '64a9bac6-6888-4603-9624-496fd058d1ef': {
    cover: 'nd3-store-cover-dopamine-menu-template-1280 (2).png',
    card: 'nd3-product-card-dopamine-menu-template.png',
    previews: ['nd3-dopamine-menu-preview.png', 'nd3-dopamine-by-need-preview.png']
  },
  // Communication Templates Bundle (£5)
  '8e5a2386-1293-4bff-9f05-73bcef6a25fa': {
    cover: 'nd3-store-cover-communication-templates-bundle-1280 (2).png',
    card: 'nd3-product-card-communication-templates-bundle.png',
    previews: [
      'nd3-comms-folder-mockup.png',
      'nd3-comms-three-tones.png',
      'nd3-comms-message-example.png',
      'nd3-comms-decision-card.png'
    ]
  }
};

// Helper for API fetch requests
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

// Upload file helper
async function uploadFile(fileName, service = 'product_media') {
  const filePath = path.join(assetsDir, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Sanitize filename for Polar API & S3 path to prevent rendering/URL parsing issues
  const cleanName = fileName.replace(/\s+/g, '-').replace(/[()]/g, '');

  const buffer = fs.readFileSync(filePath);
  const size = buffer.length;
  const mimeType = 'image/png';
  const sha256Base64 = crypto.createHash('sha256').update(buffer).digest('base64');

  console.log(`  Uploading ${fileName} as ${cleanName} (${size} bytes)...`);

  // Step 1: Create file upload session
  const fileRecord = await apiFetch('/v1/files/', {
    method: 'POST',
    body: JSON.stringify({
      name: cleanName,
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

  // Step 2: Upload part to S3
  const s3Headers = { 'Content-Type': mimeType };
  if (part.headers) {
    Object.assign(s3Headers, part.headers);
  }

  const s3Res = await fetch(part.url, {
    method: 'PUT',
    headers: s3Headers,
    body: buffer
  });

  if (!s3Res.ok) {
    const errText = await s3Res.text();
    throw new Error(`S3 PUT failed for ${fileName}: ${s3Res.status} ${errText}`);
  }

  const rawEtag = s3Res.headers.get('etag');
  const cleanEtag = rawEtag ? rawEtag.replace(/"/g, '') : '';

  // Step 3: Complete upload
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

  console.log(`    Uploaded successfully. File ID: ${fileId}`);
  return fileId;
}

async function run() {
  console.log('Starting upload of store assets and association to Polar products...');

  for (const [productId, assets] of Object.entries(PRODUCT_ASSETS_MAP)) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Processing Product ID: ${productId}`);
    console.log(`--------------------------------------------------`);

    try {
      const mediaIds = [];

      // 1. Upload Cover Image (First in list)
      const coverId = await uploadFile(assets.cover);
      mediaIds.push(coverId);

      // 2. Upload Product Card Image (Second in list)
      const cardId = await uploadFile(assets.card);
      mediaIds.push(cardId);

      // 3. Upload Previews
      for (const preview of assets.previews) {
        const previewId = await uploadFile(preview);
        mediaIds.push(previewId);
      }

      console.log(`Associating ${mediaIds.length} media files to product ${productId}...`);

      // 4. Update the Polar Product with the new medias list
      const updatedProduct = await apiFetch(`/v1/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          medias: mediaIds
        })
      });

      console.log(`Product "${updatedProduct.name}" updated successfully with new visual assets!`);

    } catch (err) {
      console.error(`Error processing Product ID ${productId}:`, err);
      process.exit(1);
    }
  }

  console.log('\nAll 33 visual assets uploaded and attached successfully!');
}

run().catch(console.error);
