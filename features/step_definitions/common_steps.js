import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';

Given('I am on the home page', async function () {
  await this.go('/');
});

Given('my cart is empty', async function () {
  await this.page.evaluate(() => localStorage.removeItem('sample-shop-cart'));
});

Given('I navigate to product with id {string}', async function (id) {
  await this.go(`/products/${id}`);
});

Given('I navigate to the out-of-stock product page', async function () {
  await this.go('/products/8'); // product 8: "Bestselling Novel" — stock=0
});

When('I navigate to the cart page', async function () {
  await this.go('/cart');
});

When('I navigate to the home page', async function () {
  await this.go('/');
});

When('I click the {string} button', async function (name) {
  await this.page.getByRole('button', { name }).click();
});

Then('the URL should be {string}', async function (path) {
  await this.page.waitForURL(`**${path}`, { timeout: 5000 });
  const { pathname } = new URL(this.page.url());
  assert.strictEqual(pathname, path);
});

Then('the URL should contain {string}', async function (fragment) {
  await this.page.waitForURL(`**${fragment}**`, { timeout: 5000 });
  assert.ok(this.page.url().includes(fragment), `URL did not contain "${fragment}"`);
});

Then('I should see {string} on the page', async function (text) {
  await this.page.waitForFunction(
    (t) => document.body.innerText.includes(t),
    text,
    { timeout: 5000 },
  );
});
