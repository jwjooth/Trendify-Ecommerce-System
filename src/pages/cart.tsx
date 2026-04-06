import { CartItem } from "../app/features/cart/components/CartItem";
import { CartSummary } from "../app/features/cart/components/CartSummary";
import { useCartPage } from "../app/features/cart/hooks/useCartPage";

const CartPage = () => {
  const { cart, handlers } = useCartPage();

  if (cart.items.length === 0) {
    return <div>Cart Empty</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        {cart.items.map((item) => (
          <CartItem key={item.product.id} item={item} handlers={handlers} />
        ))}
      </div>

      <CartSummary cart={cart} />
    </div>
  );
};

export default CartPage;
