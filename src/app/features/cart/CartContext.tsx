import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Cart, CartItem, Product } from "../../service/type";
import { validateQuantity, validatePrice } from "../../utils/validation";
import { logger } from "../../lib";

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

const validateStoredCart = (data: unknown): Cart | null => {
  try {
    if (!data || typeof data !== "object") return null

    const cart = data as Record<string, unknown>;

    if (!Array.isArray(cart.items)) {
      logger.warn("Invalid cart structure: items is not an array");
      return null;
    }

    const validatedItems: CartItem[] = [];

    for (const item of cart.items) {
      if (!item || typeof item !== "object") continue;
      if (!item.product || typeof item.product !== "object") continue;

      const product = item.product as Record<string, unknown>;
      const quantity = item.quantity as number;

      if (!product.id || typeof product.id !== "string") continue;

      const quantityValidation = validateQuantity(quantity);
      if (!quantityValidation.isValid) {
        logger.warn("Invalid item quantity in cart", {
          productId: product.id,
          quantity,
        });
        continue;
      }

      const price = product.price as number;
      const priceValidation = validatePrice(price);
      if (!priceValidation.isValid) {
        logger.warn("Invalid product price", {
          productId: product.id,
          price,
        });
        continue;
      }

      validatedItems.push({
        product: {
          id: product.id as string,
          price: price,
          ...(typeof product === "object" ? product : {}),
        } as Product,
        quantity,
      });
    }

    return calculateCart(validatedItems);
  } catch (error) {
    logger.error("Failed to validate stored cart", { error });
    return null;
  }
};

const validateStoredWishlist = (data: unknown): Product[] => {
  try {
    if (!Array.isArray(data)) return []

    return data.filter((item) => {
      try {
        if (!item || typeof item !== "object") return false;
        const product = item as Record<string, unknown>;

        if (!product.id || typeof product.id !== "string") return false;
        if (typeof product.price !== "number" || product.price < 0)
          return false;

        return true;
      } catch {
        return false;
      }
    });
  } catch (error) {
    logger.error("Failed to validate stored wishlist", { error });
    return [];
  }
};

const calculateCart = (items: CartItem[]): Cart => {
  try {
    let totalItems = 0;
    let subtotal = 0;

    for (const item of items) {
      // Validate item before calculating
      const quantityValidation = validateQuantity(item.quantity);
      const priceValidation = validatePrice(item.product.price);

      if (!quantityValidation.isValid || !priceValidation.isValid) {
        logger.warn("Skipping invalid item in cart calculation", {
          productId: item.product.id,
        });
        continue;
      }

      totalItems += item.quantity;
      subtotal += item.product.price * item.quantity;
    }

    subtotal = Math.round(subtotal * 100) / 100;

    return {
      items,
      totalItems,
      subtotal,
    };
  } catch (error) {
    logger.error("Error calculating cart totals", { error });
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }
};

const cartReducer = (state: Cart, action: CartAction): Cart => {
  try {
    switch (action.type) {
      case "ADD_ITEM": {
        const quantityValidation = validateQuantity(action.payload.quantity);
        if (!quantityValidation.isValid) {
          logger.warn("Invalid quantity for add to cart", {
            quantity: action.payload.quantity,
            errors: quantityValidation.errors,
          });
          return state;
        }

        const priceValidation = validatePrice(action.payload.product.price);
        if (!priceValidation.isValid) {
          logger.warn("Invalid product price", {
            productId: action.payload.product.id,
            errors: priceValidation.errors,
          });
          return state;
        }

        const existingItemIndex = state.items.findIndex(
          (item) => item.product.id === action.payload.product.id,
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const newQuantity =
            state.items[existingItemIndex].quantity + action.payload.quantity;
          const newQuantityValidation = validateQuantity(newQuantity);

          if (!newQuantityValidation.isValid) {
            logger.warn("Quantity exceeds maximum", {
              productId: action.payload.product.id,
              newQuantity,
            });
            return state;
          }

          newItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: newQuantity }
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
        if (!action.payload || typeof action.payload !== "string") {
          logger.warn("Invalid product ID for removal");
          return state;
        }

        const newItems = state.items.filter(
          (item) => item.product.id !== action.payload,
        );
        return calculateCart(newItems);
      }

      case "UPDATE_QUANTITY": {
        const quantityValidation = validateQuantity(action.payload.quantity);
        if (!quantityValidation.isValid) {
          logger.warn("Invalid quantity update", {
            productId: action.payload.productId,
            quantity: action.payload.quantity,
            errors: quantityValidation.errors,
          });
          return state;
        }

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
        const validated = validateStoredCart(action.payload);
        return validated || { items: [], totalItems: 0, subtotal: 0 };
      }

      default:
        return state;
    }
  } catch (error) {
    logger.error("Error in cart reducer", { action, error });
    return state;
  }
};

