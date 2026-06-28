import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // Surface a clear message when the backend is not running
            console.error(
              '\n[vite proxy] ⚠️  Cannot reach backend at http://localhost:3000\n' +
              '  Make sure the backend is running: cd backend && npm start\n',
              err.code
            );
          });
        },
      },
    },
  },
})
