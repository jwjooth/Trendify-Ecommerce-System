import { RouterProvider } from "react-router";
<<<<<<< HEAD
import { HelmetProvider } from "react-helmet-async";
=======
>>>>>>> 07ec06bb513ba460a962961ed8fe05a03a79a574
import { CartProvider } from "./modules/cart/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { router } from "./routes";

export default function App() {
  return (
<<<<<<< HEAD
    <HelmetProvider>
      <ErrorBoundary>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ErrorBoundary>
    </HelmetProvider>
=======
    <ErrorBoundary>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ErrorBoundary>
>>>>>>> 07ec06bb513ba460a962961ed8fe05a03a79a574
  );
}
