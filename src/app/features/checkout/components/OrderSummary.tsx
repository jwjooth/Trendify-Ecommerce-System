import { formatCurrency } from "@/app/lib/currency";
import { Badge } from "@/app/shared/ui/badge";
import { Button } from "@/app/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/ui/card";
import { Separator } from "@/app/shared/ui/separator";
import { CheckCircle, CreditCard, Lock, Shield, Truck } from "lucide-react";
import React, { memo } from "react";
import { useCart } from "../../cart/CartContext";

interface OrderSummaryProps {
  tax: number;
  shipping: number;
  total: number;
  isProcessing: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = memo(
  ({ tax, shipping, total, isProcessing }) => {
    const { cart } = useCart();

    return (
      <Card className="sticky top-20 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-right">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
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
                  <Badge variant="secondary" className="text-green-600">
                    FREE
                  </Badge>
                ) : (
                  formatCurrency(shipping)
                )}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total</span>
            <span className="text-3xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t">
            <div className="flex items-center text-xs text-muted-foreground">
              <Shield className="w-4 h-4 mr-1 text-green-600" />
              Secure SSL
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Lock className="w-4 h-4 mr-1 text-blue-600" />
              Encrypted
            </div>
          </div>

          {/* CTA */}
          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            <CreditCard className="w-4 h-4 mr-2" />
            {isProcessing ? "Processing Order..." : `Pay ${formatCurrency(total)}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By placing your order, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    );
  },
);

OrderSummary.displayName = "OrderSummary";
