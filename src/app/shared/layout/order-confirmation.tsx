import type { NextPage } from "next";
import { useRouter } from "next/router";
import { CheckCircle, Download, MapPin } from "lucide-react";
import { Button } from "@/app/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/ui/card";
import { Separator } from "@/app/shared/ui/separator";

const OrderConfirmationPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const mockOrder = {
    id: id || "ORD-1234567890",
    date: new Date().toLocaleDateString(),
    total: "$199.99",
    estimatedDelivery: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString(),
    items: [
      { name: "Premium Wireless Headphones", quantity: 1, price: "$199.99" },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg mb-2">
            Thank you for your purchase
          </p>
          <p className="text-2xl font-bold text-green-600 mb-8">
            Order #{mockOrder.id}
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockOrder.date}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estimated Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {mockOrder.estimatedDelivery}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center pb-4 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{item.price}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">{mockOrder.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-1">John Doe</p>
            <p className="text-muted-foreground">123 Main St</p>
            <p className="text-muted-foreground">New York, NY 10001</p>
            <p className="text-muted-foreground">USA</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/")} variant="outline">
            Continue Shopping
          </Button>
          <Button onClick={() => alert("Invoice would be downloaded")}>
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center bg-blue-50 p-6 rounded-lg">
          <p className="text-muted-foreground mb-2">
            Thank you for your order!
          </p>
          <p className="text-muted-foreground">
            You will receive a tracking number via email shortly.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Questions? Contact our support team at support@trendify.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
