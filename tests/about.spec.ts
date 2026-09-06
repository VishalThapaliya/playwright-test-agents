// spec: specs/test-plans/site-pages.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Site Pages', () => {
  test('About Page — Content & Links', async ({ page }) => {
    // 1. Navigate to https://bishal-thapaliya.netlify.app/about
    await page.goto('https://bishal-thapaliya.netlify.app/about');
    await expect(page).toHaveTitle(/Portfolio | Bishal Thapaliya/);
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();

    // 2. Verify left column (profile) content
    await expect(page.locator('img[alt*="Bishal Avatar"]')).toBeVisible();
    // Use the contact-title class to avoid matching svg/title text
    await expect(page.locator('p.contact-title', { hasText: 'Email' })).toBeVisible();
    await expect(page.locator('p.contact-title', { hasText: 'Phone' })).toBeVisible();
    await expect(page.locator('p.contact-title', { hasText: 'Birthday' })).toBeVisible();
    await expect(page.locator('p.contact-title', { hasText: 'Location' })).toBeVisible();
    await expect(page.locator('text=vishal.thapaliya@gmail.com')).toBeVisible();
    await expect(page.locator('text=07 68 31 94 27')).toBeVisible();
    await expect(page.locator('text=Grenoble, France')).toBeVisible();

    // 3. Verify social links in profile
    await expect(page.locator('a[href*="github.com"]')).toHaveCount(1);
    await expect(page.locator('a[href*="linkedin.com"]')).toHaveCount(1);
    await expect(page.locator('a[href*="x.com"], a[href*="twitter.com"]')).toHaveCount(1);
    await expect(page.locator('a[href*="xing.com"]')).toHaveCount(1);

    // 4. Verify main content sections
    await expect(page.getByRole('heading', { name: 'Web design', level: 4 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Web development', level: 4 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mobile apps', level: 4 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Photography', level: 4 })).toBeVisible();

    // Testimonials: ensure at least one author heading exists
    const testimonialHeadings = await page.locator('article h4, .testimonials h4, li h4').count();
    expect(testimonialHeadings).toBeGreaterThan(0);

    // 5. Accessibility & responsiveness checks
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('complementary')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
  });
});
