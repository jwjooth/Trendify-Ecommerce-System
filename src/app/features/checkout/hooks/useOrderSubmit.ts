import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Address } from "@/app/service/type";
import { CheckoutFormState, CheckoutError, OrderPayload } from "../type/checkout";

interface UseOrderSubmitOptions {
  total: number;
  onSuccess: (payload: OrderPayload) => void;
}
  
async function submitOrder(_payload: Omit<OrderPayload, "orderId">): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.01) {
        reject(new Error("Network error. Please try again."));
      } else {
        resolve();
      }
    }, 2000);
  });

  return `ORD-${Date.now()}`;
}

function validateAddress(address: Address, prefix: string): CheckoutError | null {
  const required: (keyof Address)[] = [
    "fullName",
    "addressLine1",
    "city",
    "state",
    "postalCode",
  ];

  for (const field of required) {
    if (!address[field]?.trim()) {
      return {
        field: `${prefix}.${field}`,
        message: `Please fill in all required ${prefix} fields`,
      };
    }
  }

  if (!address.phone?.trim()) {
    return {
      field: `${prefix}.phone`,
      message: `Please provide a phone number for the ${prefix} address`,
    };
  }

  return null;
}

function validateForm(
  formState: CheckoutFormState
): CheckoutError | null {
  const shippingError = validateAddress(formState.shippingAddress, "shipping");
  if (shippingError) return shippingError;

  if (!formState.sameAsShipping) {
    const billingError = validateAddress(formState.billingAddress, "billing");
    if (billingError) return billingError;
  }

  return null;
}

export function useOrderSubmit({ total, onSuccess }: UseOrderSubmitOptions) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = useCallback(
    async (formState: CheckoutFormState) => {
      const validationError = validateForm(formState);
      if (validationError) {
        toast.error(validationError.message);
        return;
      }

      setIsProcessing(true);

      try {
        const effectiveBilling = formState.sameAsShipping
          ? formState.shippingAddress
          : formState.billingAddress;

        const orderId = await submitOrder({
          total,
          shippingAddress: formState.shippingAddress,
          billingAddress: effectiveBilling,
          paymentMethod: formState.paymentMethod,
          orderNotes: formState.orderNotes,
        });

        const payload: OrderPayload = {
          orderId,
          total,
          shippingAddress: formState.shippingAddress,
          billingAddress: effectiveBilling,
          paymentMethod: formState.paymentMethod,
          orderNotes: formState.orderNotes,
        };

        toast.success("Order placed successfully!");
        onSuccess(payload);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        toast.error(message);
      } finally {
        setIsProcessing(false);
      }
    },
    [total, onSuccess]
  );

  return { isProcessing, handleSubmit };
}
