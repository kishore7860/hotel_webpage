export function CategoryList({ categories, selectedCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-sm">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${!selectedCategory
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === category.id
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
