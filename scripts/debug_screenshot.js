import { chromium } from '@playwright/test';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  await context.addInitScript(() => {
    localStorage.setItem('nd3-theme', 'incubation');
    localStorage.setItem('nd3_telemetry_acknowledged', 'true');
  });

  const page = await context.newPage();
  
  // Capture page logs
  page.on('console', msg => console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.error(`[PAGE ERROR]: ${err.message}`));

  console.log('Navigating to http://localhost:3000/blog...');
  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle', timeout: 15000 });
  
  await page.waitForTimeout(2000);
  
  const contentInfo = await page.evaluate(() => {
    return {
      bodyHeight: document.body.scrollHeight,
      viewportHeight: window.innerHeight,
      mainHtml: document.querySelector('main')?.innerHTML?.substring(0, 500) || 'No main element',
      postsCount: document.querySelectorAll('[data-pillar]').length
    };
  });
  
  console.log('Page render info:', contentInfo);
  await browser.close();
}

run().catch(console.error);
