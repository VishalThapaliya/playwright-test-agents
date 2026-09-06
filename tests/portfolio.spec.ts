// spec: specs/test-plans/site-pages.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Site Pages', () => {
  test('Portfolio Page — Projects & Interactions', async ({ page, request }) => {
    // 1. Navigate via the "Portfolio" link
    await page.goto('https://bishal-thapaliya.netlify.app/about');
    const portfolioLink = page.getByRole('link', { name: 'Portfolio' });
    await portfolioLink.click();
    await expect(page).toHaveURL(/.*\/portfolio/);

    // Expect at least one project card or project heading
    const projectLocator = page.locator('article, .project-card, .project, .card, .project-item').first();
    await expect(projectLocator).toBeVisible();

    // 2. Open the first project card (attempt click if it is a link or button)
    const firstCard = page.locator('article, .project-card, .project, .card, .project-item').first();
    if (await firstCard.locator('a').count() > 0) {
      await firstCard.locator('a').first().click();
      // Prefer a project detail container or a heading within the main/article region
      const detail = page.locator('.project-detail, .project-page, .project-modal, article .project-title, main h1, main h2, main h3').first();
      if (await detail.count() > 0) await expect(detail).toBeVisible();
    }

    // 3. If filters exist, try to interact with them
    const filter = page.locator('select, .filters, [role="tablist"]');
    if (await filter.count() > 0) {
      // attempt to select a value if select element present
      const sel = filter.locator('select');
      if (await sel.count() > 0) {
        const options = await sel.locator('option').allTextContents();
        if (options.length > 1) {
          await sel.selectOption(options[1]);
          await expect(projectLocator).toBeVisible();
        }
      }
    }

    // 4. Verify external project/demo links (basic coverage)
    const externalLink = page.locator('a[target="_blank"], a[href^="http"]').first();
    if (await externalLink.count() > 0) {
      const href = await externalLink.getAttribute('href');
      if (href && href.startsWith('http')) {
        const resp = await request.get(href);
        expect(resp.status()).toBeLessThan(400);
      }
    }
  });
});
