import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

// Register Outfit font
GlobalFonts.registerFromPath('scripts/Outfit-Black.ttf', 'Outfit');

async function renderSvgToPng(svgContent, pngPath) {
  const img = await loadImage(Buffer.from(svgContent));
  const scale = 3;
  const canvas = createCanvas(img.width * scale, img.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
  fs.writeFileSync(pngPath, canvas.toBuffer('image/png'));
  console.log(`Rendered: ${pngPath}`);
}

async function main() {
  const publicDir = 'public';
  
  // Test 1: Absolute position (original layout but with Outfit registered)
  const svgAbsolute = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295 60" aria-label="neurodivers³ wordmark">
      <text x="0" y="45" font-family="'Outfit'" font-size="48" font-weight="900" fill="#221E1A" letter-spacing="-0.02em">neurodivers</text>
      <text x="268" y="26" font-family="'Outfit'" font-size="34" font-weight="900" fill="#FF2D87">3</text>
    </svg>
  `;
  
  // Test 2: Tspan layout with Outfit registered
  const svgTspan = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295 60" aria-label="neurodivers³ wordmark">
      <text x="0" y="45" font-family="'Outfit'" font-size="48" font-weight="900" fill="#221E1A" letter-spacing="-0.02em">neurodivers<tspan dx="1" dy="-16" font-size="34" fill="#FF2D87">3</tspan></text>
    </svg>
  `;
  
  await renderSvgToPng(svgAbsolute, path.join(publicDir, 'logo-test-absolute.png'));
  await renderSvgToPng(svgTspan, path.join(publicDir, 'logo-test-tspan.png'));
}

main().catch(console.error);
