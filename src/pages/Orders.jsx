import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orders.js';
import Loader from '../components/Loader.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Orders</h1>
      {!orders.length ? (
        <div>You have no orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.orderId} className="rounded border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order #{o.orderId}</div>
                <div className="text-sm text-gray-600">{new Date(o.orderDate).toLocaleString()}</div>
              </div>
              <div className="mt-2 text-sm">Total: ${Number(o.totalAmount).toFixed(2)}</div>
              {Array.isArray(o.orderItems) && o.orderItems.length > 0 && (
                <ul className="mt-3 list-disc pl-6 text-sm text-gray-700">
                  {o.orderItems.map((it) => (
                    <li key={it.orderItemId}>
                      Product #{it.productId} — qty {it.quantity} @ ${Number(it.unitPrice).toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}