import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  CreditCard,
  Lock,
  MapPin,
  FileText,
  Shield,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  formatCurrency,
  calculateTax,
  calculateShipping,
  calculateTotal,
} from "../utils/currency";
import { Address, PaymentMethod } from "../service/type";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");

  const [orderNotes, setOrderNotes] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);

  const tax = calculateTax(cart.subtotal);
  const shipping = calculateShipping(cart.subtotal);
  const total = calculateTotal(cart.subtotal, tax, shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    if (!sameAsShipping) {
      if (
        !billingAddress.fullName ||
        !billingAddress.addressLine1 ||
        !billingAddress.city ||
        !billingAddress.state ||
        !billingAddress.postalCode
      ) {
        toast.error("Please fill in all required billing fields");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}`;
      clearCart();
      setIsProcessing(false);
      navigate(`/order-confirmation/${orderId}`, {
        state: {
          orderId,
          total,
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          paymentMethod,
        },
      });
      toast.success("Order placed successfully!");
    }, 2000);
  };

  const handleShippingChange = (field: keyof Address, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (sameAsShipping) {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleBillingChange = (field: keyof Address, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      setBillingAddress(shippingAddress);
    }
  };

  if (cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your order • {cart.totalItems} items
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) =>
                          handleShippingChange("fullName", e.target.value)
                        }
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          handleShippingChange("phone", e.target.value)
                        }
                        required
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) =>
                        handleShippingChange("addressLine1", e.target.value)
                      }
                      required
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={(e) =>
                        handleShippingChange("addressLine2", e.target.value)
                      }
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          handleShippingChange("city", e.target.value)
                        }
                        required
                        placeholder="San Francisco"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          handleShippingChange("state", e.target.value)
                        }
                        required
                        placeholder="CA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          handleShippingChange("postalCode", e.target.value)
                        }
                        required
                        placeholder="94105"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={shippingAddress.country}
                        onValueChange={(value) =>
                          handleShippingChange("country", value)
                        }
                      >
                        <SelectTrigger id="country">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">
                            🇺🇸 United States
                          </SelectItem>
                          <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                          <SelectItem value="United Kingdom">
                            🇬🇧 United Kingdom
                          </SelectItem>
                          <SelectItem value="Australia">
                            🇦🇺 Australia
                          </SelectItem>
                          <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Billing Information
                    </span>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={handleSameAsShippingChange}
                      />
                      <Label htmlFor="sameAsShipping" className="text-sm">
                        Same as shipping address
                      </Label>
                    </div>
                  </CardTitle>
                </CardHeader>
                {!sameAsShipping && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingFullName">Full Name *</Label>
                        <Input
                          id="billingFullName"
                          value={billingAddress.fullName}
                          onChange={(e) =>
                            handleBillingChange("fullName", e.target.value)
                          }
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <Label htmlFor="billingPhone">Phone Number</Label>
                        <Input
                          id="billingPhone"
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) =>
                            handleBillingChange("phone", e.target.value)
                          }
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billingAddressLine1">
                        Address Line 1 *
                      </Label>
                      <Input
                        id="billingAddressLine1"
                        value={billingAddress.addressLine1}
                        onChange={(e) =>
                          handleBillingChange("addressLine1", e.target.value)
                        }
                        required
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billingAddressLine2">
                        Address Line 2
                      </Label>
                      <Input
                        id="billingAddressLine2"
                        value={billingAddress.addressLine2}
                        onChange={(e) =>
                          handleBillingChange("addressLine2", e.target.value)
                        }
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingCity">City *</Label>
                        <Input
                          id="billingCity"
                          value={billingAddress.city}
                          onChange={(e) =>
                            handleBillingChange("city", e.target.value)
                          }
                          required
                          placeholder="San Francisco"
                        />
                      </div>

                      <div>
                        <Label htmlFor="billingState">State *</Label>
                        <Input
                          id="billingState"
                          value={billingAddress.state}
                          onChange={(e) =>
                            handleBillingChange("state", e.target.value)
                          }
                          required
                          placeholder="CA"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingPostalCode">Postal Code *</Label>
                        <Input
                          id="billingPostalCode"
                          value={billingAddress.postalCode}
                          onChange={(e) =>
                            handleBillingChange("postalCode", e.target.value)
                          }
                          required
                          placeholder="94105"
                        />
                      </div>

                      <div>
                        <Label htmlFor="billingCountry">Country *</Label>
                        <Select
                          value={billingAddress.country}
                          onValueChange={(value) =>
                            handleBillingChange("country", value)
                          }
                        >
                          <SelectTrigger id="billingCountry">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">
                              🇺🇸 United States
                            </SelectItem>
                            <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                            <SelectItem value="United Kingdom">
                              🇬🇧 United Kingdom
                            </SelectItem>
                            <SelectItem value="Australia">
                              🇦🇺 Australia
                            </SelectItem>
                            <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Payment Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as PaymentMethod)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">
                        💳 Credit Card
                      </SelectItem>
                      <SelectItem value="debit_card">💳 Debit Card</SelectItem>
                      <SelectItem value="paypal">🅿️ PayPal</SelectItem>
                      <SelectItem value="apple_pay">📱 Apple Pay</SelectItem>
                      <SelectItem value="google_pay">🎯 Google Pay</SelectItem>
                      <SelectItem value="bank_transfer">
                        🏦 Bank Transfer
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {(paymentMethod === "credit_card" ||
                    paymentMethod === "debit_card") && (
                    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date *</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input id="cardName" placeholder="John Doe" required />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        <Shield className="w-4 h-4" />
                        <span>
                          Your payment information is secure and encrypted with
                          256-bit SSL
                        </span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <p className="text-sm text-blue-700">
                        You will be redirected to PayPal to complete your
                        payment securely.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "apple_pay" && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-700">
                        Complete your purchase with Touch ID or Face ID using
                        Apple Pay.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "google_pay" && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <p className="text-sm text-blue-700">
                        Fast and secure checkout with Google Pay.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "bank_transfer" && (
                    <div className="p-4 border rounded-lg bg-green-50">
                      <p className="text-sm text-green-700">
                        Bank transfer details will be provided after order
                        confirmation.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Order Notes (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special delivery instructions or notes for your order..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Let us know if you have any special requests or delivery
                    preferences.
                  </p>
                </CardContent>
              </Card>

              {/* Email Updates */}
              <Card className="shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailUpdates"
                      checked={emailUpdates}
                      onCheckedChange={setEmailUpdates}
                    />
                    <Label htmlFor="emailUpdates" className="text-sm">
                      Send me updates about my order and exclusive offers via
                      email
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} ×{" "}
                            {formatCurrency(item.product.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
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
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* Security Badges */}
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

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isProcessing
                      ? "Processing Order..."
                      : `Pay ${formatCurrency(total)}`}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
