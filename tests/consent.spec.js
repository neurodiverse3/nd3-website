import { test, expect } from '@playwright/test';

test.describe('Privacy and Analytics Consent Banner', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show the privacy banner on first load', async ({ page }) => {
    await page.goto('/');
    // The banner has a small entry delay of 1500ms, so we wait for it
    await page.waitForTimeout(2000);
    const banner = page.locator('role=status');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Privacy & Preferences');
  });

  test('should hide banner and save false consent when clicking Necessary Only', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const declineBtn = page.locator('button:has-text("Necessary Only")');
    await declineBtn.click();
    
    // Banner should hide
    const banner = page.locator('role=status');
    await expect(banner).not.toBeVisible();
    
    // Check localStorage
    const consent = await page.evaluate(() => localStorage.getItem('nd3_consent_analytics'));
    const acknowledged = await page.evaluate(() => localStorage.getItem('nd3_telemetry_acknowledged'));
    expect(consent).toBe('false');
    expect(acknowledged).toBe('true');
  });

  test('should hide banner and save true consent when clicking Accept Analytics', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const acceptBtn = page.locator('button:has-text("Accept Analytics")');
    await acceptBtn.click();
    
    // Banner should hide
    const banner = page.locator('role=status');
    await expect(banner).not.toBeVisible();
    
    // Check localStorage
    const consent = await page.evaluate(() => localStorage.getItem('nd3_consent_analytics'));
    const acknowledged = await page.evaluate(() => localStorage.getItem('nd3_telemetry_acknowledged'));
    expect(consent).toBe('true');
    expect(acknowledged).toBe('true');
  });

  test('should allow toggling consent on the privacy page', async ({ page }) => {
    await page.goto('/privacy');
    
    // Toggle should show Declined initially if no choice made
    const toggle = page.locator('button[aria-label="Toggle Vercel Web Analytics"]');
    await expect(page.locator('text=Status: DECLINED')).toBeVisible();
    
    // Toggle consent on
    await toggle.click();
    await expect(page.locator('text=Status: ACCEPTED')).toBeVisible();
    
    let consent = await page.evaluate(() => localStorage.getItem('nd3_consent_analytics'));
    expect(consent).toBe('true');
    
    // Toggle consent off
    await toggle.click();
    await expect(page.locator('text=Status: DECLINED')).toBeVisible();
    
    consent = await page.evaluate(() => localStorage.getItem('nd3_consent_analytics'));
    expect(consent).toBe('false');
  });
});
