import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Дотоод сүлжээнээс хандахыг зөвшөөрөх
    port: 5173,
  },
})
