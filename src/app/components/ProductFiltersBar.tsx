import React, { memo, useCallback } from "react";
import { Search } from "lucide-react";
import type { ProductCategory, SortOption } from "@service/type";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { SORT_OPTIONS } from "@lib/constants";

interface CategoryOption {
  value: ProductCategory;
  label: string;
}

interface ProductFiltersBarProps {
  searchQuery: string;
  selectedCategory: ProductCategory | undefined;
  sortBy: SortOption;
  categories: CategoryOption[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: ProductCategory | undefined) => void;
  onSortChange: (sort: SortOption) => void;
}

export const ProductFiltersBar = memo<ProductFiltersBarProps>(
  ({
    searchQuery,
    selectedCategory,
    sortBy,
    categories,
    categoriesError,
    onSearchChange,
    onCategoryChange,
    onSortChange,
  }) => {
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange],
    );

    const handleCategoryChange = useCallback(
      (value: string) => {
        onCategoryChange(
          value === "all" ? undefined : (value as ProductCategory),
        );
      },
      [onCategoryChange],
    );

    const handleSortChange = useCallback(
      (value: string) => {
        onSortChange(value as SortOption);
      },
      [onSortChange],
    );

    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
              aria-label="Search products"
            />
          </div>

          {/* Category Select */}
          <Select
            value={selectedCategory || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger
              className="w-full md:w-48"
              aria-label="Filter by category"
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesError && (
                <SelectItem value="all" disabled>
                  ⚠️ Error loading categories
                </SelectItem>
              )}
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger
              className="w-full md:w-48"
              aria-label="Sort products"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
);

ProductFiltersBar.displayName = "ProductFiltersBar";
