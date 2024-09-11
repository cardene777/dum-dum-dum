import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";
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
  // base: "/dum-dum-dum/",
  // base: "/",
  // build: {
  //   outDir: "../../dist", // dist 出力をプロジェクトのルートに出力
  //   emptyOutDir: true,
  // },
  // build: {
  //   outDir: "dist", // デフォルトの dist ディレクトリを使用
  //   emptyOutDir: true,
  // },
  root: "./",
  build: {
    // distフォルダに出力
    outDir: resolve(__dirname, "dist"),
    // 存在しないときはフォルダを作成する
    emptyOutDir: true,
    rollupOptions: {
      // entry pointがあるindex.htmlのパス
      input: {
        "": resolve(__dirname, "index.html"),
      },
      // bundle.jsを差し替えする
      output: {
        entryFileNames: `assets/bundle.js`,
      },
    },
  },
});
