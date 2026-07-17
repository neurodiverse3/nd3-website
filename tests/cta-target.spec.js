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

  test('should rate limit comment submissions after 5 attempts', async ({ page }) => {
    page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // Navigate to the test comments route
    await page.goto('/test-comments');
    await page.waitForTimeout(500);

    const nameInput = page.locator('#name-input');
    const emailInput = page.locator('#comment-email-input');
    const contentInput = page.locator('#content-input');
    const submitButton = page.locator('button:has-text("Send Reply")');

    // Fill inputs
    await nameInput.fill('Test Spammer');
    await emailInput.fill('spammer@example.com');
    await contentInput.fill('This is a test reflection content spam.');

    // Log input values to verify they are filled
    console.log('Form Inputs Filled - Name:', await nameInput.inputValue(), 'Email:', await emailInput.inputValue());

    // Submit the form 5 times programmatically via page.evaluate
    for (let i = 0; i < 5; i++) {
      console.log(`Submitting form attempt ${i + 1}...`);
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        } else {
          console.error('Form not found on page!');
        }
      });
      // Wait for submission to complete and button to be enabled
      await page.waitForSelector('button:has-text("Send Reply"):not([disabled])');
      
      const faultText = await page.locator('text=Submission Fault').isVisible() 
        ? await page.locator('div:has(span:has-text("Submission Fault")) > span').nth(1).textContent()
        : 'None';
      console.log(`Attempt ${i + 1} done. Fault:`, faultText);
    }

    // The 6th attempt should trigger the rate-limiting error
    console.log('Submitting 6th attempt (should rate limit)...');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });
    await page.waitForSelector('button:has-text("Send Reply"):not([disabled])');

    const errorMsg = page.locator('text=Too many comments submitted');
    await expect(errorMsg).toBeVisible();
  });
});
