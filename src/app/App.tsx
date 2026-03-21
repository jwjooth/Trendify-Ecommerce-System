import { RouterProvider } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./modules/cart/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { router } from "./routes";

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
