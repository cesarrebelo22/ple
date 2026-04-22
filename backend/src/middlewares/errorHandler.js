function errorHandler(error, _req, res, _next) {
  console.error(error)

  res.status(error.status || 500).json({
    ok: false,
    message: error.message || 'Erro interno do servidor.',
  })
}

module.exports = errorHandler
