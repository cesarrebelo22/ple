const express = require('express')
const healthRoutes = require('./health.routes')
const analyticsRoutes = require('./analytics.routes')
const numericalRoutes = require('./numerical.routes')

const router = express.Router()

router.use(healthRoutes)
router.use(analyticsRoutes)
router.use(numericalRoutes)

module.exports = router
