import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // needed for Docker
    port: 5173,       // keep Vite on 5173
    strictPort: true, // don't auto-change port
  },
})
