import { createContext, useContext, useReducer, useEffect } from 'react';
import { TAX_RATE } from '../utils/constants';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'star_chicken_cart';

const initialState = {
  items: [],
  discount: null,
  pointsToRedeem: 0
};

function calculateTotals(items, discount, pointsToRedeem) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (discount) {
    if (discount.type === 'percentage') {
      discountAmount = (subtotal * discount.value) / 100;
      if (discount.max_discount_amount) {
        discountAmount = Math.min(discountAmount, discount.max_discount_amount);
      }
    } else {
      discountAmount = discount.value;
    }
  }

  const pointsDiscount = Math.floor(pointsToRedeem / 10);
  const totalDiscount = discountAmount + pointsDiscount;
  const afterDiscount = Math.max(0, subtotal - totalDiscount);
  const tax = Math.round(afterDiscount * TAX_RATE * 100) / 100;
  const total = Math.round((afterDiscount + tax) * 100) / 100;

  return { subtotal, discountAmount: totalDiscount, tax, total };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems;

      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }

      return { ...state, items: newItems };
    }

    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    }

    case 'UPDATE_INSTRUCTIONS': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, special_instructions: action.payload.instructions } : item
        )
      };
    }

    case 'SET_DISCOUNT': {
      return { ...state, discount: action.payload };
    }

    case 'CLEAR_DISCOUNT': {
      return { ...state, discount: null };
    }

    case 'SET_POINTS_TO_REDEEM': {
      return { ...state, pointsToRedeem: action.payload };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const updateInstructions = (id, instructions) => dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { id, instructions } });
  const setDiscount = (discount) => dispatch({ type: 'SET_DISCOUNT', payload: discount });
  const clearDiscount = () => dispatch({ type: 'CLEAR_DISCOUNT' });
  const setPointsToRedeem = (points) => dispatch({ type: 'SET_POINTS_TO_REDEEM', payload: points });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totals = calculateTotals(state.items, state.discount, state.pointsToRedeem);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items: state.items,
    discount: state.discount,
    pointsToRedeem: state.pointsToRedeem,
    ...totals,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    updateInstructions,
    setDiscount,
    clearDiscount,
    setPointsToRedeem,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
