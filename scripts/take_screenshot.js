import { chromium } from '@playwright/test';
import path from 'path';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 1600 });
  
  console.log('Navigating to http://localhost:3000/labs...');
  await page.goto('http://localhost:3000/labs');
  
  console.log('Waiting for hydration and canvas rendering...');
  await page.waitForTimeout(3000);
  
  const screenshotPath = 'C:/Users/Ollie/.gemini/antigravity/brain/654fa36d-a84a-4880-a2a8-f293e20f1710/scratch/labs_screenshot.png';
  console.log('Saving screenshot to', screenshotPath);
  await page.screenshot({ path: screenshotPath });
  
  await browser.close();
  console.log('Done!');
}

run().catch(err => {
  console.error('Error taking screenshot:', err);
  process.exit(1);
});
