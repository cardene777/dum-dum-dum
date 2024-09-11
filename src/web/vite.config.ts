import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    nodePolyfills({
      include: ["buffer", "crypto", "stream", "util", "http", "path"],
    }),
    react(),
  ],
  base: "/src/web/",
});
