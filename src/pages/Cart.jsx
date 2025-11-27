import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext.jsx';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalAmount, totalQuantity } = useCart();

  if (!items.length) {
    return (
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Your Cart</h1>
        <p className="mb-4 text-gray-600">Your cart is empty.</p>
        <Link to="/products" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between rounded border bg-white p-4">
              <div>
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-gray-600">${Number(i.price).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={i.quantity}
                  onChange={(e) => updateQuantity(i.productId, Number(e.target.value) || 1)}
                  className="w-20 rounded border px-2 py-1"
                />
                <button onClick={() => removeFromCart(i.productId)} className="text-sm text-red-600 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded border bg-white p-4 h-fit">
          <div className="mb-2 text-lg font-semibold">Summary</div>
          <div className="flex justify-between text-sm"><span>Items</span><span>{totalQuantity}</span></div>
          <div className="mt-2 flex justify-between text-base font-bold"><span>Total</span><span>${totalAmount.toFixed(2)}</span></div>
          <Link to="/checkout" className="mt-4 block rounded bg-green-600 px-4 py-2 text-center text-white hover:bg-green-700">Checkout</Link>
        </div>
      </div>
    </div>
  );
}