import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';

Then('I should see {string} in the header', async function (text) {
  const header = this.page.locator('header');
  await header.waitFor({ state: 'visible' });
  const content = await header.textContent();
  assert.ok(content.includes(text), `Header did not contain "${text}"`);
});

Then('the header should contain a cart link', async function () {
  const cartLink = this.page.locator('.cart-link');
  await cartLink.waitFor({ state: 'visible', timeout: 5000 });
});

Then('the cart badge should not be visible', async function () {
  const badge = this.page.locator('.cart-badge');
  const count = await badge.count();
  assert.strictEqual(count, 0, 'Cart badge should not be rendered when cart is empty');
});

Then('the cart badge should show {string}', async function (expected) {
  const badge = this.page.locator('.cart-badge');
  await badge.waitFor({ state: 'visible', timeout: 5000 });
  const text = await badge.textContent();
  assert.strictEqual(text.trim(), expected);
});
