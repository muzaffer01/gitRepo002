import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Cart from '../pages/Cart';

const CART_KEY = 'sample-shop-cart';

function seedCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function renderCart() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <Cart />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('Cart', () => {
  it('shows empty state when cart is empty', () => {
    renderCart();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
  });

  it('renders cart items from localStorage', () => {
    seedCart([{ id: 1, name: 'Headphones', price: 79.99, image: '', quantity: 2 }]);
    renderCart();
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getAllByText('$159.98').length).toBeGreaterThanOrEqual(1);
  });

  it('updates line total when quantity changes', async () => {
    const user = userEvent.setup();
    seedCart([{ id: 1, name: 'Headphones', price: 79.99, image: '', quantity: 1 }]);
    renderCart();
    await user.selectOptions(screen.getByLabelText(/quantity for headphones/i), '3');
    expect(screen.getAllByText('$239.97').length).toBeGreaterThanOrEqual(1);
  });

  it('removes item when Remove is clicked', async () => {
    const user = userEvent.setup();
    seedCart([{ id: 1, name: 'Headphones', price: 79.99, image: '', quantity: 1 }]);
    renderCart();
    await user.click(screen.getByRole('button', { name: /remove headphones/i }));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('displays correct subtotal for multiple items', () => {
    seedCart([
      { id: 1, name: 'Item A', price: 10.00, image: '', quantity: 2 },
      { id: 2, name: 'Item B', price: 5.50, image: '', quantity: 3 },
    ]);
    renderCart();
    expect(screen.getByText('$36.50')).toBeInTheDocument();
  });
});
