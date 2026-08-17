import { useMemo, useState } from 'react';
import products from '../data/products';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ALL = 'All';

export default function ProductList() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.category))).sort()],
    []
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        (category === ALL || p.category === category) &&
        p.name.toLowerCase().includes(q)
    );
  }, [query, category]);

  return (
    <main className="product-list-page">
      <h1>Products</h1>
      <div className="filters">
        <input
          type="search"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
