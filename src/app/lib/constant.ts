import { Users, Store, Globe, Star } from "lucide-react";
import { Mail, Phone, MapPin } from "lucide-react";

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

export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  NOT_FOUND: "The resource you are looking for was not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  VALIDATION: "Please check your input and try again.",
};

export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: "Item added to cart successfully",
  REMOVED_FROM_CART: "Item removed from cart",
  CHECKOUT_COMPLETE: "Order placed successfully",
  WISHLIST_ADDED: "Added to wishlist",
  WISHLIST_REMOVED: "Removed from wishlist",
};

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/",
  PRODUCT_DETAIL: (id: string | number) => `/product?id=${id}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  // ORDER_CONFIRMATION: (id: string | number) => `/order-confirmation/${id}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  NOT_FOUND: "/404",
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
  POSTAL_CODE_REGEX: /^[\dA-Za-z\s\-]+$/,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Products Sold", value: "1M+", icon: Store },
  { label: "Countries Served", value: "25+", icon: Globe },
  { label: "Customer Rating", value: "4.9/5", icon: Star },
];

export const team = [
  {
    name: "Claude",
    role: "Vibe Coder",
    bio: "Productive vibe coder. Bringing apps to life with Replit Agent. 💡 Shipped with taste.",
    avatar: "VC",
  },
  {
    name: "Jordan Theovandy",
    role: "CEO & Founder",
    bio: "Passionate about creating exceptional shopping experiences since 2023.",
    avatar: "JT",
  },
  {
    name: "GitHub Copilot",
    role: "Vibe Coder",
    bio: "0 to 1 with AI in minutes. Professional Vibe Coder & Product Strategist.",
    avatar: "VC",
  },
  {
    name: "Figma",
    role: "Designer",
    bio: "Highlights user-centric design skills, research expertise, and a unique creative perspective",
    avatar: "DG",
  },
  {
    name: "Postman",
    role: "Tester API",
    bio: "A concise summary of their expertise, skills, and key achievements",
    avatar: "TA",
  },
];

export const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@trendify.com",
    additional: "Response within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us directly",
    contact: "1-800-TRENDIFY",
    additional: "Mon-Fri: 9AM-6PM PST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters",
    contact: "San Francisco, CA",
    additional: "123 Commerce St",
  },
];

export const socialLinks = [
  { name: "Facebook", emoji: "📘", url: "#" },
  { name: "Twitter", emoji: "🐦", url: "#" },
  { name: "Instagram", emoji: "📷", url: "#" },
  { name: "LinkedIn", emoji: "💼", url: "#" },
];

export const hours = [
  {
    day: "Monday - Friday",
    time: "9:00 AM - 6:00 PM PST",
    variant: "secondary" as const,
  },
  {
    day: "Saturday",
    time: "10:00 AM - 4:00 PM PST",
    variant: "secondary" as const,
  },
  { day: "Sunday", time: "Closed", variant: "outline" as const },
];
