import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateTax, calculateShipping, calculateTotal } from '../utils/currency';
import { Address, PaymentMethod } from '../types/product';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  const tax = calculateTax(cart.subtotal);
  const shipping = calculateShipping(cart.subtotal);
  const total = calculateTotal(cart.subtotal, tax, shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      toast.error('Please fill in all required shipping fields');
      return;
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
        },
      });
      toast.success('Order placed successfully!');
    }, 2000);
  };

  const handleInputChange = (field: keyof Address, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={shippingAddress.country}
                      onValueChange={(value) => handleInputChange('country', value)}
                    >
                      <SelectTrigger id="country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="apple_pay">Apple Pay</SelectItem>
                  </SelectContent>
                </Select>

                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>

                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" maxLength={3} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
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

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
