import { Address, PaymentMethod } from "@/app/service/type";

export interface CheckoutFormState {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  orderNotes: string;
  emailUpdates: boolean;
  sameAsShipping: boolean;
}

export interface OrderPayload {
  orderId: string;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  orderNotes: string;
}

export interface CheckoutError {
  field?: string;
  message: string;
}

export const DEFAULT_ADDRESS: Address = {
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  phone: "",
};
