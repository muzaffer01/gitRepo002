import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const { itemCount } = useCart();
  return (
    <header className="site-header">
      <Link to="/" className="logo">
        SampleShop
      </Link>
      <nav>
        <Link to="/cart" className="cart-link" aria-label={`Cart, ${itemCount} items`}>
          🛒
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </Link>
      </nav>
    </header>
  );
}
