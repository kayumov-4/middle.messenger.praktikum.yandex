import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vitePluginString from "vite-plugin-string";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
  plugins: [
    vitePluginString({
      include: ["**/*.hbs"],
    }),
  ],
});
