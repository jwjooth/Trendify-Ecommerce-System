import DOMPurify from "dompurify";

/**
 * Sanitizes HTML input to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @param options - Additional DOMPurify options
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (dirty: string, options?: any): string => {
  const sanitized = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
    ],
    ALLOWED_ATTR: [],
    ...options,
  });
  return typeof sanitized === "string" ? sanitized : sanitized.toString();
};

/**
 * Sanitizes plain text input by removing potentially dangerous characters
 * @param input - The input string to sanitize
 * @returns Sanitized string safe for display
 */
export const sanitizeText = (input: string): string => {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

/**
 * Validates and sanitizes email addresses
 * @param email - The email string to validate and sanitize
 * @returns Object with isValid boolean and sanitized email
 */
export const validateAndSanitizeEmail = (
  email: string,
): { isValid: boolean; sanitized: string } => {
  const sanitized = sanitizeText(email).toLowerCase().trim();

  // More comprehensive email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const isValid = emailRegex.test(sanitized) && sanitized.length <= 254;

  return { isValid, sanitized };
};

/**
 * Sanitizes URL inputs
 * @param url - The URL string to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== "string") return "";

  const sanitized = sanitizeText(url);

  try {
    const urlObj = new URL(sanitized);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return "";
    }
    return urlObj.toString();
  } catch {
    return "";
  }
};

/**
 * Sanitizes numeric inputs
 * @param input - The input to convert to number
 * @param defaultValue - Default value if conversion fails
 * @returns Sanitized number
 */
export const sanitizeNumber = (input: any, defaultValue: number = 0): number => {
  const num = Number(input);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

/**
 * Sanitizes search/query inputs
 * @param query - The search query to sanitize
 * @returns Sanitized search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  return sanitizeText(query)
    .replace(/[<>'"&]/g, "") // Remove additional potentially problematic characters
    .substring(0, 100); // Limit length
};
