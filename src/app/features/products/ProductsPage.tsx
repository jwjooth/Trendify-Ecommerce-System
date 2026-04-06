import { handleError } from "@/app/lib/api";
import { getAllCategories } from "@/app/service/categories";
import { Categories } from "@/app/service/categories/type";
import { Product } from "@/app/service/products/type";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useProducts } from "../../shared/hooks/useProducts";
import { ProductCard } from "../../shared/layout/ProductCard";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/ui/select";

export const ProductsPage = () => {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<Categories | undefined>(
    (searchParams?.get("category") as Categories) || undefined,
  );
  const [categories, setCategories] = useState<{ value: Categories; label: string }[]>();
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const { products, loading, error, totalCount } = useProducts(filters, sortBy);

  useEffect(() => {
    const loadCategories = async (page: number, page_limit: number) => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const data = await getAllCategories({ page, page_limit });
        if (data?.length) {
          const sanitized = data
            .filter((item): item is Category => !!item?.name)
            .map((item) => ({
              value: item.name as ProductCategory,
              label: item.name,
            }));

          if (sanitized.length > 0) {
            setCategories(sanitized);
          }
        }
      } catch (error) {
        setCategoriesError(error instanceof Error ? error.message : "Failed to load categories");
        handleError(error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams ?? "");
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
  };

  const handleCategoryChange = (category: Categories | "all") => {
    const newCategory = category === "all" ? undefined : category;
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams ?? "");
    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover Products</h1>
        <p className="text-muted-foreground">Browse our curated collection of premium products</p>
      </div>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) => handleCategoryChange(value as Categories | "all")}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesLoading && (
                <SelectItem value="all" disabled>
                  Loading categories...
                </SelectItem>
              )}
              {categoriesError && (
                <SelectItem value="all" disabled>
                  Error loading categories
                </SelectItem>
              )}
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
            {selectedCategory && (
              <Badge variant="secondary" className="capitalize">
                {selectedCategory}
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>
      <div className="mb-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Error: {error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Showing {totalCount} {totalCount === 1 ? "product" : "products"}
          </p>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="bg-gray-200 rounded h-4 mb-2"></div>
              <div className="bg-gray-200 rounded h-4 w-3/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <SlidersHorizontal className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};
