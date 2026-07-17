import { test, expect } from '@playwright/test';

test.describe('Admin Command Centre Security and Session Authentication', () => {
  // Clear cookies and state before each test
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('should fail closed and return 401 on unauthorized access to diagnostics', async ({ request }) => {
    const res = await request.get('/api/admin/diagnostics');
    expect(res.status()).toBe(401);
  });

  test('should authenticate with correct passcode, not store password in localStorage, and allow logout', async ({ page }) => {
    await page.goto('/admin/command-centre');

    // Verify we see security gate
    await expect(page.locator('text=SECURITY GATE')).toBeVisible();

    const passcodeInput = page.locator('input[type="password"]');
    await expect(passcodeInput).toBeVisible();

    // Try logging in with correct passcode
    await passcodeInput.fill('test-secret-passcode');
    await page.click('button:has-text("AUTHENTICATE")');

    // Should successfully authenticate and show main dashboard
    await expect(page.locator('text=PRODUCTION INFRASTRUCTURE MONITOR')).toBeVisible();

    // Verify raw passcode is NOT in localStorage
    const storedPasscode = await page.evaluate(() => localStorage.getItem('nd3_admin_passcode'));
    expect(storedPasscode).toBeNull();

    // Verify cookie nd3_admin_session exists and is secure (cannot be read by document.cookie since HttpOnly)
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === 'nd3_admin_session');
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);

    // Try locking the session (logging out)
    await page.click('button:has-text("LOCK")');

    // Should return to security gate
    await expect(page.locator('text=SECURITY GATE')).toBeVisible();

    // Verify session cookie is deleted
    const cookiesAfterLogout = await page.context().cookies();
    const sessionCookieAfterLogout = cookiesAfterLogout.find(c => c.name === 'nd3_admin_session');
    expect(sessionCookieAfterLogout).toBeUndefined();
  });

  test('should rate limit and lock out after 5 failed login attempts', async ({ page, request }) => {
    // Reset lockout by changing context / clear cookies (though counter is IP based, let's test lockout directly)
    // We make 5 failed attempts via direct POST requests to verify API behavior
    for (let i = 0; i < 4; i++) {
      const res = await request.post('/api/admin/login', {
        data: { passcode: 'wrong-passcode' }
      });
      expect(res.status()).toBe(401);
      const json = await res.json();
      expect(json.error).toContain('attempts remaining');
    }

    // 5th attempt should lock out
    const res5 = await request.post('/api/admin/login', {
      data: { passcode: 'wrong-passcode' }
    });
    expect(res5.status()).toBe(401);
    const json5 = await res5.json();
    expect(json5.error).toContain('locked');

    // 6th attempt should return 429 Too Many Requests (Lockout active)
    const res6 = await request.post('/api/admin/login', {
      data: { passcode: 'wrong-passcode' }
    });
    expect(res6.status()).toBe(429);
    const json6 = await res6.json();
    expect(json6.error).toContain('Too many failed attempts');

    // Even correct passcode should fail during lockout
    const resCorrectDuringLockout = await request.post('/api/admin/login', {
      data: { passcode: 'test-secret-passcode' }
    });
    expect(resCorrectDuringLockout.status()).toBe(429);
  });
});
