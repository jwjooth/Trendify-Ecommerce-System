/**
 * Application Constants
 * Centralized constants used throughout the application
 */

export const PRODUCT_CATEGORIES = [
  "electronics",
  "clothing",
  "books",
  "home",
  "sports",
  "beauty",
  "accessories",
] as const;

export const SORT_OPTIONS = [
  "newest",
  "price-low",
  "price-high",
  "rating",
  "popular",
] as const;

export const PAYMENT_METHODS = [
  "credit_card",
  "debit_card",
  "paypal",
  "apple_pay",
  "sample_payment",
] as const;

export const ORDER_STATUS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  NOT_FOUND: "The resource you are looking for was not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  VALIDATION: "Please check your input and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: "Item added to cart successfully",
  REMOVED_FROM_CART: "Item removed from cart",
  CHECKOUT_COMPLETE: "Order placed successfully",
  WISHLIST_ADDED: "Added to wishlist",
  WISHLIST_REMOVED: "Removed from wishlist",
};

// Navigation Routes
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/",
  PRODUCT_DETAIL: (id: string | number) => `/product/${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: (id: string | number) => `/order-confirmation/${id}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  NOT_FOUND: "/404",
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
  POSTAL_CODE_REGEX: /^[\dA-Za-z\s\-]+$/,
  PASSWORD_MIN_LENGTH: 8,
} as const;
