import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProductDetails from '../pages/ProductDetails';

function renderDetails(id) {
  return render(
    <MemoryRouter initialEntries={[`/products/${id}`]}>
      <CartProvider>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<div>Cart Page</div>} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('ProductDetails', () => {
  it('renders product info for a valid id', () => {
    renderDetails(1);
    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    expect(screen.getByText('$79.99')).toBeInTheDocument();
    expect(screen.getByText(/30-hour battery/i)).toBeInTheDocument();
  });

  it('shows not found for an unknown id', () => {
    renderDetails(9999);
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to products/i })).toBeInTheDocument();
  });

  it('shows out-of-stock product without add/buy buttons', () => {
    renderDetails(8); // stock: 0
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });

  it('adds to cart and shows confirmation', async () => {
    const user = userEvent.setup();
    renderDetails(1);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(await screen.findByRole('status')).toHaveTextContent(/added to cart/i);
  });

  it('buy now navigates to cart', async () => {
    const user = userEvent.setup();
    renderDetails(1);
    await user.click(screen.getByRole('button', { name: /buy now/i }));
    expect(await screen.findByText('Cart Page')).toBeInTheDocument();
  });

  it('quantity selector is capped at min(10, stock)', () => {
    renderDetails(3); // stock: 8
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(8);
  });
});
