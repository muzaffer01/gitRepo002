import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [confirmation, setConfirmation] = useState('');

  const product = getProductById(id);

  if (!product) {
    return (
      <main className="details-page">
        <p className="not-found">Product not found. <Link to="/">Back to products</Link></p>
      </main>
    );
  }

  const maxQty = Math.min(10, product.stock);

  function handleAddToCart() {
    addToCart(product, qty);
    setConfirmation(`${qty} × "${product.name}" added to cart!`);
    setTimeout(() => setConfirmation(''), 3000);
  }

  function handleBuyNow() {
    addToCart(product, qty);
    navigate('/cart');
  }

  return (
    <main className="details-page">
      <Link to="/" className="back-link">← Back to products</Link>
      <div className="details-layout">
        <img src={product.image} alt={product.name} className="details-img" />
        <div className="details-info">
          <h1>{product.name}</h1>
          <div className="details-meta">
            <span className="stars" aria-label={`${product.rating} stars`}>
              {'★'.repeat(Math.floor(product.rating))}
            </span>
            <span>{product.rating} ({product.reviewCount.toLocaleString()} reviews)</span>
          </div>
          <p className="details-price">${product.price.toFixed(2)}</p>
          <p className="details-desc">{product.description}</p>
          <p className={product.stock > 0 ? 'in-stock' : 'oos'}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <div className="details-actions">
              <label htmlFor="qty-select">Qty:</label>
              <select
                id="qty-select"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              >
                {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button className="btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn-secondary" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          )}

          {confirmation && <p className="confirmation" role="status">{confirmation}</p>}
        </div>
      </div>
    </main>
  );
}
