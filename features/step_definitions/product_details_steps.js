import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';

Then('the {string} button should not be visible', async function (name) {
  const btn = this.page.getByRole('button', { name });
  const count = await btn.count();
  assert.strictEqual(count, 0, `Button "${name}" should not be rendered for out-of-stock products`);
});

Then('I should see a confirmation message', async function () {
  const status = this.page.locator('[role="status"]');
  await status.waitFor({ state: 'visible', timeout: 5000 });
  const text = await status.textContent();
  assert.ok(text.includes('added to cart'), `Confirmation message not found. Got: "${text}"`);
});

Then('the quantity selector should have {string} options', async function (expected) {
  const select = this.page.locator('#qty-select');
  await select.waitFor({ state: 'visible', timeout: 5000 });
  const optionCount = await select.locator('option').count();
  assert.strictEqual(
    String(optionCount),
    expected,
    `Expected ${expected} qty options but found ${optionCount}`,
  );
});

When('I click the back to products link', async function () {
  await this.page.locator('.back-link').click();
});
