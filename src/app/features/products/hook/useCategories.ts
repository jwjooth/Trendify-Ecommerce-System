import { useEffect, useState } from "react";
import { getCategories } from "@/app/service";
import { Category, ProductCategory } from "@/app/service/type";

export const useCategories = () => {
  const [data, setData] = useState<{ value: ProductCategory; label: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getCategories();

        if (!mounted) return;

        const mapped =
          res
            ?.filter((c): c is Category => !!c?.name)
            .map((c) => ({
              value: c.name as ProductCategory,
              label: c.name,
            })) || [];

        setData(mapped);
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
