import CartPage from "@/pages/cart";
import { RouteObject } from "react-router-dom";
import { CheckoutPage } from "../features/checkout/CheckoutPage";
import { AboutPage } from "../features/marketing/AboutPage";
import ContactPage from "../features/marketing/contact";
import ProductDetailPage from "../features/products/product";
import { ProductsPage } from "../features/products/ProductsPage";
import { Layout } from "../shared/layout/Layout";
import { NotFoundPage } from "../shared/layout/NotFoundPage";
import { OrderConfirmationPage } from "../shared/layout/OrderConfirmationPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout children />,
    children: [
      { index: true, element: <ProductsPage /> },

      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-confirmation/:id", element: <OrderConfirmationPage /> },

      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
