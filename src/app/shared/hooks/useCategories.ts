import { useCallback, useEffect, useState } from "react";
import { getCategories } from "@/app/service";
import { Category, ProductCategory } from "@/app/service/type";
import { DEFAULT_CATEGORIES } from "@/app/lib/constants";

interface CategoryOption {
  value: ProductCategory;
  label: string;
}

interface UseCategoriesReturn {
  categories: CategoryOption[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching and managing product categories
 * Includes error handling and caching
 */
export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryOption[]>(
    DEFAULT_CATEGORIES
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCategories();

      if (!data?.length) {
        console.warn("No categories returned from API");
        return;
      }

      const sanitized = data
        .filter((item): item is Category => Boolean(item?.name))
        .map((item) => ({
          value: item.name as ProductCategory,
          label: item.name,
        }));

      if (sanitized.length > 0) {
        setCategories(sanitized);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load categories";
      setError(errorMessage);
      console.error("Failed to load categories:", err);
      // Fallback to default categories on error
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    error,
  };
};
