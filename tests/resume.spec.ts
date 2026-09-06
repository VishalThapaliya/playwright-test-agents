// spec: specs/test-plans/site-pages.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Site Pages', () => {
  test('Resume Page — Load & Download CV', async ({ page, request }) => {
    // 1. Click the "Resume" link in the site navigation
    await page.goto('https://bishal-thapaliya.netlify.app/about');
    const resumeLink = page.getByRole('link', { name: 'Resume' });
    await resumeLink.click();
    await expect(page).toHaveURL(/.*\/resume/);
    // Expect the main resume title (use exact match for the primary heading)
    // Prefer the article title element for the resume page
    const resumeArticleHeading = page.locator('h2.article-title, h2.h2.article-title', { hasText: 'Resume' });
    if (await resumeArticleHeading.count() > 0) {
      await expect(resumeArticleHeading.first()).toBeVisible();
    } else {
      // fallback: look for Experience or Education headings
      const fallback = page.getByRole('heading', { name: /Experience|Education/ });
      if (await fallback.count() > 0) await expect(fallback.first()).toBeVisible();
    }

    // 2. Click the "Download CV" link in navigation or on page
    const downloadAnchor = page.locator('a[href*="Resume_Thapaliya_Bishal"][href$=".pdf"]').first();
    const href = await downloadAnchor.getAttribute('href');
    if (!href) {
      throw new Error('Download CV link not found');
    }

    const pdfUrl = href.startsWith('http') ? href : new URL(href, 'https://bishal-thapaliya.netlify.app').toString();
    const resp = await request.get(pdfUrl);
    expect(resp.status()).toBe(200);
    const contentType = resp.headers()['content-type'] || '';
    expect(contentType).toContain('pdf');

    // 3. Negative: if PDF not reachable, the above assertions will fail and surface status
  });
});
