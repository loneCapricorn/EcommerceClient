import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api/products.js';
import Loader from '../components/Loader.jsx';
import { useCart } from '../state/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (e) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="text-3xl font-bold">${Number(product.price).toFixed(2)}</div>
        <div className="mt-4 flex items-center gap-3">
          <label htmlFor="qty" className="text-sm">Qty</label>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
            className="w-20 rounded border px-2 py-1"
          />
          <button
            onClick={() => addToCart(product, qty)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add to cart
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-600">In stock: {product.stock}</div>
      </div>
    </div>
  );
}