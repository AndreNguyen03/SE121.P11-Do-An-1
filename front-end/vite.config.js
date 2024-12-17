import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',  // URL của server đích
        changeOrigin: true,  // Chuyển đổi origin của request
        rewrite: (path) => path.replace(/^\/api/, ''),  // Loại bỏ /api khỏi URL khi gửi yêu cầu tới server
      },
      '/ipfs': {
        target: 'https://ipfs.io',  // URL của IPFS
        changeOrigin: true,  // Chuyển đổi origin của request
        rewrite: (path) => path.replace(/^\/ipfs/, ''),  // Loại bỏ /ipfs khỏi URL
      },
    },
  },
})
