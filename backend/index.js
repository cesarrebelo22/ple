require('dotenv').config()

const express = require('express')
const cors = require('cors')
const apiRoutes = require('./src/routes')
const errorHandler = require('./src/middlewares/errorHandler')
const { prisma } = require('./src/config/prisma')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', apiRoutes)

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Rota nao encontrada.',
  })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor backend em http://localhost:${PORT}`)
})

process.on('SIGINT', async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
  process.exit(0)
})
