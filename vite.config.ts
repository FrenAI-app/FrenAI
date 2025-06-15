
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ['@dynamic-labs/sdk-react-core'],
      onwarn(warning, warn) {
        // Suppress Privy-related warnings that don't affect functionality
        if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('@privy-io')) {
          return;
        }
        // Suppress dynamic-labs import warnings
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.id?.includes('@dynamic-labs')) {
          return;
        }
        warn(warning);
      }
    }
  }
}));
