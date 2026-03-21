import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Product, ProductFilters, SortOption } from "../../service/type";
import { getAllProducts, getProductById } from "../../service";

export const useProducts = (
  filters?: ProductFilters,
  sortBy?: SortOption,
  limit?: number,
  page?: number,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stableFilters = useMemo(() => filters ?? {}, [filters]);
  const [debouncedFilters, setDebouncedFilters] = useState(stableFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(stableFilters);
    }, 300);
    return () => clearTimeout(timer);
  }, [stableFilters]);

  const abortRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    if (isFetchingRef.current) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getAllProducts(debouncedFilters, sortBy, limit, page);

      setProducts(data);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;

      setError(err instanceof Error ? err.message : "Failed to fetch products");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [debouncedFilters, sortBy, limit, page]);

  useEffect(() => {
    fetchProducts();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    totalCount: products.length,
    refetch: fetchProducts,
  };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;

      setError(err instanceof Error ? err.message : "Failed to fetch product");
      setProduct(null);
      console.error("Fetch product error:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

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

export const useFeaturedProducts = (limit: number = 10) => {
  const filters = useMemo(() => ({ minRating: 4.0 }), []);
  return useProducts(filters, "rating", limit);
};

export const useNewProducts = (limit: number = 10) => {
  return useProducts(undefined, "newest", limit);
};

export const useProductsByCategory = (
  category: string,
  sortBy?: SortOption,
  limit?: number,
) => {
  const filters = useMemo(() => ({ category: category as any }), [category]);
  return useProducts(filters, sortBy, limit);
};
