import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "$lib": path.resolve('./src/lib'),
      "$components": path.resolve("./src/components"),
      "$data": path.resolve("./src/data"),
      "$routes": path.resolve("./src/routes"),
    }
  }
})
