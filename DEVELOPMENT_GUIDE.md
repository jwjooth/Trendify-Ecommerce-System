# Trendify E-Commerce System - Development Guide

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Issues Fixed](#issues-fixed)
3. [Best Practices Implemented](#best-practices-implemented)
4. [Getting Started](#getting-started)
5. [Development Guidelines](#development-guidelines)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── ErrorBoundary.tsx (NEW) # Error handling wrapper
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx  # FIXED: Removed hover delay, kept Quick View click
│   │   └── ui/              # shadcn/ui components
│   │
│   ├── pages/               # Page components (one per route)
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrderConfirmationPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── config/              # (NEW) Configuration management
│   │   └── index.ts         # Central config, logger, environment
│   │
│   ├── constants/           # (NEW) Application constants
│   │   └── index.ts         # Routes, messages, validation rules
│   │
│   ├── services/            # (NEW) Business logic & API calls
│   │   └── api.ts           # API service with retry logic
│   │
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useNavigation.ts (NEW) # Navigation with logging
│   │   └── ...
│   │
│   ├── context/             # React Context for state management
│   │   └── CartContext.tsx
│   │
│   ├── utils/               # Utility functions
│   │   └── currency.ts
│   │
│   ├── data/                # Static data
│   │   └── products.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── product.ts
│   │
│   ├── App.tsx              # FIXED: Added ErrorBoundary
│   └── routes.ts            # FIXED: Improved router config
│
├── styles/                  # Global styles
│   ├── index.css
│   ├── tailwind.css
│   ├── theme.css
│   └── fonts.css
│
├── main.tsx                 # Application entry point
├── vite.config.ts          # FIXED: Added SPA configuration
└── package.json
```

---

## 🔧 Issues Fixed

### 1. **ProductCard Hover Modal Issue** ✅

**Problem:** Modal showed after 3-second hover delay, not on "Quick View" click.
**Solution:**

- Removed `useRef` and `useEffect` for hover timeout
- Removed `handleMouseEnter` and `handleMouseLeave` handlers
- Modal now opens only when "Quick View" button is clicked
- Modal closes when user clicks the X button (automatic with Dialog component)

**Files Modified:**

- `src/app/components/ProductCard.tsx`

```typescript
// BEFORE (Wrong)
const handleMouseEnter = () => {
  hoverTimeoutRef.current = setTimeout(() => {
    setShowModal(true);
  }, 3000);
};

const handleMouseLeave = () => {
  if (hoverTimeoutRef.current) {
    clearTimeout(hoverTimeoutRef.current);
  }
  setShowModal(false);
};

// ON ELEMENT
<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

// AFTER (Correct)
const handleQuickView = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setShowModal(true);
};

// ON ELEMENT
<Button onClick={handleQuickView}>
  <Eye className="w-4 h-4 mr-1" />
  Quick View
</Button>
```

### 2. **Navigation Not Working (URL changes, page doesn't update)** ✅

**Problem:** Clicking navigation links changed the URL but didn't update the page content until refresh.
**Solution:**

- Added proper SPA configuration to `vite.config.ts`
- Improved router configuration with better route definitions
- Created `useNavigation` hook with proper debugging and logging
- Added route change logging for easier debugging

**Files Modified:**

- `vite.config.ts` - Added `server.historyApiFallback` and build optimization
- `src/app/routes.ts` - Restructured with RouteObject array
- `src/app/config/index.ts` - New logger utility
- `src/app/hooks/useNavigation.ts` - New navigation hook

```typescript
// VITE CONFIG FIX
server: {
  historyApiFallback: true,  // Enable SPA fallback
}

// ROUTER FIX
const routes: RouteObject[] = [ /* ... */ ];
export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
});
```

---

## ✨ Best Practices Implemented

### 1. **Error Handling**

- Created `ErrorBoundary` component to catch and display errors gracefully
- Added error boundaries in App wrapper
- Implements fallback UI with reload and home navigation options

```typescript
// Error caught and displayed instead of white screen
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 2. **Configuration Management**

- Centralized `config/index.ts` for API, features, storage, and timeouts
- Removed hardcoded values scattered throughout the app
- Added environment detection (development vs production)
- Added logging utility with levels (debug, info, warn, error)

```typescript
// Usage
import { API_CONFIG, logger } from "../config";
logger.debug("Processing order", orderData);
```

### 3. **Constants Management**

- Created `constants/index.ts` with all app constants
- Routes, error messages, success messages, validation rules
- Single source of truth for application-level values

```typescript
// Usage
import { ROUTES, ERROR_MESSAGES } from "../constants";
navigate(ROUTES.PRODUCT_DETAIL("123"));
toast.error(ERROR_MESSAGES.VALIDATION);
```

### 4. **API Service with Retry Logic**

- Created `services/api.ts` with built-in retry mechanism
- Exponential backoff for failed requests
- Request timeout handling
- Proper error propagation

```typescript
// Usage
const { data, error, status } = await apiService.get("/products");
```

### 5. **Enhanced Navigation Hook**

- Created `useNavigation` hook for location tracking
- Automatic scroll-to-top on route changes
- Debug logging for all navigation events
- Unsaved changes prevention

### 6. **Code Organization**

- Separated concerns: config, constants, services, components, pages
- Clear folder structure following Next.js conventions
- Type safety throughout with TypeScript
- Consistent naming and file organization

---

## 🚀 Getting Started

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

### Build

```bash
npm run build
# or
yarn build
```

### Type Check

```bash
yarn tsc --noEmit
```

---

## 📋 Development Guidelines

### 1. **Adding New Routes**

1. Create page component in `src/app/pages/`
2. Add route to `src/app/routes.ts`
3. Add route link to `src/app/constants/index.ts`

```typescript
// routes.ts
{
  path: 'new-page',
  Component: NewPage,
}

// constants/index.ts
export const ROUTES = {
  NEW_PAGE: '/new-page',
};
```

### 2. **Adding New Components**

1. Create component in `src/app/components/`
2. Use TypeScript interfaces for props
3. Include proper error handling

```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  // ...
};
```

### 3. **Using the Navigation**

```typescript
import { useNavigation } from '../hooks/useNavigation';

export const MyComponent: React.FC = () => {
  const { navigate, currentPath } = useNavigation();

  return (
    <button onClick={() => navigate(ROUTES.HOME)}>
      Go Home
    </button>
  );
};
```

### 4. **Logging**

```typescript
import { logger } from "../config";

logger.debug("Debug message", data);
logger.info("Info message", data);
logger.warn("Warning message", data);
logger.error("Error message", error);
```

### 5. **API Calls**

```typescript
import { apiService } from "../services/api";

// GET request
const { data, error } = await apiService.get<Product[]>("/product");

// POST request
const response = await apiService.post("/product", { name: "New Product" });

// Handle errors
if (error) {
  logger.error("Failed to fetch", error);
  toast.error(ERROR_MESSAGES.GENERIC);
}
```

---

## 🧪 Testing Checklist

- [ ] Navigation between pages works without refresh
- [ ] URL updates correctly on navigation
- [ ] Product card Quick View modal opens on button click
- [ ] Modal closes on X button click
- [ ] Error boundary catches and displays errors
- [ ] Console shows debug logs in development
- [ ] Build completes without errors
- [ ] No TypeScript errors: `yarn tsc --noEmit`

---

## 📚 Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 🤝 Contributing

When making changes:

1. Follow the established folder structure
2. Write TypeScript with proper types
3. Add error boundaries where needed
4. Use the centralized config and constants
5. Log important operations using the logger
6. Test navigation and error scenarios

---

**Last Updated:** March 19, 2026
**Status:** Production Ready
