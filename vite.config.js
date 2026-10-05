import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyApi = { '/api': 'http://localhost:3001' }

export default defineConfig({
  plugins: [react()],
  server: { proxy: proxyApi },
  preview: { proxy: proxyApi },
})
