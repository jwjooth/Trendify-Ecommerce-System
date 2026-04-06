import { handleError } from "@/app/lib/api";
import { getAllCategories } from "@/app/service/categories";
import { useEffect, useState } from "react";

export const useCategories = () => {
  const [data, setData] = useState<{ value: ProductCategory; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetch = async (page: number, page_limit: number) => {
      setLoading(true);
      try {
        const res = await getAllCategories({ page, page_limit });

        if (!mounted) return;

        const mapped =
          res
            ?.filter((c): c is Category => !!c?.name)
            .map((c) => ({
              value: c.name as ProductCategory,
              label: c.name,
            })) || [];

        setData(mapped);
      } catch (error) {
        handleError(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
};
