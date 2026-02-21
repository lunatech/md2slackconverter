import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Use relative asset paths in production builds so the app works on
  // GitHub project pages (/repo/) and root-hosted static servers alike.
  base: command === 'build' ? './' : '/',
  build: {
    outDir: 'dist',
  },
}));
