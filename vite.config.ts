import { defineConfig } from "vite";
import string from "vite-plugin-string";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  plugins: [
    string({
      include: "**/*.hbs",
    }),
  ],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
});
