import { useMemo } from "react";
import { ProductFilters } from "../components/ProductFilters";
import { useProducts } from "@/app/shared/hooks/useProducts";
import { ProductGrid } from "../components/ProductGrid";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { useCategories } from "../hook/useCategories";
import { useProductFilters } from "../hook/useProductFilters";

export default function ProductsPage() {
  const filtersState = useProductFilters();
  const { data: categories, loading: catLoading } = useCategories();

  const filters = useMemo(
    () => ({
      searchQuery: filtersState.debouncedSearch || undefined,
      category: filtersState.category,
    }),
    [filtersState.debouncedSearch, filtersState.category],
  );

  const { products, loading, error, totalCount } = useProducts(
    filters,
    filtersState.sort,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductFilters
        {...filtersState}
        categories={categories}
        categoriesLoading={catLoading}
      />

      <div className="mt-6 text-sm text-muted-foreground">
        {loading
          ? "Loading..."
          : error
            ? `Error: ${error}`
            : `Showing ${totalCount} products`}
      </div>

      <div className="mt-6">
        {loading ? <ProductSkeleton /> : <ProductGrid products={products} />}
      </div>
    </div>
  );
}
