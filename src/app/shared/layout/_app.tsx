import { CartProvider } from "@/app/features/cart/CartContext";
import { ErrorBoundary } from "@/app/shared/layout/ErrorBoundary";
import { Footer } from "@/app/shared/layout/Footer";
import { Header } from "@/app/shared/layout/Header";
import { Toaster } from "@/app/shared/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HelmetProvider } from "react-helmet-async";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </CartProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
