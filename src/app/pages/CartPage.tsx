import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Heart,
  Save,
  Plus,
  Minus,
  Gift,
  Shield,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  formatCurrency,
  calculateTax,
  calculateShipping,
  calculateTotal,
} from "../utils/currency";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";

export const CartPage: React.FC = () => {
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
  const navigate = useNavigate();
  const [savedForLater, setSavedForLater] = useState<string[]>([]);

  const tax = calculateTax(cart.subtotal);
  const shipping = calculateShipping(cart.subtotal);
  const total = calculateTotal(cart.subtotal, tax, shipping);

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleUpdateQuantity = (
    productId: string,
    newQuantity: number,
    maxStock: number,
  ) => {
    if (newQuantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    if (newQuantity <= 0) {
      handleRemoveItem(productId, "Item");
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleSaveForLater = (productId: string, productName: string) => {
    setSavedForLater((prev) => [...prev, productId]);
    handleRemoveItem(productId, productName);
    toast.success(`${productName} saved for later`);
  };

  const handleMoveToCart = (productId: string) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      moveToCart(productId);
      toast.success(`${product.name} moved to cart`);
    }
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const savedItems = cart.items.filter((item) =>
    savedForLater.includes(item.product.id),
  );

  if (cart.items.length === 0 && wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="relative mb-6">
              <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground" />
              <Heart className="w-8 h-8 absolute -top-2 -right-2 text-muted-foreground/50" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Discover amazing products and add them to your cart or wishlist to
              get started.
            </p>
            <div className="space-y-3">
              <Link to="/products">
                <Button size="lg" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Browse our curated collection of premium products
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cart.totalItems} items in your cart • {wishlist.length} items in
            wishlist
          </p>
        </div>

        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart ({cart.totalItems})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Wishlist ({wishlist.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Saved ({savedForLater.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <Card
                    key={item.product.id}
                    className="hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="shrink-0"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-28 h-28 object-cover rounded-lg hover:scale-105 transition-transform"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <Link to={`/product/${item.product.id}`}>
                              <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWishlistToggle(item.product)}
                              className={`shrink-0 ${isInWishlist(item.product.id) ? "text-red-500" : "text-muted-foreground"}`}
                            >
                              <Heart
                                className={`w-4 h-4 ${isInWishlist(item.product.id) ? "fill-current" : ""}`}
                              />
                            </Button>
                          </div>

                          <Badge
                            variant="secondary"
                            className="mb-3 capitalize"
                          >
                            {item.product.category}
                          </Badge>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Enhanced Quantity Controls */}
                              <div className="flex items-center border-2 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product.id,
                                      item.quantity - 1,
                                      item.product.stock,
                                    )
                                  }
                                  className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 border-x bg-background min-w-[3rem] text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product.id,
                                      item.quantity + 1,
                                      item.product.stock,
                                    )
                                  }
                                  className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <span className="text-sm text-muted-foreground">
                                {item.product.stock} available
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSaveForLater(
                                    item.product.id,
                                    item.product.name,
                                  )
                                }
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveItem(
                                    item.product.id,
                                    item.product.name,
                                  )
                                }
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-primary">
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
                <Card className="sticky top-20 shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gift className="w-5 h-5 mr-2" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({cart.totalItems} items)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(cart.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <Truck className="w-4 h-4 mr-1" />
                        Shipping
                      </span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-semibold">
                            FREE
                          </span>
                        ) : (
                          formatCurrency(shipping)
                        )}
                      </span>
                    </div>

                    {cart.subtotal < 100 && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 font-medium mb-1">
                          🎁 Free Shipping Available!
                        </p>
                        <p className="text-xs text-blue-600">
                          Add {formatCurrency(100 - cart.subtotal)} more to
                          qualify
                        </p>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="text-3xl font-bold text-primary">
                        {formatCurrency(total)}
                      </span>
                    </div>

                    {/* Security Badges */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Shield className="w-4 h-4 mr-1 text-green-600" />
                        Secure
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Truck className="w-4 h-4 mr-1 text-blue-600" />
                        Fast Shipping
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                    </Button>
                    <Link to="/products" className="w-full">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            {wishlist.length === 0 ? (
              <Card className="p-8 text-center">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-muted-foreground mb-4">
                  Save items for later to keep track of products you love
                </p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      </Link>
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-4">
                        {formatCurrency(product.price)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleMoveToCart(product.id)}
                          className="flex-1"
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWishlistToggle(product)}
                        >
                          <Heart className="w-4 h-4 fill-current text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedForLater.length === 0 ? (
              <Card className="p-8 text-center">
                <Save className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved items</h3>
                <p className="text-muted-foreground">
                  Items you save for later will appear here
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-muted-foreground">
                            {formatCurrency(item.product.price)}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSavedForLater((prev) =>
                              prev.filter((id) => id !== item.product.id),
                            );
                            toast.success(
                              `${item.product.name} moved back to cart`,
                            );
                          }}
                        >
                          Move to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
