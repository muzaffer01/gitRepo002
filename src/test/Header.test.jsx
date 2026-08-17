import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header';

const CART_KEY = 'sample-shop-cart';

function renderHeader() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <Header />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders logo and cart link', () => {
    renderHeader();
    expect(screen.getByText('SampleShop')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });

  it('shows no badge when cart is empty', () => {
    renderHeader();
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('shows badge with item count from localStorage', () => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify([
        { id: 1, name: 'X', price: 10, image: '', quantity: 3 },
        { id: 2, name: 'Y', price: 5, image: '', quantity: 2 },
      ])
    );
    renderHeader();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
