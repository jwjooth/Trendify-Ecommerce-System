import { RouterProvider } from 'react-router';
import { CartProvider } from './context/CartContext';
import { router } from './routes';

/**
 * Root application component
 * Wraps the entire app with necessary providers
 */
export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
