import { test, expect } from '@playwright/test';

test.describe('Navbar Logo Reduced Motion', () => {
  test('should respect prefers-reduced-motion and not run glitch animation', async ({ page }) => {
    // Emulate OS-level reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const logo = page.locator('header nav a').first();
    
    // The glitch runs on a 4s interval, so we wait for 4.5s
    // and verify that the logo skew/translate class was never added
    await page.waitForTimeout(4500);
    
    const className = await logo.getAttribute('class');
    expect(className).not.toContain('skew-x-6');
    expect(className).not.toContain('translate-x-0.5');
  });

  test('should respect site-level reduced-motion override class', async ({ page }) => {
    await page.goto('/');

    // Set site-level override in localStorage
    await page.evaluate(() => {
      localStorage.setItem('nd3-a11y-reduced-motion', 'true');
    });
    
    await page.reload();

    // Verify HTML has the class
    const html = page.locator('html');
    await expect(html).toHaveClass(/prefers-reduced-motion-override/);

    const logo = page.locator('header nav a').first();
    await page.waitForTimeout(4500);
    
    const className = await logo.getAttribute('class');
    expect(className).not.toContain('skew-x-6');
    expect(className).not.toContain('translate-x-0.5');
  });
});
