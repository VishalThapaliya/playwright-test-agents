// spec: specs/test-plans/site-pages.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Site Pages', () => {
  test('Global Navigation & Footer — Integrity and Accessibility', async ({ page }) => {
    // 1. Verify main navigation links are present
    await page.goto('https://bishal-thapaliya.netlify.app/about');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Resume' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Portfolio' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();

    const download = nav.getByRole('link', { name: 'Download CV' });
    await expect(download).toBeVisible();
    const href = await download.getAttribute('href');
    expect(href).toBeTruthy();

    // 2. Keyboard navigation test (basic smoke)
    // Ensure the page has focusable elements (links, buttons, inputs, etc.)
    const focusables = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    expect(await focusables.count()).toBeGreaterThan(0);

    // 3. Footer & copyright
    await expect(page.getByRole('contentinfo')).toContainText('© 2026 | Bishal Thapaliya');
    const githubLinks = page.locator('a[href*="github.com"]');
    if (await githubLinks.count() > 0) {
      await expect(githubLinks.first()).toBeVisible();
    }

    // 4. 404 / unknown route behavior
    await page.goto('https://bishal-thapaliya.netlify.app/non-existent-route');
    // Expect a 404 friendly message or redirect to home: check for visible '404' text or a friendly redirect
    const notFound = page.locator('text=404');
    if (await notFound.count() > 0) {
      await expect(notFound.first()).toBeVisible();
    } else {
      // fallback: site should still render a navigation or home content
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
});
