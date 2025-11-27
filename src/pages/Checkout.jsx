import { useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext.jsx';
import { createOrder } from '../api/orders.js';
import { useState } from 'react';

export default function Checkout() {
  const { items, clearCart, totalAmount } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handlePlaceOrder() {
    try {
      setSubmitting(true);
      setError(null);
      await createOrder(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
      clearCart();
      navigate('/orders');
    } catch (e) {
      setError('Failed to place order. Ensure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!items.length) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      <div className="rounded border bg-white p-4">
        <div className="mb-2 text-sm text-gray-700">You will place an order for {items.length} item(s).</div>
        <div className="mb-4 text-lg font-semibold">Total: ${totalAmount.toFixed(2)}</div>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </div>
  );
}