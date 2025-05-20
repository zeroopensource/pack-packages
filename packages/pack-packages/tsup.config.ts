import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  publicDir: './public',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: {
    resolve: true,
    compilerOptions: {
      moduleResolution: 'node',
    },
  },
  format: ['cjs', 'esm'],
  minify: true,
})
