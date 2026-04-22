const express = require('express')
const { prisma, hasDatabaseUrl } = require('../config/prisma')

const router = express.Router()

router.get('/health', async (_req, res) => {
  if (!hasDatabaseUrl || !prisma) {
    return res.status(500).json({
      ok: false,
      message: 'DATABASE_URL nao definida. Configure no ficheiro .env do backend.',
      timestamp: new Date().toISOString(),
    })
  }

  try {
    await prisma.$queryRaw`SELECT 1`

    res.json({
      ok: true,
      message: 'Backend ativo com Prisma ligado ao MySQL.',
      timestamp: new Date().toISOString(),
    })
  } catch (_error) {
    res.status(500).json({
      ok: false,
      message: 'Backend ativo, mas sem ligacao ao MySQL. Verifique DATABASE_URL.',
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
