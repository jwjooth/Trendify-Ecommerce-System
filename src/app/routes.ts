import CartPage from "@/pages/cart";
import ContactPage from "pages/contact";
import ProductDetailPage from "pages/product";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { CheckoutPage } from "./features/checkout/CheckoutPage";
import { AboutPage } from "./features/marketing/AboutPage";
import { ProductsPage } from "./features/products/ProductsPage";
import { Layout } from "./shared/layout/Layout";
import { NotFoundPage } from "./shared/layout/NotFoundPage";
import { OrderConfirmationPage } from "./shared/layout/OrderConfirmationPage";

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
    unstable_passThroughRequests: true,
  },
});
