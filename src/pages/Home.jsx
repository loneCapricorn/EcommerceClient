import { useEffect, useState } from 'react';
import { getProducts } from '../api/products.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (e) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <section className="mb-8 rounded-lg bg-blue-50 p-6">
        <h1 className="text-2xl font-bold">Welcome to ECommerce</h1>
        <p className="mt-2 text-gray-700">Browse products, add to cart, and place orders.</p>
      </section>
      <h2 className="mb-4 text-xl font-semibold">Featured Products</h2>
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