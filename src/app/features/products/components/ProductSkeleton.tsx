export const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded mb-4" />
          <div className="bg-gray-200 h-4 rounded mb-2" />
          <div className="bg-gray-200 h-4 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
};