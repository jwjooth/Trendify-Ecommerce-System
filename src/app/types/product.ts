/**
 * Core type definitions for e-commerce domain models
 * Following DDD (Domain-Driven Design) principles
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 
  | 'electronics'
  | 'clothing'
  | 'books'
  | 'home'
  | 'sports'
  | 'beauty';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'apple_pay';

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  searchQuery?: string;
}

export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest';
