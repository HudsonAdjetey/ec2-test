import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteCompressionPlugin from 'vite-plugin-compression';
import { terser } from 'rollup-plugin-terser';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser",
    rollupOptions: {
      plugins: [
        ViteCompressionPlugin({
          algorithm: "gzip"
        }),
        terser()
      ]
    },
    chunkSizeWarningLimit: 1600
  }
})