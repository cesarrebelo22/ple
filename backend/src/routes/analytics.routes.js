const express = require('express')
const { prisma, hasDatabaseUrl } = require('../config/prisma')

const router = express.Router()

router.get('/so2/fase-lua', async (_req, res, next) => {
  if (!hasDatabaseUrl || !prisma) {
    return res.status(500).json({
      ok: false,
      message: 'DATABASE_URL nao definida. Configure no ficheiro .env do backend.',
    })
  }

  try {
    const data = await prisma.$queryRaw`
      SELECT
        f.nome AS fase_lua,
        AVG(i.valor) AS media_so2
      FROM Indicador i
      JOIN fase_da_lua f ON i.fase_lua_id = f.id
      WHERE i.parametro_id = 1
      GROUP BY f.nome
      ORDER BY media_so2 DESC
    `

    res.json({
      ok: true,
      total: data.length,
      data,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/indicadores/recentes', async (req, res, next) => {
  if (!hasDatabaseUrl || !prisma) {
    return res.status(500).json({
      ok: false,
      message: 'DATABASE_URL nao definida. Configure no ficheiro .env do backend.',
    })
  }

  const limit = Number(req.query.limit) || 20

  try {
    const data = await prisma.$queryRawUnsafe(
      `
      SELECT
        i.id,
        i.valor,
        i.fase_lua_id,
        i.parametro_id
      FROM Indicador i
      ORDER BY i.id DESC
      LIMIT ?
      `,
      Math.min(Math.max(limit, 1), 200),
    )

    res.json({
      ok: true,
      total: data.length,
      data,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
