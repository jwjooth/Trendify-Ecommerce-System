import React from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateTax, calculateShipping, calculateTotal } from '../utils/currency';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const tax = calculateTax(cart.subtotal);
  const shipping = calculateShipping(cart.subtotal);
  const total = calculateTotal(cart.subtotal, tax, shipping);

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, maxStock: number) => {
    if (newQuantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">{cart.totalItems} items in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground capitalize mb-3">
                      {item.product.category}
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.product.stock
                            )
                          }
                          className="px-3 py-1 hover:bg-muted transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.product.stock
                            )
                          }
                          className="px-3 py-1 hover:bg-muted transition-colors"
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.product.price)} each
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>

              {cart.subtotal < 100 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatCurrency(100 - cart.subtotal)} more for free shipping!
                </p>
              )}

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatCurrency(total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
              <Link to="/" className="w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
