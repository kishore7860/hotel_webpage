import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuService } from '../services/menuService';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { RewardsBanner } from '../components/rewards/RewardsBanner';
import { Button } from '../components/common/Button';
import { LoadingScreen } from '../components/common/Spinner';
import { RESTAURANT_INFO } from '../utils/constants';

export function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, cats] = await Promise.all([
          menuService.getFeaturedItems(),
          menuService.getCategories()
        ]);
        setFeaturedItems(featured);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <RewardsBanner />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to {RESTAURANT_INFO.name}
          </h1>
          <p className="text-xl text-red-100 mb-8">
            Crispy, delicious chicken made fresh daily
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-1 text-yellow-400">
              <span className="text-2xl">★</span>
              <span className="text-xl font-semibold">{RESTAURANT_INFO.rating}</span>
            </div>
            <span className="text-red-200">|</span>
            <span className="text-red-100">{RESTAURANT_INFO.totalRatings} ratings</span>
            <span className="text-red-200">|</span>
            <span className="text-red-100">{RESTAURANT_INFO.prepTime}</span>
          </div>
          <Link to="/menu">
            <Button size="lg" className="bg-red-600 text-white hover:-translate-y-1 hover:shadow-xl hover:scale-105 transition-all duration-300">
              View Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.slice(0, 8).map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/menu">
              <Button variant="outline" size="lg">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map(category => (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🍗</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Preparation</h3>
              <p className="text-gray-600">{RESTAURANT_INFO.prepTime} average prep time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
              <p className="text-gray-600">FSSAI certified kitchen</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Earn Rewards</h3>
              <p className="text-gray-600">1 point for every ₹10 spent</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
