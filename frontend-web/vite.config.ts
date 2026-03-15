import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: [
      'web_ssams_au',
      'localhost',
      '127.0.0.1',
      // Optional: Allow all hosts (useful for Docker, but less secure in production)
      // allowedHosts: true 
    ],
    port: 4000,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 80,
    },
    watch: {
      usePolling: true, // ជួយឱ្យស្គាល់ការកែប្រែ File លើ Windows/WSL
    },
  }
})
