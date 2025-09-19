import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode}) => {

  const env = loadEnv(mode, process.cwd(), '');
  const API = env.VITE_API_URL || 'http://sogas-backend.onrender.comlocalhost:3000';

  return {
    plugins: [react()],

    envPrefix: 'VITE_',

    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: API,
          changeOrigin: true,
        },
      },
    },

    preview: {
      port: 4173,
      proxy: {
        '/api': {
          target: API,
          changeOrigin: true,
        },
      },
    },

    define: {
      __API_BASE__: JSON.stringify(API),
    },
  };
});
