import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Input } from "@/app/shared/ui/input";

export const ProductFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  categories,
  categoriesLoading,
}: any) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select
        value={category || "all"}
        onValueChange={(v) => setCategory(v === "all" ? undefined : v)}
      >
        <SelectTrigger className="w-full md:w-48" />
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>

          {categoriesLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : (
            categories.map((c: any) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-full md:w-48" />
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-asc">Price ↑</SelectItem>
          <SelectItem value="price-desc">Price ↓</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
