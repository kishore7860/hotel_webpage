import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuService } from '../services/menuService';
import { CategoryList } from '../components/menu/CategoryList';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { LoadingScreen } from '../components/common/Spinner';

export function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ? parseInt(searchParams.get('category')) : null
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await menuService.getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        let data;
        if (selectedCategory) {
          const result = await menuService.getItemsByCategory(selectedCategory);
          data = result.items;
        } else {
          data = await menuService.getAllItems();
        }
        setItems(data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId.toString() });
    } else {
      setSearchParams({});
    }
  };

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.name
    : 'All Items';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Our Menu</h1>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedCategoryName}
          <span className="text-gray-500 font-normal text-base ml-2">
            ({items.length} items)
          </span>
        </h2>

        {loading ? (
          <LoadingScreen />
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No items found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
