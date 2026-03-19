import { RouterProvider } from "react-router";
import { CartProvider } from "./context/CartContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { router } from "./routes";

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ErrorBoundary>
  );
}
