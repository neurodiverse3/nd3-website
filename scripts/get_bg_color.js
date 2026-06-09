import { loadImage } from '@napi-rs/canvas';
import path from 'path';

async function main() {
    const imgPath = "C:\\Users\\Ollie\\Documents\\Projects\\ND3 Website\\public\\spotlane-demos\\nd3-commsbundle-readme-v1-0\\page-2.png";
    const img = await loadImage(imgPath);
    const canvas = { width: img.width, height: img.height };
    
    // We can just create a canvas and draw the image
    const { createCanvas } = await import('@napi-rs/canvas');
    const c = createCanvas(10, 10);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, 10, 10, 0, 0, 10, 10);
    
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase();
    console.log(`Top-left pixel color of page-2.png: ${hex} (RGBA: ${pixel})`);
}

main().catch(console.error);
