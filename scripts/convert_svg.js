import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

// Register Outfit font
GlobalFonts.registerFromPath('scripts/Outfit-Black.ttf', 'Outfit');

async function convertSingleSvg(svgPath, pngPath) {
  if (fs.existsSync(svgPath)) {
    const svgData = fs.readFileSync(svgPath);
    const img = await loadImage(svgData);
    
    // Scale up for high resolution print quality (3x scale)
    const scale = 3;
    const canvas = createCanvas(img.width * scale, img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
    
    fs.writeFileSync(pngPath, canvas.toBuffer('image/png'));
    console.log(`Successfully generated: ${pngPath} (${img.width * scale}x${img.height * scale})`);
  } else {
    console.error(`Missing SVG: ${svgPath}`);
  }
}

async function convertSvgToPng() {
  const publicDir = 'public';
  
  const filesToConvert = [
    { svg: 'logo-wordmark.svg', png: 'logo-wordmark.png' },
    { svg: 'logo-wordmark-dark-text.svg', png: 'logo-wordmark-dark-text.png' },
    { svg: 'logo-primary-flat.svg', png: 'logo-primary-flat.png' },
    { svg: 'logo-primary-flat-dark-text.svg', png: 'logo-primary-flat-dark-text.png' }
  ];

  for (const item of filesToConvert) {
    const svgPath = path.join(publicDir, item.svg);
    const pngPath = path.join(publicDir, item.png);
    await convertSingleSvg(svgPath, pngPath);
  }
}

convertSvgToPng().catch(err => {
  console.error("Conversion failed:", err);
  process.exit(1);
});
