import { expect, test } from '@playwright/test';

test.describe('Product List', () => {
  test('renders 10 products with search and category filter', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Products');
    await expect(page.locator('.product-card')).toHaveCount(10);
    await expect(page.locator('input[type="search"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('search filters products by name', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="search"]', 'yoga');
    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.locator('.product-card')).toContainText('Yoga Mat');
  });

  test('category filter narrows product grid', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select', 'Electronics');
    await expect(page.locator('.product-card')).toHaveCount(3);
  });

  test('shows empty state when no products match', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="search"]', 'xyznonexistent');
    await expect(page.locator('.empty-state')).toContainText('No products match');
  });

  test('out-of-stock label visible on stock=0 products', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.out-of-stock').first()).toBeVisible();
  });

  test('product card navigates to details page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.product-card').first().click();
    await expect(page).toHaveURL(/\/products\/\d+/);
  });
});

test.describe('Product Details', () => {
  test('renders product info for a valid id', async ({ page }) => {
    await page.goto('/products/1');
    await expect(page.locator('h1')).toContainText('Headphones');
    await expect(page.locator('.details-price')).toContainText('$79.99');
    await expect(page.locator('.details-desc')).toBeVisible();
  });

  test('shows not-found for an unknown id', async ({ page }) => {
    await page.goto('/products/9999');
    await expect(page.locator('.not-found')).toContainText('not found');
    await expect(page.locator('.not-found a')).toBeVisible();
  });

  test('out-of-stock product shows no action buttons', async ({ page }) => {
    await page.goto('/products/8'); // stock: 0
    await expect(page.locator('.oos')).toContainText('Out of stock');
    await expect(page.locator('button')).toHaveCount(0);
  });

  test('Add to Cart shows confirmation message', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('[role="status"]')).toContainText('added to cart');
  });

  test('header badge increments after Add to Cart', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('.cart-badge')).toHaveText('1');
  });

  test('Buy Now navigates to /cart', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('button:has-text("Buy Now")');
    await expect(page).toHaveURL('/cart');
  });

  test('qty selector is capped at min(10, stock)', async ({ page }) => {
    await page.goto('/products/3'); // stock: 8
    const options = page.locator('#qty-select option');
    await expect(options).toHaveCount(8);
  });

  test('back link returns to product list', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('.back-link');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Cart', () => {
  test('shows empty state when cart is empty', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('.empty-cart')).toContainText('Your cart is empty');
    await expect(page.locator('.empty-cart a')).toBeVisible();
  });

  test('shows item after Add to Cart', async ({ page }) => {
    await page.goto('/products/2');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');
    await expect(page.locator('.cart-row')).toHaveCount(1);
    await expect(page.locator('.cart-name')).toContainText('Water Bottle');
  });

  test('line total updates when quantity changes', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');
    const initialTotal = await page.locator('.cart-line-total').textContent();
    await page.selectOption('[aria-label*="Quantity"]', '3');
    const updatedTotal = await page.locator('.cart-line-total').textContent();
    expect(updatedTotal).not.toBe(initialTotal);
  });

  test('removing an item shows empty cart', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');
    await page.click('.remove-btn');
    await expect(page.locator('.empty-cart')).toBeVisible();
  });

  test('cart persists after page reload', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');
    await page.reload();
    await expect(page.locator('.cart-row')).toHaveCount(1);
  });

  test('Checkout button is visible', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');
    await expect(page.locator('.checkout-btn')).toBeVisible();
  });
});

test.describe('Header', () => {
  test('logo links back to home', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('.logo');
    await expect(page).toHaveURL('/');
  });

  test('cart icon links to cart page', async ({ page }) => {
    await page.goto('/');
    await page.click('.cart-link');
    await expect(page).toHaveURL('/cart');
  });

  test('no badge shown when cart is empty', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.cart-badge')).toHaveCount(0);
  });
});
