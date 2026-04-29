require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const apiRoutes = require('./src/routes')
const errorHandler = require('./src/middlewares/errorHandler')
const { prisma } = require('./src/config/prisma')

const app = express()
const PORT = process.env.PORT || 3000

// ── Frontend compilado (React/Vite build) ─────────────────────────────────
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist')
app.use(express.static(FRONTEND_DIST))

app.use(cors())
app.use(express.json())

// ── API routes ────────────────────────────────────────────────────────────
app.use('/api', apiRoutes)

// ── SPA catch-all: todas as rotas não-API servem o index.html ────────────
app.use((req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'))
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🚀 App disponível em http://localhost:${PORT}`)
  console.log(`📡 API em http://localhost:${PORT}/api\n`)
})

process.on('SIGINT', async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
  process.exit(0)
})
