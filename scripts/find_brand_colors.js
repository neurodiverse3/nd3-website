import { loadImage, createCanvas } from '@napi-rs/canvas';

async function main() {
    const imgPath = "C:\\Users\\Ollie\\Documents\\Projects\\ND3 Website\\public\\spotlane-demos\\nd3-commsbundle-readme-v1-0\\page-2.png";
    const img = await loadImage(imgPath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;
    
    const colors = {};
    // Sample some pixels
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        colors[hex] = (colors[hex] || 0) + 1;
    }
    
    // Sort and get top colors
    const sorted = Object.entries(colors).sort((a,b) => b[1] - a[1]);
    console.log("Top 15 colors in page-2.png:");
    for (let j = 0; j < Math.min(15, sorted.length); j++) {
        console.log(`Color: ${sorted[j][0]}, Count: ${sorted[j][1]}`);
    }
}

main().catch(console.error);
