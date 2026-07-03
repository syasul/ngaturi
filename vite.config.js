import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-oxc';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@wedding/shared': path.resolve(__dirname, 'resources/js/types/shared.ts'),
            'react-router-dom': path.resolve(__dirname, 'resources/js/lib/router-shim.tsx'),
        },
    },
    optimizeDeps: {
        rolldownOptions: {},
    },
});

