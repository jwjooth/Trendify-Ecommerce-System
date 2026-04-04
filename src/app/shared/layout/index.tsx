import type { NextPage } from "next";
import { memo, useMemo, useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/app/shared/layout/ProductCard";
import { ProductFiltersBar } from "@/app/shared/layout/ProductFiltersBar";
import { ProductGridSkeleton } from "@/app/shared/layout/ProductGridSkeleton";
import { useProducts } from "@/app/shared/hooks/useProducts";
import { useProductFilters } from "@/app/shared/hooks/useProductFilters";
import { useCategories } from "@/app/shared/hooks/useCategories";
import type { Product } from "@service/type";
import { Button } from "@/app/shared/ui/button";
import { Badge } from "@/app/shared/ui/badge";

/**
 * Empty State Component
 * Displays when no products are found
 */
interface EmptyStateProps {
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const EmptyState = memo<EmptyStateProps>(
  ({ onClearFilters, hasActiveFilters }) => (
    <div className="text-center py-16">
      <SlidersHorizontal className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {hasActiveFilters ? "No products found" : "No products available"}
      </h3>
      <p className="text-muted-foreground mb-4">
        {hasActiveFilters
          ? "Try adjusting your filters or search query"
          : "Please try again later"}
      </p>
      {hasActiveFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

/**
 * Error State Component
 * Displays when an error occurs loading products
 */
interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = memo<ErrorStateProps>(({ error, onRetry }) => (
  <div className="text-center py-16">
    <div className="text-red-500 mb-4 text-4xl">⚠️</div>
    <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
    <p className="text-muted-foreground mb-4">{error}</p>
    <Button onClick={onRetry} variant="outline">
      Try Again
    </Button>
  </div>
));

ErrorState.displayName = "ErrorState";

/**
 * Active Filters Badge Component
 * Displays applied filters with clear option
 */
interface ActiveFiltersBadgeProps {
  searchQuery: string;
  selectedCategory: string | undefined;
  onClearFilters: () => void;
}

const ActiveFiltersBadge = memo<ActiveFiltersBadgeProps>(
  ({ searchQuery, selectedCategory, onClearFilters }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {searchQuery && (
        <Badge variant="secondary" className="gap-2">
          🔍 {searchQuery}
        </Badge>
      )}
      {selectedCategory && (
        <Badge variant="secondary" className="capitalize gap-2">
          📁 {selectedCategory}
        </Badge>
      )}
      <Button variant="ghost" size="sm" onClick={onClearFilters}>
        ✕ Clear all
      </Button>
    </div>
  ),
);

ActiveFiltersBadge.displayName = "ActiveFiltersBadge";

/**
 * Product Grid Component
 * Renders product cards or empty/error states
 */
interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
}

const ProductGrid = memo<ProductGridProps>(
  ({ products, loading, error, hasActiveFilters, onClearFilters, onRetry }) => {
    if (loading) {
      return <ProductGridSkeleton />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={onRetry} />;
    }

    if (products.length === 0) {
      return (
        <EmptyState
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  },
);

ProductGrid.displayName = "ProductGrid";

/**
 * Home Page Component
 * Main page for product discovery with filtering and sorting
 *
 * Features:
 * - Search products by name/keyword
 * - Filter by category
 * - Sort by price, rating, or newest
 * - URL persistence for filters
 * - Responsive grid layout
 * - Error handling and loading states
 * - Memoized sub-components for performance
 * - Proper TypeScript typing throughout
 */
const HomePage: NextPage = () => {
  // Hooks for filter management and categories
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    hasActiveFilters,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    clearFilters,
  } = useProductFilters();

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Fetch products based on filters (memoized to prevent unnecessary API calls)
  const filters = useMemo(
    () => ({
      searchQuery: searchQuery || undefined,
      category: selectedCategory,
    }),
    [searchQuery, selectedCategory],
  );

  const { products, loading, error, totalCount, refetch } = useProducts(
    filters,
    sortBy,
  );

  // Memoized retry handler
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Products
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our curated collection of premium products
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-8">
          <ProductFiltersBar
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
          />
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6">
            <ActiveFiltersBadge
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Products Count */}
        <div className="mb-6">
          {!loading && !error && (
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {totalCount}
              </span>{" "}
              {totalCount === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
};

export default HomePage;
