import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";
import { CartProvider } from "./features/cart/CartContext";
import { router } from "./router/index";
import { ErrorBoundary } from "./shared/layout/ErrorBoundary";

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