const wishlistReducer = (state: Product[], action: CartAction): Product[] => {
  try {
    switch (action.type) {
      case "ADD_TO_WISHLIST": {
        const exists = state.some(
          (product) => product.id === action.payload.id,
        );
        if (!exists) {
          return [...state, action.payload];
        }
        return state;
      }

      case "REMOVE_FROM_WISHLIST": {
        if (!action.payload || typeof action.payload !== "string") {
          logger.warn("Invalid product ID for wishlist removal");
          return state;
        }

        return state.filter((product) => product.id !== action.payload);
      }

      case "LOAD_WISHLIST": {
        const validated = validateStoredWishlist(action.payload);
        return validated;
      }

      default:
        return state;
    }
  } catch (error) {
    logger.error("Error in wishlist reducer", { action, error });
    return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatchCart] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    subtotal: 0,
  });
  const [wishlist, dispatchWishlist] = useReducer(wishlistReducer, []);

  // Load cart from localStorage on mount with validation
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const validatedCart = validateStoredCart(parsedCart);

        if (validatedCart) {
          dispatchCart({ type: "LOAD_CART", payload: validatedCart });
          logger.debug("Cart loaded from localStorage");
        } else {
          logger.warn("Stored cart failed validation, using empty cart");
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch (error) {
        logger.error("Failed to parse cart from localStorage", { error });
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Load wishlist from localStorage on mount with validation
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        const validatedWishlist = validateStoredWishlist(parsedWishlist);

        dispatchWishlist({
          type: "LOAD_WISHLIST",
          payload: validatedWishlist,
        });
        logger.debug("Wishlist loaded from localStorage");
      } catch (error) {
        logger.error("Failed to parse wishlist from localStorage", { error });
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      logger.debug("Cart saved to localStorage");
    } catch (error) {
      logger.error("Failed to save cart to localStorage", { error });
      // Handle quota exceeded error
      if (error instanceof DOMException && error.code === 22) {
        logger.warn("localStorage quota exceeded, clearing old data");
        try {
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (retryError) {
          logger.error("Failed to save after clearing wishlist", {
            retryError,
          });
        }
      }
    }
  }, [cart]);

  // Save wishlist to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      logger.debug("Wishlist saved to localStorage");
    } catch (error) {
      logger.error("Failed to save wishlist to localStorage", { error });
    }
  }, [wishlist]);

  // Cleanup expired data on mount
  useEffect(() => {
    const cleanupTimer = setInterval(() => {
      sessionStorage.clear();
    }, 3600000); // Clear session storage every hour

    return () => clearInterval(cleanupTimer);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (!product || !product.id) {
      logger.warn("Cannot add invalid product to cart");
      return;
    }

    dispatchCart({
      type: "ADD_ITEM",
      payload: { product, quantity },
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    if (!productId || typeof productId !== "string") {
      logger.warn("Cannot remove item without valid product ID");
      return;
    }

    dispatchCart({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId || typeof productId !== "string") {
      logger.warn("Cannot update quantity without valid product ID");
      return;
    }

    dispatchCart({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatchCart({ type: "CLEAR_CART" });
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    if (!product || !product.id) {
      logger.warn("Cannot add invalid product to wishlist");
      return;
    }

    dispatchWishlist({ type: "ADD_TO_WISHLIST", payload: product });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    if (!productId || typeof productId !== "string") {
      logger.warn("Cannot remove item without valid product ID");
      return;
    }

    dispatchWishlist({ type: "REMOVE_FROM_WISHLIST", payload: productId });
  }, []);

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlist.some((product) => product.id === productId);
    },
    [wishlist],
  );

  const moveToCart = useCallback(
    (productId: string) => {
      if (!productId || typeof productId !== "string") {
        logger.warn("Cannot move item without valid product ID");
        return;
      }

      const product = wishlist.find((p) => p.id === productId);
      if (product) {
        addToCart(product);
        removeFromWishlist(productId);
      } else {
        logger.warn("Product not found in wishlist", { productId });
      }
    },
    [wishlist, addToCart, removeFromWishlist],
  );

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
