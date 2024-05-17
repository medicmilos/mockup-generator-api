import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    base: "./",
    server: {
      port: 5173,
    },
    define: {
      API_BASE_URL: JSON.stringify(process.env.VITE_API_BASE_URL),
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "/src") }],
    },
    plugins: [react()],
  });
};
