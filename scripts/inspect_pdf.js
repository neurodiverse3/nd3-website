import fs from 'fs/promises';
import path from 'path';

async function extractPdfText(pdfPath) {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const projectRoot = path.resolve('.');

    const cMapUrl = 'file:///' + path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'cmaps').replace(/\\/g, '/') + '/';
    const standardFontDataUrl = 'file:///' + path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'standard_fonts').replace(/\\/g, '/') + '/';

    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfDocument = await pdfjs.getDocument({
        data: new Uint8Array(pdfBuffer),
        cMapUrl,
        cMapPacked: true,
        standardFontDataUrl,
        verbosity: 0,
    }).promise;

    console.log(`PDF Loaded. Number of pages: ${pdfDocument.numPages}`);
    
    // Get metadata
    const metadata = await pdfDocument.getMetadata();
    console.log("Metadata:", JSON.stringify(metadata, null, 2));

    for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        console.log(`--- Page ${i} text items: ---`);
        for (const item of textContent.items) {
            console.log(`[x=${item.transform[4].toFixed(1)}, y=${item.transform[5].toFixed(1)}] ${item.str}`);
        }
    }
}

const pdfFile = "./store-products-PDF's/ND3__CommsBundle__README__v1.0.pdf";
extractPdfText(pdfFile).catch(console.error);
