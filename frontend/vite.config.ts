import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 🍏 1. Import the Tailwind Vite plugin
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🍏 2. Add the tailwindcss function to your plugins array
  ],
  build: {
    // Raises the chunk size warning limit to 1000kB safely
    chunkSizeWarningLimit: 1000, 
    rolldownOptions: {
      output: {
        // Automatically splits node_modules packages into a separate vendor chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})