// spec: specs/test-plans/site-pages.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Site Pages', () => {
  test('Blog Page — Posts & Reading Flow', async ({ page }) => {
    // 1. Open the "Blog" page from navigation
    await page.goto('https://bishal-thapaliya.netlify.app/about');
    const blogLink = page.getByRole('link', { name: 'Blog' });
    await blogLink.click();
    await expect(page).toHaveURL(/.*\/blog/);

    // Expect a list of posts or an empty state
    const postLocator = page.locator('article, .post, .blog-post').first();
    await expect(postLocator).toBeVisible();

    // 2. Open the first blog post
    if (await postLocator.locator('a').count() > 0) {
      await postLocator.locator('a').first().click();
      // Wait for a post/article heading inside the article or main region
      const postHeading = page.locator('article h1, article h2, .post h1, .post h2, main h1, main h2').first();
      if (await postHeading.count() > 0) await expect(postHeading).toBeVisible();
      // Ensure images have alt text
      const imgs = page.locator('article img, .post img');
      const imgCount = await imgs.count();
      for (let i = 0; i < imgCount; i++) {
        const alt = await imgs.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
        expect(alt!.trim().length).toBeGreaterThan(0);
      }
    }

    // 3. Share buttons (if present)
    const shareButtons = page.locator('a[href*="share"], [data-share], .share');
    if (await shareButtons.count() > 0) {
      await expect(shareButtons.first()).toBeVisible();
    }
  });
});
