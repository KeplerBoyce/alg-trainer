import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    commonjs(),
    sveltekit(),
    Icons({
      compiler: 'svelte',
    }),
  ]
});
