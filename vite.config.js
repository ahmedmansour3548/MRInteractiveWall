import { defineConfig } from 'vite';

export default defineConfig({
    proxy: {
        '/api': {
            target: 'http://localhost:5173', // Replace with your API server URL
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
        },
    },
});
