import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuService } from '../services/menuService';
import { MenuItemDetail } from '../components/menu/MenuItemDetail';
import { LoadingScreen } from '../components/common/Spinner';

export function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await menuService.getItemById(id);
        setItem(data);
      } catch (err) {
        setError('Item not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{error}</h2>
        <Link to="/menu" className="text-red-600 hover:text-red-700">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        to="/menu"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Menu
      </Link>

      <MenuItemDetail item={item} />
    </div>
  );
}
