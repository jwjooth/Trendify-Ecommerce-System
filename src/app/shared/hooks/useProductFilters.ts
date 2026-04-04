/**
 * useProductFilters Hook
 * Manages product filtering logic with proper state and URL synchronization
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { ProductCategory, SortOption } from "@service/type";
import { DEBOUNCE_DELAY } from "@lib/constants";

interface UseProductFiltersReturn {
  searchQuery: string;
  selectedCategory: ProductCategory | undefined;
  sortBy: SortOption;
  hasActiveFilters: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: ProductCategory | undefined) => void;
  setSortBy: (sort: SortOption) => void;
  clearFilters: () => void;
}

/**
 * Custom hook for managing product filters with URL persistence
 * Handles search, category, and sort state with debouncing
 */
export const useProductFilters = (): UseProductFiltersReturn => {
  const router = useRouter();
  const [searchQuery, setSearchQueryState] = useState("");
  const [selectedCategory, setSelectedCategoryState] = useState<
    ProductCategory | undefined
  >(undefined);
  const [sortBy, setSortByState] = useState<SortOption>("newest");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Initialize from URL query parameters
  useEffect(() => {
    if (!router.isReady) return;

    const { search, category, sort } = router.query;

    if (search && typeof search === "string") {
      setSearchQueryState(search);
    }

    if (category && typeof category === "string") {
      setSelectedCategoryState(category as ProductCategory);
    }

    if (sort && typeof sort === "string") {
      setSortByState(sort as SortOption);
    }
  }, [router.isReady, router.query]);

  // Sync filters to URL with debouncing for search
  const syncToUrl = useCallback(
    (
      search: string,
      cat: ProductCategory | undefined,
      sort: SortOption
    ) => {
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (cat) params.set("category", cat);
      if (sort !== "newest") params.set("sort", sort);

      const queryString = params.toString();
      router.push(
        {
          pathname: router.pathname,
          query: queryString ? `?${queryString}` : "",
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query);

      // Debounce URL updates for search
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        syncToUrl(query, selectedCategory, sortBy);
      }, DEBOUNCE_DELAY);

      setDebounceTimer(timer);
    },
    [debounceTimer, selectedCategory, sortBy, syncToUrl]
  );

  const setSelectedCategory = useCallback(
    (category: ProductCategory | undefined) => {
      setSelectedCategoryState(category);
      syncToUrl(searchQuery, category, sortBy);
    },
    [searchQuery, sortBy, syncToUrl]
  );

  const setSortBy = useCallback(
    (sort: SortOption) => {
      setSortByState(sort);
      syncToUrl(searchQuery, selectedCategory, sort);
    },
    [searchQuery, selectedCategory, syncToUrl]
  );

  const clearFilters = useCallback(() => {
    setSearchQueryState("");
    setSelectedCategoryState(undefined);
    setSortByState("newest");
    router.push(router.pathname, undefined, { shallow: true });
  }, [router]);

  const hasActiveFilters = Boolean(searchQuery || selectedCategory);

  return {
    searchQuery,
    selectedCategory,
    sortBy,
    hasActiveFilters,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    clearFilters,
  };
};
