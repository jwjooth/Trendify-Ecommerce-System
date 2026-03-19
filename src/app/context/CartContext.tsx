import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Cart, CartItem, Product } from "../service/type";

/**
 * Cart Context for global cart state management
 * Using useReducer for predictable state updates
 */

interface CartContextType {
  cart: Cart;
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: Cart }
  | { type: "ADD_TO_WISHLIST"; payload: Product }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "LOAD_WISHLIST"; payload: Product[] };

const CART_STORAGE_KEY = "ecommerce-cart";
const WISHLIST_STORAGE_KEY = "ecommerce-wishlist";

// Calculate cart totals
const calculateCart = (items: CartItem[]): Cart => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return {
    items,
    totalItems,
    subtotal,
  };
};

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id,
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            product: action.payload.product,
            quantity: action.payload.quantity,
          },
        ];
      }

      return calculateCart(newItems);
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
      return calculateCart(newItems);
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

      return calculateCart(newItems);
    }

    case "CLEAR_CART": {
      return { items: [], totalItems: 0, subtotal: 0 };
    }

    case "LOAD_CART": {
      return action.payload;
    }

    default:
      return state;
  }
};

const wishlistReducer = (state: Product[], action: CartAction): Product[] => {
  switch (action.type) {
    case "ADD_TO_WISHLIST": {
      const exists = state.some((product) => product.id === action.payload.id);
      if (!exists) {
        return [...state, action.payload];
      }
      return state;
    }

    case "REMOVE_FROM_WISHLIST": {
      return state.filter((product) => product.id !== action.payload);
    }

    case "LOAD_WISHLIST": {
      return action.payload;
    }

    default:
      return state;
  }
};

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatchCart] = useReducer(cartReducer, initialCart);
  const [wishlist, dispatchWishlist] = useReducer(wishlistReducer, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatchCart({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatchWishlist({ type: "LOAD_WISHLIST", payload: parsedWishlist });
      } catch (error) {
        console.error("Failed to load wishlist from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatchCart({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatchCart({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatchCart({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatchCart({ type: "CLEAR_CART" });
  };

  const addToWishlist = (product: Product) => {
    dispatchWishlist({ type: "ADD_TO_WISHLIST", payload: product });
  };

  const removeFromWishlist = (productId: string) => {
    dispatchWishlist({ type: "REMOVE_FROM_WISHLIST", payload: productId });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((product) => product.id === productId);
  };

  const moveToCart = (productId: string) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
