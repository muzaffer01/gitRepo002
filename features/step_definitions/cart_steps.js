import { Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';

Then('I should see the subtotal', async function () {
  const subtotalRow = this.page.locator('.subtotal-row');
  await subtotalRow.waitFor({ state: 'visible', timeout: 5000 });
});

When('I change the quantity of the first item to {string}', async function (qty) {
  const qtySelect = this.page.locator('.cart-qty-row select').first();
  await qtySelect.waitFor({ state: 'visible', timeout: 5000 });
  await qtySelect.selectOption(qty);
});

Then('the line total should be {string}', async function (expected) {
  const lineTotal = this.page.locator('.cart-line-total').first();
  await lineTotal.waitFor({ state: 'visible', timeout: 5000 });
  const text = await lineTotal.textContent();
  assert.strictEqual(text.trim(), expected, `Line total was "${text.trim()}", expected "${expected}"`);
});

When('I remove the first item from the cart', async function () {
  const removeBtn = this.page.locator('.remove-btn').first();
  await removeBtn.waitFor({ state: 'visible', timeout: 5000 });
  await removeBtn.click();
});
