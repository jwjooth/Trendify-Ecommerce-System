import { useState, useEffect, useMemo, useCallback } from "react";
import { Product, ProductFilters, SortOption } from "../service/type";
import { getAllProducts, getProductById } from "../service";

export const useProducts = (
  filters?: ProductFilters,
  sortBy?: SortOption,
  limit?: number,
  page?: number,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search queries to prevent excessive API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setDebouncedFilters(filters);
      },
      filters?.searchQuery ? 300 : 0,
    ); // 300ms debounce for search, instant for other filters

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts(
          debouncedFilters,
          sortBy,
          limit,
          page,
        );
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedFilters, sortBy, limit, page]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    getAllProducts(debouncedFilters, sortBy, limit, page)
      .then(setProducts)
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
        console.error("Error refetching products:", err);
      })
      .finally(() => setLoading(false));
  }, [debouncedFilters, sortBy, limit, page]);

  return {
    products,
    loading,
    error,
    totalCount: products.length,
    refetch,
  };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product",
        );
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      getProductById(productId)
        .then(setProduct)
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Failed to fetch product",
          );
          console.error("Error refetching product:", err);
          setProduct(null);
        })
        .finally(() => setLoading(false));
    },
  };
};

// Hook for searching products
export const useProductSearch = (
  searchQuery: string,
  filters?: ProductFilters,
  sortBy?: SortOption,
) => {
  const searchFilters = useMemo(
    () => ({
      ...filters,
      searchQuery: searchQuery || undefined,
    }),
    [filters, searchQuery],
  );

  return useProducts(searchFilters, sortBy);
};

// Hook for featured products
export const useFeaturedProducts = (limit: number = 10) => {
  return useProducts({ minRating: 4.0 }, "rating", limit);
};

// Hook for new products
export const useNewProducts = (limit: number = 10) => {
  return useProducts(undefined, "newest", limit);
};

// Hook for products by category
export const useProductsByCategory = (
  category: string,
  sortBy?: SortOption,
  limit?: number,
) => {
  const filters = useMemo(() => ({ category: category as any }), [category]);
  return useProducts(filters, sortBy, limit);
};
