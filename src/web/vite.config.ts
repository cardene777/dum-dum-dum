import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import generouted from "@generouted/react-router/plugin";

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ["buffer", "crypto", "stream", "util", "http", "path"],
    }),
    react(),
    generouted(),
    tsconfigPaths(),
  ],
  base: "./",
});
