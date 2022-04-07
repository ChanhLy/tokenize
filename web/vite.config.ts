import { defineConfig, ProxyOptions, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';

const proxy: Record<string, string | ProxyOptions> = {
  '/api': {
    target: 'https://localhost:3000',
    changeOrigin: true,
    secure: false,
    ws: true,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy,
  },
});
