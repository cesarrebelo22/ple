const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
const { PrismaClient } = require('@prisma/client')

const databaseUrl = process.env.DATABASE_URL

const prisma = databaseUrl
  ? new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) })
  : null

module.exports = {
  prisma,
  hasDatabaseUrl: Boolean(databaseUrl),
}
