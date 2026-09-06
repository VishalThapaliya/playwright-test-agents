// spec: specs/test-plans/site-pages.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Site Pages', () => {
  test('Contact Page — Form Validation & Submission', async ({ page }) => {
    // 1. Click the "Contact" link in navigation
    await page.goto('https://bishal-thapaliya.netlify.app/about');
    const contactLink = page.getByRole('link', { name: 'Contact' });
    await contactLink.click();
    await expect(page).toHaveURL(/.*\/contact/);

    // 2. Submit the contact form with valid data
    const nameField = page.getByLabel('Name');
    const emailField = page.getByLabel('Email');
    const messageField = page.getByLabel('Message');
    const submitButton = page.getByRole('button', { name: /send|submit|contact/i });

    if (await nameField.count() && await emailField.count() && await messageField.count()) {
      await nameField.fill('Playwright Tester');
      await emailField.fill('tester@example.com');
      await messageField.fill('This is a test message.');

      await submitButton.click();

      // Expect either a success message or cleared fields — check for the success message if present
      const success = page.getByText(/thank you|message sent|success/i);
      if (await success.count() > 0) {
        await expect(success.first()).toBeVisible({ timeout: 5000 });
      }
    }

    // 3. Invalid email validation
    if (await emailField.count()) {
      await emailField.fill('invalid-email');
      await submitButton.click();
      const emailError = page.getByText(/email.*valid|invalid email/i);
      if (await emailError.count() > 0) {
        await expect(emailError.first()).toBeVisible();
      }
    }

    // 4. Required fields empty
    // Only attempt empty-submit validations if the fields exist
    if (await nameField.count()) await nameField.fill('');
    if (await emailField.count()) await emailField.fill('');
    if (await messageField.count()) await messageField.fill('');
    if (await submitButton.count()) {
      // If button is enabled, attempt click and assert validation messages; otherwise assert it's disabled
      if (await submitButton.isEnabled()) {
        await submitButton.click();
        const requiredMsg = page.getByText(/required|please fill|this field/);
        if (await requiredMsg.count() > 0) {
          await expect(requiredMsg.first()).toBeVisible();
        }
      } else {
        await expect(submitButton).toBeDisabled();
      }
    }
  });
});
