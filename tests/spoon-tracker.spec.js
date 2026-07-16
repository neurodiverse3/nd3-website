import { test, expect } from '@playwright/test';

test.describe('Spoon Tracker Hydration & State Persistence', () => {
  test('should load and preserve custom localStorage values without overwriting them on reload', async ({ page }) => {
    await page.goto('/labs/spoon-tracker');
    
    // Set custom localStorage values
    await page.evaluate(() => {
      localStorage.setItem('nd3-spoon-tracker-max', '10');
      localStorage.setItem('nd3-spoon-tracker-banked', '2');
      localStorage.setItem('nd3-spoon-tracker-date', JSON.stringify(new Date().toDateString()));
      localStorage.setItem('nd3-spoon-tracker-tasks', JSON.stringify([
        { id: 'custom-1', title: 'Custom Test Task', cost: 2 }
      ]));
    });

    // Reload the page to trigger hydration
    await page.reload();

    // Verify custom values are hydrated and visible on the page
    // 10 max spoons should be visible
    await expect(page.locator('text=STARTING SPOONS FOR TODAY: 10')).toBeVisible();
    
    // 2 banked spoons should be visible
    await expect(page.locator('text=BANKED ENERGY: 2')).toBeVisible();
    
    // Custom task should be visible
    await expect(page.locator('text=Custom Test Task')).toBeVisible();

    // Reload again to make sure they were not overwritten on mount!
    await page.reload();
    
    await expect(page.locator('text=STARTING SPOONS FOR TODAY: 10')).toBeVisible();
    await expect(page.locator('text=BANKED ENERGY: 2')).toBeVisible();
    await expect(page.locator('text=Custom Test Task')).toBeVisible();
  });
});
