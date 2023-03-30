import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const root = path.resolve(__dirname, resolveApp('src'))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = env.VITE_APP_ENVIRONMENT === 'production'

  return {
    ...(!isProduction && {
      server: { port: 3333 },
    }),
    ...(isProduction && {
      build: {
        lib: {
          entry: path.resolve(__dirname, `${root}/index.ts`),
          formats: ['cjs', 'es'],
          fileName: format => `react-provider.${format}.js`,
        },
        rollupOptions: {
          external: ['react'],
        },
        sourcemap: true,
      },
    }),
    plugins: [react(), tsconfigPaths(), dts()],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      dedupe: ['react'],
      alias: {
        '@': `${root}/`,
        'near-api-js': 'near-api-js/dist/near-api-js.js',
      },
    },
  }
})
