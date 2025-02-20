/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, CommonServerOptions } from 'vite';
import react from '@vitejs/plugin-react';
import http from 'http';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// docker-compose will avoid using the fallback due to always having one of OVERRIDE_API_PROXY or API_PROXY set
const FALLBACK_PROXY = 'http://127.0.0.1:8000';
const TARGET = process.env.OVERRIDE_API_PROXY || process.env.API_PROXY || FALLBACK_PROXY;

const agent = new http.Agent();

const PROXIES: CommonServerOptions['proxy'] = {};
const PROXY_PATHS = ['/petition/api', '/admin/', '/static/admin', '/password_reset/', '/reset/', '/portal/'];
PROXY_PATHS.forEach((path) => {
  PROXIES[path] = { target: TARGET, changeOrigin: true, secure: false, agent };
});

export default defineConfig(() => ({
  base: './',
  build: {
    outDir: 'build',
    assetsDir: 'static',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: PROXIES,
  },
  assetsInclude: '**/*.md',
  plugins: [react(), viteTsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    testTimeout: 30000,
  },
}));
