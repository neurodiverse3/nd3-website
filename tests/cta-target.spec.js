import { test, expect } from '@playwright/test';

test.describe('Join-the-list CTA and Email Inputs', () => {
  test('should target newsletter-email-input and avoid duplicate email-input IDs', async ({ page }) => {
    await page.goto('/');

    // Verify newsletter email input has id "newsletter-email-input"
    const newsletterInput = page.locator('#newsletter-email-input');
    await expect(newsletterInput).toBeVisible();

    // Verify label association for newsletter input
    const label = page.locator('label[for="newsletter-email-input"]');
    await expect(label).toBeAttached();

    // Open mobile menu
    const menuButton = page.locator('header button[aria-label="Toggle Navigation Menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      const ctaButton = page.locator('button:has-text("Join the list →")');
      await expect(ctaButton).toBeVisible();
      
      // Click Join the list and check focus scrolls/focuses newsletter-email-input
      await ctaButton.click();
      await expect(newsletterInput).toBeFocused();
    }
  });

  test('should use unique email input id in comments', async ({ page }) => {
    // Navigate to the test comments route
    await page.goto('/test-comments');

    // Verify comment section email input has id "comment-email-input"
    const commentInput = page.locator('#comment-email-input');
    await expect(commentInput).toBeAttached();

    const label = page.locator('label[for="comment-email-input"]');
    await expect(label).toBeAttached();

    // Check that there is no element with id "email-input" on the page
    const duplicateInput = page.locator('#email-input');
    await expect(duplicateInput).toHaveCount(0);
  });
});
