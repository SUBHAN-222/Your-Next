import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import resolveLearningResource from './api/resolve-learning-resource.js'

// Vercel runs files in /api automatically. This adapter lets the same verified
// discovery endpoint run when using `vite dev` or `vite preview` locally.
function localApiPlugin() {
  const middleware = async (req, res, next) => {
    if (!req.url?.startsWith('/api/resolve-learning-resource')) return next()
    let raw = ''
    try {
      for await (const chunk of req) raw += chunk
      req.body = raw ? JSON.parse(raw) : {}
    } catch {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'Invalid request body' }))
    }
    const response = {
      status(code) { res.statusCode = code; return response },
      json(payload) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(payload)) },
    }
    try {
      await resolveLearningResource(req, response)
    } catch (error) {
      console.error('[local resource API]', error)
      response.status(502).json({ error: 'We could not finish searching for a suitable video. Please retry.' })
    }
  }
  return {
    name: 'local-resource-api',
    configureServer(server) { server.middlewares.use(middleware) },
    configurePreviewServer(server) { return () => server.middlewares.use(middleware) },
  }
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@data': path.resolve(__dirname, './src/data'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@context': path.resolve(__dirname, './src/context'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@lib': path.resolve(__dirname, './src/lib')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
