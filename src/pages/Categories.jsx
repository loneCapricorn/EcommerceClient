import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories.js';
import Loader from '../components/Loader.jsx';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Categories</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((c) => (
            <li key={c.categoryId} className="rounded border bg-white p-4 shadow-sm">
              <div className="text-lg font-semibold">{c.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}