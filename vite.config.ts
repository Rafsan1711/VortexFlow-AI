import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.svg'],
        workbox: {
          maximumFileSizeToCacheInBytes: 3000000,
        },
        manifest: {
          name: 'VortexFlow AI',
          short_name: 'VortexFlow',
          description: 'Next-generation AI chat platform powered by Gemini.',
          theme_color: '#0A0A0F',
          background_color: '#0A0A0F',
          display: 'standalone',
          icons: [
            {
              src: 'logo.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'logo.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/database'],
            'ui-vendor': ['framer-motion', '@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/vercel-status': {
          target: 'https://www.vercel-status.com/api/v2/status.json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/vercel-status/, '')
        },
        '/api/firebase-status': {
          target: 'https://status.firebase.google.com/incidents.json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/firebase-status/, '')
        },
        '/api/gcloud-status': {
          target: 'https://status.cloud.google.com/incidents.json',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gcloud-status/, '')
        }
      }
    },
  };
});
