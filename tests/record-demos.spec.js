import { test, expect, chromium } from '@playwright/test';
import path from 'path';

test.describe('Record Demo Videos', () => {
  // Use a long timeout for recording
  test.setTimeout(120000);

  test('Record Store Hero Loop', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      recordVideo: {
        dir: 'public/demos/',
        size: { width: 1080, height: 1080 }, // Square for social
      },
      viewport: { width: 1080, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/demos/store-hero');
    // Wait for animation to play
    await page.waitForTimeout(10000); // Record 10 seconds
    await context.close();
    await browser.close();
  });

  test('Record Toolkit Bundle', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      recordVideo: {
        dir: 'public/demos/',
        size: { width: 1080, height: 1080 },
      },
      viewport: { width: 1080, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/demos/toolkit-bundle');
    // Wait for animation sequence
    await page.waitForTimeout(6000); // 6 seconds is enough for the stack
    await context.close();
    await browser.close();
  });

  test('Record Burnout Roadmap', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      recordVideo: {
        dir: 'public/demos/',
        size: { width: 1080, height: 1920 }, // Vertical format
      },
      viewport: { width: 1080, height: 1920 }
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/demos/burnout-roadmap');
    await page.waitForTimeout(8000); 
    await context.close();
    await browser.close();
  });

  test('Record Which Tool sequence', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      recordVideo: {
        dir: 'public/demos/',
        size: { width: 1080, height: 1920 },
      },
      viewport: { width: 1080, height: 1920 }
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/demos/which-tool');
    await page.waitForTimeout(14000); 
    await context.close();
    await browser.close();
  });
});
