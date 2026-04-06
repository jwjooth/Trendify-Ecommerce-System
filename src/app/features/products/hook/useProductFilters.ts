import { PRODUCT_CATEGORIES } from "@/app/lib/constant";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEBOUNCE_DELAY = 400;

export const useProductFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialValues = useMemo(() => {
    const search = searchParams?.get("search") ?? "";
    const categoryParam = searchParams?.get("category");

    const category = Object.values(PRODUCT_CATEGORIES).includes(categoryParam as ProductCategory)
      ? (categoryParam as ProductCategory)
      : undefined;

    return { search, category };
  }, [searchParams]);

  const [search, setSearch] = useState(initialValues.search);
  const [category, setCategory] = useState<ProductCategory | undefined>(initialValues.category);
  const [sort, setSort] = useState<SortOption>("newest");

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);

    const newQuery = params.toString();
    const currentQuery = searchParams?.toString();

    if (newQuery !== currentQuery) {
      router.replace(`?${newQuery}`);
    }
  }, [debouncedSearch, category, router, searchParams]);

  const clear = useCallback(() => {
    setSearch("");
    setCategory(undefined);
  }, []);

  return {
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    debouncedSearch,
    clear,
  };
};
