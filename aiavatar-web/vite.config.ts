import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const API_FILE = env.VITE_API_FILE;
  const API_VIDEO = env.VITE_API_VIDEO;

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // 代理 /upload 到目标 API
        '/upload': {
          target: API_FILE,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/upload/, '/upload'),
        },
        '/easy/submit': {
          target: API_VIDEO,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/easy\/submit/, '/easy/submit'),
        },
        '/easy/query': {
          target: API_VIDEO,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/easy\/query/, '/easy/query'),
        },
        '/voice-clone': {
          target: API_FILE,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/voice-clone/, '/voice-clone'),
        },
        '/t2a': {
          target: API_FILE,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/t2a/, '/t2a'),
        },
        '/voice-ids': {
          target: API_FILE,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
