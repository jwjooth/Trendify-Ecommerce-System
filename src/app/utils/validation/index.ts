export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email || typeof email !== "string") {
    errors.push("Email is required");
    return { isValid: false, errors };
  }

  const trimmed = email.trim();
  if (trimmed.length > 254) {
    errors.push("Email is too long (max 254 characters)");
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    errors.push("Email format is invalid");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,20}$/;
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];

  if (!phone || typeof phone !== "string") {
    errors.push("Phone number is required");
    return { isValid: false, errors };
  }

  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 10 || cleaned.length > 15) {
    errors.push("Phone number must be 10-15 digits");
  }

  if (!PHONE_REGEX.test(phone)) {
    errors.push("Phone number format is invalid");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePostalCode = (
  code: string,
  country = "US",
): ValidationResult => {
  const errors: string[] = [];

  if (!code || typeof code !== "string") {
    errors.push("Postal code is required");
    return { isValid: false, errors };
  }

  const trimmed = code.trim();

  if (country === "US") {
    const usZipRegex = /^\d{5}(?:-\d{4})?$/;
    if (!usZipRegex.test(trimmed)) {
      errors.push(
        "US postal code must be 5 digits or 5+4 format (12345 or 12345-6789)",
      );
    }
  } else if (country === "CA") {
    const caZipRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
    if (!caZipRegex.test(trimmed)) {
      errors.push("Canadian postal code format is invalid");
    }
  } else if (country === "UK") {
    const ukZipRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    if (!ukZipRegex.test(trimmed)) {
      errors.push("UK postal code format is invalid");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAddress = (address: {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!address.fullName || typeof address.fullName !== "string") {
    errors.push("Full name is required");
  } else if (address.fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  } else if (address.fullName.trim().length > 100) {
    errors.push("Full name is too long (max 100 characters)");
  }

  if (!address.addressLine1 || typeof address.addressLine1 !== "string") {
    errors.push("Address line 1 is required");
  } else if (address.addressLine1.trim().length < 5) {
    errors.push("Address line 1 is too short");
  } else if (address.addressLine1.trim().length > 100) {
    errors.push("Address line 1 is too long (max 100 characters)");
  }

  if (!address.city || typeof address.city !== "string") {
    errors.push("City is required");
  } else if (address.city.trim().length < 2) {
    errors.push("City is too short");
  } else if (address.city.trim().length > 50) {
    errors.push("City is too long (max 50 characters)");
  }

  if (!address.state || typeof address.state !== "string") {
    errors.push("State/Province is required");
  } else if (address.state.trim().length < 2) {
    errors.push("State/Province is too short");
  }

  const postalValidation = validatePostalCode(
    address.postalCode,
    address.country,
  );
  if (!postalValidation.isValid) {
    errors.push(...postalValidation.errors);
  }

  const phoneValidation = validatePhone(address.phone);
  if (!phoneValidation.isValid) {
    errors.push(...phoneValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCreditCard = (cardNumber: string): ValidationResult => {
  const errors: string[] = [];

  if (!cardNumber || typeof cardNumber !== "string") {
    errors.push("Card number is required");
    return { isValid: false, errors };
  }

  const cleaned = cardNumber.replace(/\s/g, "");

  if (!/^\d+$/.test(cleaned)) {
    errors.push("Card number must contain only digits");
  }

  if (cleaned.length < 13 || cleaned.length > 19) {
    errors.push("Card number must be 13-19 digits");
  }

  if (!luhnCheck(cleaned)) {
    errors.push("Card number is invalid (failed Luhn check)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

function luhnCheck(num: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export const validateCardExpiry = (expiryDate: string): ValidationResult => {
  const errors: string[] = [];

  if (!expiryDate || typeof expiryDate !== "string") {
    errors.push("Expiry date is required");
    return { isValid: false, errors };
  }

  const [month, year] = expiryDate.split("/").map((v) => v.trim());

  if (!month || !year) {
    errors.push("Expiry date format must be MM/YY");
  }

  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) {
    errors.push("Month must be between 01 and 12");
  }

  const fullYear = 2000 + parseInt(year, 10);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (
    fullYear < currentYear ||
    (fullYear === currentYear && monthNum < currentMonth)
  ) {
    errors.push("Card is expired");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCVV = (cvv: string): ValidationResult => {
  const errors: string[] = [];

  if (!cvv || typeof cvv !== "string") {
    errors.push("CVV is required");
    return { isValid: false, errors };
  }

  const cleaned = cvv.trim();
  if (!/^\d{3,4}$/.test(cleaned)) {
    errors.push("CVV must be 3 or 4 digits");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowSpecialChars?: boolean;
  trim?: boolean;
}

export const validateString = (
  value: string,
  options: StringValidationOptions = {},
): ValidationResult => {
  const errors: string[] = [];

  if (!value || typeof value !== "string") {
    errors.push("Value is required");
    return { isValid: false, errors };
  }

  let text = options.trim ? value.trim() : value;

  if (options.minLength && text.length < options.minLength) {
    errors.push(`Value must be at least ${options.minLength} characters`);
  }

  if (options.maxLength && text.length > options.maxLength) {
    errors.push(`Value must not exceed ${options.maxLength} characters`);
  }

  if (options.pattern && !options.pattern.test(text)) {
    errors.push("Value format is invalid");
  }

  if (!options.allowSpecialChars && /<|>|{|}|"/g.test(text)) {
    errors.push("Special characters are not allowed");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateQuantity = (quantity: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof quantity !== "number" || !Number.isInteger(quantity)) {
    errors.push("Quantity must be a whole number");
  } else if (quantity < 1) {
    errors.push("Quantity must be at least 1");
  } else if (quantity > 9999) {
    errors.push("Quantity cannot exceed 9999");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePrice = (price: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof price !== "number" || price < 0) {
    errors.push("Price must be a non-negative number");
  } else if (price > 999999.99) {
    errors.push("Price is too large");
  } else if (!/^\d+(\.\d{0,2})?$/.test(price.toString())) {
    errors.push("Price can have at most 2 decimal places");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeLocalStorageData = (data: unknown): unknown => {
  if (data === null || data === undefined) {
    return data;
  }

  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean"
  ) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLocalStorageData(item));
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key.replace(/[^a-zA-Z0-9_]/g, ""),
        sanitizeLocalStorageData(value),
      ]),
    );
  }

  return null;
};
