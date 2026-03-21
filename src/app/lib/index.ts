export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_URL ||
    "https://6872883376a5723aacd50d06.mockapi.io",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const FEATURES = {
  WISHLIST_ENABLED: true,
  REVIEWS_ENABLED: true,
  PRODUCT_RECOMMENDATIONS: true,
  ADVANCED_SEARCH: true,
} as const;

export const STORAGE_KEYS = {
  CART: "trendify_cart",
  WISHLIST: "trendify_wishlist",
  USER_PREFERENCES: "trendify_preferences",
  RECENT_VIEWS: "trendify_recent",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const DELAYS = {
  TOAST_DURATION: 3000,
  MODAL_ANIMATION: 200,
  DEBOUNCE_SEARCH: 300,
} as const;

// Environment
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (IS_DEVELOPMENT) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
  info: (message: string, data?: unknown) => {
    console.info(`[INFO] ${message}`, data);
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data);
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error);
  },
};
