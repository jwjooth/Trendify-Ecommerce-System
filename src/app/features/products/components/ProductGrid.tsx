import { Product } from "@/app/service/type";
import { ProductCard } from "@/app/shared/layout/ProductCard";

export const ProductGrid = ({ products }: { products: Product[] }) => {
  if (!products.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};
