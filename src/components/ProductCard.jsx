import { Link } from 'react-router-dom';
import './ProductCard.css';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="card-body">
        <h3>{product.name}</h3>
        <div className="card-meta">
          <Stars rating={product.rating} />
          <span className="review-count">({product.reviewCount.toLocaleString()})</span>
        </div>
        <p className="price">${product.price.toFixed(2)}</p>
        {product.stock === 0 && <p className="out-of-stock">Out of stock</p>}
      </div>
    </Link>
  );
}
