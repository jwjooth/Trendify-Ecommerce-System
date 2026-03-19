import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Application routing configuration
 * Using React Router's data mode for better code splitting and data loading
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: ProductsPage,
      },
      {
        path: 'product/:id',
        Component: ProductDetailPage,
      },
      {
        path: 'cart',
        Component: CartPage,
      },
      {
        path: 'checkout',
        Component: CheckoutPage,
      },
      {
        path: 'order-confirmation/:id',
        Component: OrderConfirmationPage,
      },
      {
        path: 'about',
        Component: AboutPage,
      },
      {
        path: 'contact',
        Component: ContactPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);
