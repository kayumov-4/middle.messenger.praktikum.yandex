import { defineConfig } from "vite";
import vitePluginString from "vite-plugin-string";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
});
