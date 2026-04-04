import React, { memo } from "react";
import { Lock, Shield } from "lucide-react";
import { PaymentMethod } from "../../service/type";
import { CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const PAYMENT_OPTIONS = [
  { value: "credit_card", label: "💳 Credit Card" },
  { value: "debit_card", label: "💳 Debit Card" },
  { value: "paypal", label: "🅿️ PayPal" },
  { value: "apple_pay", label: "📱 Apple Pay" },
  { value: "google_pay", label: "🎯 Google Pay" },
  { value: "bank_transfer", label: "🏦 Bank Transfer" },
] as const;

const CARD_PAYMENT_METHODS: PaymentMethod[] = ["credit_card", "debit_card"];

const PAYMENT_INFO_MAP: Partial<Record<PaymentMethod, { bg: string; text: string; message: string }>> = {
  paypal: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    message: "You will be redirected to PayPal to complete your payment securely.",
  },
  apple_pay: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    message: "Complete your purchase with Touch ID or Face ID using Apple Pay.",
  },
  google_pay: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    message: "Fast and secure checkout with Google Pay.",
  },
  bank_transfer: {
    bg: "bg-green-50",
    text: "text-green-700",
    message: "Bank transfer details will be provided after order confirmation.",
  },
};

interface PaymentFormProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = memo(
  ({ paymentMethod, onPaymentMethodChange }) => {
    const isCardPayment = CARD_PAYMENT_METHODS.includes(paymentMethod);
    const alternativeInfo = PAYMENT_INFO_MAP[paymentMethod];

    return (
      <>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Payment Method
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Select
            value={paymentMethod}
            onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isCardPayment && (
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
                  <Input id="expiry" placeholder="MM/YY" maxLength={5} required />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input id="cvv" placeholder="123" maxLength={4} required />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Name on Card *</Label>
                <Input id="cardName" placeholder="John Doe" required />
              </div>

              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Your payment information is secure and encrypted with 256-bit SSL</span>
              </div>
            </div>
          )}

          {alternativeInfo && (
            <div className={`p-4 border rounded-lg ${alternativeInfo.bg}`}>
              <p className={`text-sm ${alternativeInfo.text}`}>
                {alternativeInfo.message}
              </p>
            </div>
          )}
        </CardContent>
      </>
    );
  }
);

PaymentForm.displayName = "PaymentForm";
