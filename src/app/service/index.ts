import {
  Product,
  ProductFilters,
  SortOption,
  Category,
  FAQ,
  Testimonial,
} from "./type";

const API_BASE_URL = import.meta.env.VITE_PRODUCTS_URL || "https://6872883376a5723aacd50d06.mockapi.io/product";
const CATEGORIES_URL = import.meta.env.VITE_CATEGORIES_URL || "https://6872883376a5723aacd50d06.mockapi.io/categories";
const FAQS_URL = import.meta.env.VITE_FAQS_URL || "https://69bd41b72bc2a25b22ae1242.mockapi.io/faqs";
const TESTIMONIAL_URL = import.meta.env.VITE_TESTIMONIALS_URL || "https://69bd41b72bc2a25b22ae1242.mockapi.io/testimonials";

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 50;

const buildQueryParams = (
  filters?: ProductFilters,
  sortBy?: SortOption,
  limit?: number,
  page?: number,
): string => {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice !== undefined)
      params.append("price_gte", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.append("price_lte", filters.maxPrice.toString());
    if (filters.minRating !== undefined)
      params.append("rating_gte", filters.minRating.toString());
    if (filters.searchQuery) params.append("search", filters.searchQuery);
  }

  if (sortBy) {
    switch (sortBy) {
      case "price-asc":
        params.append("sortBy", "price");
        params.append("order", "asc");
        break;
      case "price-desc":
        params.append("sortBy", "price");
        params.append("order", "desc");
        break;
      case "rating":
        params.append("sortBy", "rating");
        params.append("order", "desc");
        break;
      case "newest":
        params.append("sortBy", "createdAt");
        params.append("order", "desc");
        break;
    }
  }

  if (limit) params.append("limit", limit.toString());
  if (page) params.append("page", page.toString());

  return params.toString();
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const apiRequest = async <T>(
  url: string,
  useCache: boolean = true,
  maxRetries: number = 3,
): Promise<T> => {
  if (useCache && cache.has(url)) {
    const entry = cache.get(url)!;
    if (Date.now() - entry.timestamp < entry.ttl) {
      return entry.data;
    } else {
      cache.delete(url);
    }
  }

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
        console.warn(
          `Rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`,
        );
        await sleep(delay);
        continue;
      }

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      if (useCache) {
        if (cache.size >= MAX_CACHE_SIZE) {
          const firstKey = cache.keys().next().value;
          if (firstKey) cache.delete(firstKey);
        }

        cache.set(url, {
          data,
          timestamp: Date.now(),
          ttl: CACHE_TTL,
        });
      }

      return data;
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      const delay = 500 * Math.pow(2, attempt);
      console.warn(
        `API request failed. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`,
      );
      await sleep(delay);
    }
  }

  console.error("API request error:", lastError);
  throw lastError;
};

export const getAllProducts = async (
  filters?: ProductFilters,
  sortBy?: SortOption,
  limit?: number,
  page?: number,
): Promise<Product[]> => {
  const queryParams = buildQueryParams(filters, sortBy, limit, page);
  const url = `${API_BASE_URL}${queryParams ? `?${queryParams}` : ""}`;

  return apiRequest<Product[]>(url, true);
};

export const getProductById = async (id: string): Promise<Product> => {
  const url = `${API_BASE_URL}?id=${id}`;

  const response = await apiRequest<Product[]>(url, true);
  if (!response || response.length === 0) {
    throw new Error(`Product with id ${id} not found`);
  }

  return response[0];
};

export const searchProducts = async (
  query: string,
  filters?: Omit<ProductFilters, "searchQuery">,
  sortBy?: SortOption,
  limit?: number,
  page?: number,
): Promise<Product[]> => {
  const searchFilters: ProductFilters = { ...filters, searchQuery: query };
  return getAllProducts(searchFilters, sortBy, limit, page);
};

export const getProductsByCategory = async (
  category: string,
  sortBy?: SortOption,
  limit?: number,
  page?: number,
): Promise<Product[]> => {
  const filters: ProductFilters = { category: category as any };
  return getAllProducts(filters, sortBy, limit, page);
};

export const getFeaturedProducts = async (
  limit: number = 10,
): Promise<Product[]> => {
  return getAllProducts({ minRating: 4.0 }, "rating", limit);
};

export const getNewProducts = async (
  limit: number = 10,
): Promise<Product[]> => {
  return getAllProducts(undefined, "newest", limit);
};

export const getProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
  sortBy?: SortOption,
  limit?: number,
  page?: number,
): Promise<Product[]> => {
  const filters: ProductFilters = { minPrice, maxPrice };
  return getAllProducts(filters, sortBy, limit, page);
};

export const getCategories = async (): Promise<Category[]> => {
  return apiRequest<Category[]>(CATEGORIES_URL, true);
};

export const getFaqs = async (): Promise<FAQ[]> => {
  return apiRequest<FAQ[]>(FAQS_URL, true);
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  return apiRequest<Testimonial[]>(TESTIMONIAL_URL, true);
};

export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Promise<Product> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create product: ${response.status} ${response.statusText}`,
      );
    }
    cache.clear();
    return await response.json();
  } catch (error) {
    console.error("Create product error:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  updates: Partial<Product>,
): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update product: ${response.status} ${response.statusText}`,
      );
    }
    cache.clear();
    return await response.json();
  } catch (error) {
    console.error("Update product error:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to delete product: ${response.status} ${response.statusText}`,
      );
    }
    cache.clear();
  } catch (error) {
    console.error("Delete product error:", error);
    throw error;
  }
};
