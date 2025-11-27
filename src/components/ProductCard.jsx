import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <Link to={`/products/${product.productId}`} className="block">
        <h3 className="text-lg font-semibold">{product.name}</h3>
      </Link>
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-bold">${Number(product.price).toFixed(2)}</span>
        <button
          onClick={() => addToCart(product, 1)}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}