import { useCart } from "@/app/features/cart/CartContext";
import { formatCurrency } from "@/app/lib/currency";
import { useProduct } from "@/app/shared/hooks/useProducts";
import { Badge } from "@/app/shared/ui/badge";
import { Button } from "@/app/shared/ui/button";
import { Separator } from "@/app/shared/ui/separator";
import { ArrowLeft, RefreshCw, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

const ProductDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { product, loading, error } = useProduct(id as string);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-64 w-64 mx-auto mb-4"></div>
          <div className="bg-gray-200 rounded h-8 w-48 mx-auto mb-2"></div>
          <div className="bg-gray-200 rounded h-4 w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          {error || "The product you're looking for doesn't exist."}
        </p>
        <Button onClick={() => router.push("/")}>Back to Products</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-3 capitalize">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
            <p className="text-4xl font-bold mb-6">{formatCurrency(product.price)}</p>
          </div>
          <Separator className="my-6" />
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span>1-year warranty included</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
              <span>30-day return policy</span>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Stock:</span>
              <Badge variant={product.stock > 20 ? "default" : "destructive"}>
                {product.stock} available
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1" disabled={product.stock === 0}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
