import { useMemo } from 'react';
import { Product, ProductFilters, SortOption } from '../types/product';
import { PRODUCTS } from '../data/products';

/**
 * Custom hook for product filtering and sorting logic
 * Encapsulates business logic for reusability and testability
 */
export const useProducts = (filters?: ProductFilters, sortBy?: SortOption) => {
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Apply filters
    if (filters) {
      if (filters.category) {
        result = result.filter((p) => p.category === filters.category);
      }

      if (filters.minPrice !== undefined) {
        result = result.filter((p) => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        result = result.filter((p) => p.price <= filters.maxPrice!);
      }

      if (filters.minRating !== undefined) {
        result = result.filter((p) => p.rating >= filters.minRating!);
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
      }
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
      }
    }

    return result;
  }, [filters, sortBy]);

  return {
    products: filteredAndSortedProducts,
    totalCount: filteredAndSortedProducts.length,
  };
};

export const useProduct = (productId: string): Product | undefined => {
  return useMemo(() => {
    return PRODUCTS.find((p) => p.id === productId);
  }, [productId]);
};
