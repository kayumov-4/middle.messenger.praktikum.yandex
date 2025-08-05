import { defineConfig } from "vite";
import vitePluginString from "vite-plugin-string";
import { resolve } from "node:path";
import history from "connect-history-api-fallback";

export default defineConfig({
  server: {
    port: 3000,
    middlewareMode: true,
  },
  preview: {
    port: 3000,
  },
  plugins: [
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use(history());
      },
    },
    vitePluginString({
      include: ["**/*.hbs"],
    }),
  ],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
});
