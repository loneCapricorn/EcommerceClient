import { useEffect, useState } from 'react';
import { getProducts } from '../api/products.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">All Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}