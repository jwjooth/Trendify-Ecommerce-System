import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import { Product } from "../service/type";
import { formatCurrency } from "../lib/currency";
import { useCart } from "../modules/cart/CartContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`,
    );
  };

  const handleDoubleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className="block group cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>

          <CardContent className="p-4">
            <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100 relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay with quick actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleQuickView}
                  className="backdrop-blur-sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Quick View
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {product.stock < 20 && product.stock > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Low Stock
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium ml-1">
                  {product.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-bold">
                  {formatCurrency(product.price)}
                </span>
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              onClick={handleAddToCart}
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick View Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{product.name}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {formatCurrency(product.price)}
                </p>
                <Badge variant="secondary" className="capitalize mb-4">
                  {product.category}
                </Badge>
              </div>

              <div className="flex items-center gap-1 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium ml-2">{product.rating}</span>
                <span className="text-muted-foreground ml-1">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span
                    className={
                      product.stock < 20 ? "text-orange-600 font-medium" : ""
                    }
                  >
                    {product.stock} available
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="capitalize">{product.category}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
