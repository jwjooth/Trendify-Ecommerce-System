import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ["**/*.svg", "**/*.csv"],

  server: {
    middlewareMode: false,
    historyApiFallback: true,
  },

  build: {
    // Ensure proper source maps for debugging
    sourcemap: process.env.NODE_ENV === "development",
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
          ],
        },
      },
    },
  },
});
