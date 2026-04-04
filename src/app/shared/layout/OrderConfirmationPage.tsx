import React from "react";
import { useParams, useLocation, Link } from "react-router";
import { CheckCircle, Package, Truck } from "lucide-react";
import { formatCurrency } from "../../lib/currency";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { orderId, total, shippingAddress } = location.state || {};

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
        </div>

        <Card className="text-left mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-mono font-semibold">{orderId || id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-bold text-lg">
                {total ? formatCurrency(total) : "N/A"}
              </span>
            </div>

            {shippingAddress && (
              <div>
                <p className="text-muted-foreground mb-2">Shipping Address</p>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.addressLine1}</p>
                  {shippingAddress.addressLine2 && (
                    <p>{shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                  <p>{shippingAddress.phone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Processing</h3>
              <p className="text-sm text-muted-foreground">
                Your order is being prepared for shipment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Truck className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Estimated Delivery</h3>
              <p className="text-sm text-muted-foreground">3-5 business days</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address.
          </p>
          <Link to="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
