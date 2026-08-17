import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';

Then('I should see {int} product cards', async function (expected) {
  await this.page.waitForSelector('.product-card', { timeout: 5000 });
  const count = await this.page.locator('.product-card').count();
  assert.strictEqual(count, expected, `Expected ${expected} product cards but found ${count}`);
});

When('I type {string} in the search box', async function (text) {
  await this.page.getByLabel('Search products').fill(text);
});

Then('I should see a product named {string}', async function (name) {
  const card = this.page.locator('.product-card', { hasText: name });
  await card.waitFor({ state: 'visible', timeout: 5000 });
});

Then('I should not see a product named {string}', async function (name) {
  const card = this.page.locator('.product-card', { hasText: name });
  const count = await card.count();
  assert.strictEqual(count, 0, `Product "${name}" should not be visible`);
});

When('I select the category {string}', async function (category) {
  await this.page.getByLabel('Filter by category').selectOption(category);
});

When('I click on the first product card', async function () {
  await this.page.locator('.product-card').first().click();
});
