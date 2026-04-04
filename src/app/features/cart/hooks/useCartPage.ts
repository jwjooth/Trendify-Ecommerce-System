import { useState, useCallback } from "react";
import { useCart } from "../CartContext";
import { SavedItem } from "@/app/service/type";
import { toast } from "sonner";

export const useCartPage = () => {
  const {
    cart,
    wishlist,
    removeFromCart,
    updateQuantity,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
  } = useCart();

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const handleRemoveItem = useCallback(
    (id: string, name: string) => {
      removeFromCart(id);
      toast.success(`${name} removed`);
    },
    [removeFromCart],
  );

  const handleUpdateQuantity = useCallback(
    (id: string, qty: number, stock: number) => {
      if (qty > stock) return toast.error(`Max ${stock}`);
      if (qty <= 0) {
        const item = cart.items.find((i) => i.product.id === id);
        handleRemoveItem(id, item?.product.name ?? "Item");
        return;
      }
      updateQuantity(id, qty);
    },
    [cart.items, updateQuantity, handleRemoveItem],
  );

  const handleSaveForLater = useCallback(
    (id: string) => {
      const item = cart.items.find((i) => i.product.id === id);
      if (!item) return;

      setSavedItems((prev) =>
        prev.some((p) => p.product.id === id)
          ? prev
          : [...prev, { product: item.product, quantity: item.quantity }],
      );

      removeFromCart(id);
      toast.success(`${item.product.name} saved`);
    },
    [cart.items, removeFromCart],
  );

  const handleMoveBackToCart = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.product.id !== id));
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return {
    cart,
    wishlist,
    savedItems,
    handlers: {
      handleRemoveItem,
      handleUpdateQuantity,
      handleSaveForLater,
      handleMoveBackToCart,
      handleWishlistToggle,
      moveToCart,
    },
  };
};
