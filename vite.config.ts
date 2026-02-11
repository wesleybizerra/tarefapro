import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Fix: Cast process to any to access cwd() when Node types are not fully available in some TS environments
    const env = loadEnv(mode, (process as any).cwd(), '');
    return {
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        define: {
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.ENCRYPTION_KEY': JSON.stringify(env.ENCRYPTION_KEY || 'default_key_32_chars_long_1234567'),
            'process.env.ASAAS_API_KEY': JSON.stringify(env.ASAAS_API_KEY),
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        resolve: {
            alias: {
                // Fix: Replace __dirname with (process as any).cwd() for ESM compatibility
                '@': path.resolve((process as any).cwd(), '.'),
            }
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            sourcemap: false
        }
    };
});