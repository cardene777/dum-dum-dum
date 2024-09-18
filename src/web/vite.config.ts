import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import generouted from "@generouted/react-router/plugin";

export default defineConfig({
  base:"./",
  root:"./",
  plugins: [
    nodePolyfills({
      include: ["buffer", "crypto", "stream", "util", "http", "path"],
    }),
    react(),
    generouted(),
    tsconfigPaths(),
  ],
  // root: "./",
  // build: {
  //   outDir: resolve(__dirname, "dist"),
  //   emptyOutDir: true,
  //   rollupOptions: {
  //     input: {
  //       "": resolve(__dirname, "index.html"),
  //     },
  //     output: {
  //       entryFileNames: `assets/bundle.js`,
  //     },
  //   },
  // },
  // css: {
  //   modules: {
  //     generateScopedName: isDevelopment
  //       ? "[name]__[local]__[hash:base64:5]"
  //       : "[hash:base64:5]",
  //   },
  // },
  // preprocessorOptions: {
  //   css: {
  //     charset: false,
  //   },
  // },
  // base: "/dum-dum-dum/",
});
