const express = require('express')
const healthRoutes = require('./health.routes')
const analyticsRoutes = require('./analytics.routes')

const router = express.Router()

router.use(healthRoutes)
router.use(analyticsRoutes)

module.exports = router
