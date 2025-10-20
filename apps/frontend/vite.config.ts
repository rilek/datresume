import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsConfigPaths from 'vite-tsconfig-paths'
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"]
    }),
    tanstackStart({
      srcDirectory: "./src"
    }),
    nitro({
      
    }),
    react(),
    tailwindcss()
  ]
})
