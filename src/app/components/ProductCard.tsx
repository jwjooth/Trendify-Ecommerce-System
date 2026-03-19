import React from 'react';
import { Link } from 'react-router';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types/product';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardContent className="p-4">
          <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-2 flex-1">{product.name}</h3>
              {product.stock < 20 && (
                <Badge variant="destructive" className="text-xs">
                  Low Stock
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
