import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>
        <p className="empty-cart">
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-row">
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <p className="cart-name">{item.name}</p>
                <p className="cart-unit-price">${item.price.toFixed(2)} each</p>
                <div className="cart-qty-row">
                  <label htmlFor={`qty-${item.id}`}>Qty:</label>
                  <select
                    id={`qty-${item.id}`}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    aria-label={`Quantity for ${item.name}`}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="cart-line-total">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="subtotal-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
          <Link to="/" className="continue-link">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
