import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mkcert(), react()],

  define: {},
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
  },
  server: {
    open: false,
    https: false,
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "0.0.0.0",
      port: 4173,
    },
    host: "0.0.0.0",
    strictPort: true,
    port: 4173,
  },
  preview: {
    port: 8080,
    host: "0.0.0.0",
    https: false,
    open: false,
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser", //fix production build
    },
  },
});
