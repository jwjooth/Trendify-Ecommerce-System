import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { CreditCard, Lock, MapPin, Shield, Truck } from "lucide-react";
import { useCart } from "@/app/features/cart/CartContext";
import {
  formatCurrency,
  calculateTax,
  calculateShipping,
  calculateTotal,
} from "@/app/lib/currency";
import { PaymentMethod, Address } from "@/app/service/type";
import { Button } from "@/app/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/ui/card";
import { Input } from "@/app/shared/ui/input";
import { Label } from "@/app/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/ui/select";
import { Separator } from "@/app/shared/ui/separator";
import { Checkbox } from "@/app/shared/ui/checkbox";
import { toast } from "sonner";

const CheckoutPage: NextPage = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // const [billingAddress, setBillingAddress] = useState<Address>(shippingAddress);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const tax = calculateTax(cart.subtotal);
  const shipping = calculateShipping(cart.subtotal);
  const total = calculateTotal(cart.subtotal, tax, shipping);

  const handleCheckout = async () => {
    if (!shippingAddress.fullName) {
      toast.error("Please enter a full name");
      return;
    }
    if (!shippingAddress.addressLine1) {
      toast.error("Please enter an address");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const orderId = `ORD-${Date.now()}`;
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation?id=${orderId}`);
    } catch {
      toast.error("Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p className="text-muted-foreground mb-6">
          Your cart is empty. Please add items before checking out.
        </p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Address Line 1</Label>
                <Input
                  placeholder="123 Main St"
                  value={shippingAddress.addressLine1}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      addressLine1: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Address Line 2 (Optional)</Label>
                <Input
                  placeholder="Apt, suite, etc."
                  value={shippingAddress.addressLine2}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      addressLine2: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    placeholder="New York"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    placeholder="NY"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Postal Code</Label>
                  <Input
                    placeholder="10001"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    placeholder="USA"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        country: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={sameAsShipping}
                  onCheckedChange={(checked) =>
                    setSameAsShipping(checked as boolean)
                  }
                />
                <span>Billing address same as shipping</span>
              </div>
            </CardHeader>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>

              {paymentMethod === "credit_card" && (
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Card Holder Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={cardDetails.cardHolder}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardHolder: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiryDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-4"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Your data is safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders over $100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
