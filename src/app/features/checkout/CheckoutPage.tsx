import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

// ✅ All imports from their correct shadcn/ui sources
import { Card, CardHeader, CardTitle, CardContent } from "@/app/shared/ui/card";
import { Checkbox } from "@/app/shared/ui/checkbox"; // ← was @radix-ui/react-checkbox (primitive)
import { Label } from "@/app/shared/ui/label"; // ← was "recharts" (!!)
import { Separator } from "@/app/shared/ui/separator"; // ← was @radix-ui/react-select (!!)
import { Textarea } from "@/app/shared/ui/textarea";

import {
  calculateTax,
  calculateShipping,
  calculateTotal,
} from "@/app/lib/currency";
import { useCart } from "@/app/features/cart/CartContext";
import { AddressForm } from "./components/AddressForm";
import { PaymentForm } from "./components/PaymentForm";
import { OrderSummary } from "./components/OrderSummary";
import { useCheckoutForm } from "./hooks/useCheckoutForm";
import { useOrderSubmit } from "./hooks/useOrderSubmit";
import { OrderPayload } from "./type/checkout";

export const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const { tax, shipping, total } = useMemo(() => {
    const tax = calculateTax(cart.subtotal);
    const shipping = calculateShipping(cart.subtotal);
    const total = calculateTotal(cart.subtotal, tax, shipping);
    return { tax, shipping, total };
  }, [cart.subtotal]);

  const {
    formState,
    updateShippingField,
    updateBillingField,
    toggleSameAsShipping,
    setPaymentMethod,
    setOrderNotes,
    setEmailUpdates,
  } = useCheckoutForm();

  const handleOrderSuccess = useCallback(
    (payload: OrderPayload) => {
      clearCart();
      sessionStorage.setItem("lastOrder", JSON.stringify(payload));
      router.push(`/order-confirmation/${payload.orderId}`);
    },
    [clearCart, router],
  );

  const { isProcessing, handleSubmit } = useOrderSubmit({
    total,
    onSuccess: handleOrderSuccess,
  });

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleSubmit(formState);
    },
    [handleSubmit, formState],
  );

  if (cart.items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your order &bull; {cart.totalItems} items
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card className="shadow-lg border-0">
                <AddressForm
                  id="shipping"
                  title="Shipping Information"
                  address={formState.shippingAddress}
                  showPhone
                  onChange={() => updateShippingField}
                />
              </Card>

              {/* Billing Address */}
              <Card className="shadow-lg border-0">
                <AddressForm
                  id="billing"
                  title="Billing Information"
                  address={formState.billingAddress}
                  onChange={() => updateBillingField}
                  headerSlot={
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAsShipping"
                        checked={formState.sameAsShipping}
                        onCheckedChange={(checked) =>
                          toggleSameAsShipping(checked === true)
                        }
                      />
                      <Label
                        htmlFor="sameAsShipping"
                        className="text-sm font-normal"
                      >
                        Same as shipping
                      </Label>
                    </div>
                  }
                />
                {formState.sameAsShipping && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground italic">
                    Billing address matches shipping address.
                  </div>
                )}
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg border-0">
                <PaymentForm
                  paymentMethod={formState.paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                />
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
                    placeholder="Any special delivery instructions or notes..."
                    value={formState.orderNotes}
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
                      checked={formState.emailUpdates}
                      onCheckedChange={(checked) =>
                        setEmailUpdates(checked === true)
                      }
                    />
                    <Label
                      htmlFor="emailUpdates"
                      className="text-sm font-normal"
                    >
                      Send me updates about my order and exclusive offers via
                      email
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Separator className="lg:hidden" />
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                tax={tax}
                shipping={shipping}
                total={total}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
