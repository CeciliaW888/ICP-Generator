import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    server: {
      host: true, // Exposes the server to your local network (0.0.0.0)
    },
    define: {
      // Polyfill process.env.API_KEY so the existing code works
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});