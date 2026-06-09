import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

// Output location for the report
const REPORT_DIR = path.resolve('test-results');
const REPORT_PATH = path.join(REPORT_DIR, 'a11y_violations.json');

const PAGES_TO_TEST = [
  { name: 'Home', path: '/' },
  { name: 'Blog Index', path: '/blog' },
  { name: 'Store Index', path: '/store' },
  { name: 'Labs Index', path: '/labs' },
  { name: 'Labs Banner Showcase', path: '/labs/banner-showcase' },
  { name: 'Accessibility Info', path: '/accessibility' },
  { name: 'Privacy Policy', path: '/privacy' },
];

test.describe('WCAG & Accessibility Compliance Scan', () => {
  let allViolations = [];

  test.afterAll(async () => {
    // Ensure directory exists
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }
    // Write collected violations to file
    fs.writeFileSync(REPORT_PATH, JSON.stringify(allViolations, null, 2), 'utf-8');
    console.log(`\n======================================================`);
    console.log(`Accessibility Scan Complete! Results saved to:`);
    console.log(REPORT_PATH);
    console.log(`Total collected scanned states: ${allViolations.length}`);
    console.log(`======================================================\n`);
  });

  for (const pageInfo of PAGES_TO_TEST) {
    test(`Scan ${pageInfo.name} across themes and accessibility overlays`, async ({ page }) => {
      // 1. Standard Default Theme (Void)
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      const scanDefault = await new AxeBuilder({ page }).analyze();
      allViolations.push({
        page: pageInfo.name,
        path: pageInfo.path,
        state: 'Void Theme (Default)',
        violations: filterViolations(scanDefault.violations),
      });

      // 2. Parchment Theme
      await page.evaluate(() => {
        localStorage.setItem('nd3-theme', 'parchment');
      });
      await page.reload({ waitUntil: 'networkidle' });
      const scanParchment = await new AxeBuilder({ page }).analyze();
      allViolations.push({
        page: pageInfo.name,
        path: pageInfo.path,
        state: 'Parchment Theme',
        violations: filterViolations(scanParchment.violations),
      });

      // 3. Incubation Theme
      await page.evaluate(() => {
        localStorage.setItem('nd3-theme', 'incubation');
      });
      await page.reload({ waitUntil: 'networkidle' });
      const scanIncubation = await new AxeBuilder({ page }).analyze();
      allViolations.push({
        page: pageInfo.name,
        path: pageInfo.path,
        state: 'Incubation Theme',
        violations: filterViolations(scanIncubation.violations),
      });

      // 4. High Contrast Overlay (Active)
      await page.evaluate(() => {
        localStorage.setItem('nd3-a11y-contrast', 'true');
      });
      await page.reload({ waitUntil: 'networkidle' });
      const scanContrast = await new AxeBuilder({ page }).analyze();
      allViolations.push({
        page: pageInfo.name,
        path: pageInfo.path,
        state: 'High Contrast Mode',
        violations: filterViolations(scanContrast.violations),
      });

      // Reset Contrast, Test Dyslexia Friendly Overlay
      await page.evaluate(() => {
        localStorage.setItem('nd3-a11y-contrast', 'false');
        localStorage.setItem('nd3-a11y-dyslexic', 'true');
      });
      await page.reload({ waitUntil: 'networkidle' });
      const scanDyslexic = await new AxeBuilder({ page }).analyze();
      allViolations.push({
        page: pageInfo.name,
        path: pageInfo.path,
        state: 'Dyslexic Friendly Mode',
        violations: filterViolations(scanDyslexic.violations),
      });

      // Clean up localstorage settings for next test run
      await page.evaluate(() => {
        localStorage.clear();
      });
    });
  }
});

function filterViolations(violations) {
  return violations.map(v => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes.map(n => ({
      html: n.html,
      target: n.target,
      failureSummary: n.failureSummary,
    })),
  }));
}
