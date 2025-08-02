import { defineConfig } from "vite";
import vitePluginString from "vite-plugin-string";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  plugins: [
    vitePluginString({
      include: ["**/*.hbs"],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "/src/style.css";`,
      },
    },
  },
});
