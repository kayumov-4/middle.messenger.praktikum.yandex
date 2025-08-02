import { defineConfig } from "vite";
import vitePluginString from "vite-plugin-string";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
    outDir: "dist",
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
