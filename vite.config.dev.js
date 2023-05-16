import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mkcert(), react()],

  define: {
    global: {
      WebSocket: "WebSocket",
      ArrayBuffer: "ArrayBuffer",
    }, // this is the fix
  },
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
    strictPort: true,
    port: 4173,
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser", //fix production build
    },
  },
});
