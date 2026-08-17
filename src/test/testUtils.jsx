import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';

export function renderWithProviders(ui, { route = '/', path = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartProvider>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}
