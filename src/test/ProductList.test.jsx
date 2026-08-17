import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './testUtils';
import ProductList from '../pages/ProductList';

describe('ProductList', () => {
  it('renders all products by default', () => {
    renderWithProviders(<ProductList />, { path: '/' });
    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Yoga Mat')).toBeInTheDocument();
  });

  it('filters products by search query', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductList />, { path: '/' });
    await user.type(screen.getByRole('searchbox'), 'yoga');
    expect(screen.getByText('Yoga Mat')).toBeInTheDocument();
    expect(screen.queryByText('Running Shoes')).not.toBeInTheDocument();
  });

  it('filters products by category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductList />, { path: '/' });
    await user.selectOptions(screen.getByRole('combobox'), 'Electronics');
    expect(screen.getByText('Wireless Noise-Cancelling Headphones')).toBeInTheDocument();
    expect(screen.queryByText('Yoga Mat')).not.toBeInTheDocument();
  });

  it('shows empty state when no products match', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductList />, { path: '/' });
    await user.type(screen.getByRole('searchbox'), 'xyznonexistent');
    expect(screen.getByText(/no products match/i)).toBeInTheDocument();
  });

  it('shows out-of-stock label on unavailable products', () => {
    renderWithProviders(<ProductList />, { path: '/' });
    expect(screen.getByText('Bestselling Novel — The Last Journey')).toBeInTheDocument();
    expect(screen.getAllByText('Out of stock').length).toBeGreaterThan(0);
  });
});
