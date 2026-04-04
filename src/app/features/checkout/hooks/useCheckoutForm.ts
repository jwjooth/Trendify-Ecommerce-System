import { useCallback, useState } from "react";
import { Address, PaymentMethod } from "@/app/service/type"; // ← was "cluster" (Node.js built-in!)
import { CheckoutFormState, DEFAULT_ADDRESS } from "../type/checkout";

export function useCheckoutForm() {
  const [formState, setFormState] = useState<CheckoutFormState>({
    shippingAddress: { ...DEFAULT_ADDRESS },
    billingAddress: { ...DEFAULT_ADDRESS },
    paymentMethod: "credit_card",
    orderNotes: "",
    emailUpdates: false,
    sameAsShipping: true,
  });

  const updateShippingField = useCallback(
    (field: keyof Address, value: string) => {
      setFormState((prev) => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [field]: value },
        billingAddress: prev.sameAsShipping
          ? { ...prev.billingAddress, [field]: value }
          : prev.billingAddress,
      }));
    },
    []
  );

  const updateBillingField = useCallback(
    (field: keyof Address, value: string) => {
      setFormState((prev) => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [field]: value },
      }));
    },
    []
  );

  const toggleSameAsShipping = useCallback((checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      sameAsShipping: checked,
      billingAddress: checked
        ? { ...prev.shippingAddress }
        : { ...DEFAULT_ADDRESS },
    }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setFormState((prev) => ({ ...prev, paymentMethod: method }));
  }, []);

  const setOrderNotes = useCallback((notes: string) => {
    setFormState((prev) => ({ ...prev, orderNotes: notes }));
  }, []);

  const setEmailUpdates = useCallback((value: boolean) => {
    setFormState((prev) => ({ ...prev, emailUpdates: value }));
  }, []);

  return {
    formState,
    updateShippingField,
    updateBillingField,
    toggleSameAsShipping,
    setPaymentMethod,
    setOrderNotes,
    setEmailUpdates,
  };
}