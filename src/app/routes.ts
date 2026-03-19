import { createBrowserRouter, RouteObject } from "react-router";
import { Layout } from "./components/Layout";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: ProductsPage,
      },
      {
        path: "product/:id",
        Component: ProductDetailPage,
      },
      {
        path: "cart",
        Component: CartPage,
      },
      {
        path: "checkout",
        Component: CheckoutPage,
      },
      {
        path: "order-confirmation/:id",
        Component: OrderConfirmationPage,
      },
      {
        path: "about",
        Component: AboutPage,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
});
