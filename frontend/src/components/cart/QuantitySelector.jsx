export function QuantitySelector({ quantity, onChange, min = 1 }) {
  return (
    <div className="flex items-center border rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min - 1, quantity - 1))}
        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium"
        disabled={quantity <= min - 1}
      >
        -
      </button>
      <span className="px-4 py-1 text-center font-medium min-w-[40px]">
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium"
      >
        +
      </button>
    </div>
  );
}
