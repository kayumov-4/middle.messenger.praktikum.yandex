import { defineConfig } from "vite";
import string from "vite-plugin-string";
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
});
