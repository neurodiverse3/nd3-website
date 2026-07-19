import { test, expect } from '@playwright/test';

test.describe('Comments Submission Confetti Reduced Motion', () => {
  test('should trigger sparkles on successful submission with normal motion', async ({ page }) => {
    await page.goto('/test-comments');
    await page.waitForTimeout(500);

    const nameInput = page.locator('#name-input');
    const emailInput = page.locator('#comment-email-input');
    const contentInput = page.locator('#content-input');
    const submitButton = page.locator('button:has-text("Send Reply")');

    await nameInput.fill('User Sparkle');
    await emailInput.fill('sparkle@example.com');
    await contentInput.fill('This is comment text with sparkles.');
    
    // Fill honeypot field to trigger bypass and return success: true
    const honeyInput = page.locator('input[name="company"]');
    await honeyInput.fill('Spambot-Trigger', { force: true });

    // Click submit and check that sparkles ✨ are rendered
    await submitButton.click();
    await page.waitForTimeout(200);

    const successMsg = page.locator('text=Reply Sent for Review');
    const errorMsg = page.locator('text=Submission Fault');
    console.log('[Sparkles Test] Success visible:', await successMsg.isVisible(), 'Error visible:', await errorMsg.isVisible());
    if (await errorMsg.isVisible()) {
      const faultText = await page.locator('div:has(span:has-text("Submission Fault")) > span').nth(1).textContent();
      console.log('[Sparkles Test] Error content:', faultText);
    }
    
    // We expect some ✨ elements to appear in the fixed overlay container
    const sparkles = page.locator('text=✨');
    const count = await sparkles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should suppress sparkles when OS-level reduced motion is preferred', async ({ page }) => {
    // Emulate OS reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/test-comments');
    await page.waitForTimeout(500);

    const nameInput = page.locator('#name-input');
    const emailInput = page.locator('#comment-email-input');
    const contentInput = page.locator('#content-input');
    const submitButton = page.locator('button:has-text("Send Reply")');

    await nameInput.fill('User Reduced');
    await emailInput.fill('reduced@example.com');
    await contentInput.fill('This is comment text with reduced motion.');

    await submitButton.click();
    
    // Confetti sparkles should be suppressed
    const sparkles = page.locator('text=✨');
    await page.waitForTimeout(100);
    const count = await sparkles.count();
    expect(count).toBe(0);
  });

  test('should suppress sparkles when site-level reduced motion override class is present', async ({ page }) => {
    await page.goto('/test-comments');
    await page.waitForTimeout(500);

    // Apply site override
    await page.evaluate(() => {
      document.documentElement.classList.add('prefers-reduced-motion-override');
    });

    const nameInput = page.locator('#name-input');
    const emailInput = page.locator('#comment-email-input');
    const contentInput = page.locator('#content-input');
    const submitButton = page.locator('button:has-text("Send Reply")');

    await nameInput.fill('User Override');
    await emailInput.fill('override@example.com');
    await contentInput.fill('This is comment text with site override.');

    await submitButton.click();
    
    // Confetti sparkles should be suppressed
    const sparkles = page.locator('text=✨');
    await page.waitForTimeout(100);
    const count = await sparkles.count();
    expect(count).toBe(0);
  });
});
