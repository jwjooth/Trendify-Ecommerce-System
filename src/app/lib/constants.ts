/**
 * Product Category Constants
 * Centralized product categories with proper typing
 */

import type { ProductCategory } from "@service/type";

export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  books: "Books",
  home: "Home",
  sports: "Sports",
  beauty: "Beauty",
  accessories: "Accessories",
} as const;

export const DEFAULT_CATEGORIES = Object.entries(PRODUCT_CATEGORIES).map(
  ([value, label]) => ({
    value: value as ProductCategory,
    label,
  })
);

export const SORT_OPTIONS = {
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
} as const;

export const DEBOUNCE_DELAY = 300;
export const PRODUCTS_GRID_COLS = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};
export const SKELETON_ITEMS_COUNT = 8;
