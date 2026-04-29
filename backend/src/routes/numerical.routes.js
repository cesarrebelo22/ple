const express = require('express')
const { spawn } = require('child_process')
const path = require('path')

const router = express.Router()

/**
 * GET /api/metodos-numericos/mare-so2
 * Executa o script Python que calcula as médias de SO₂ por
 * intervalos de maré (binned averages, 0.5–3.5 m, passo 0.2 m)
 * filtradas para vento de Sul (135°–225°).
 */
router.get('/metodos-numericos/mare-so2', (req, res) => {
  // __dirname = backend/src/routes  →  ../../scripts/python
  const scriptPath = path.resolve(
    __dirname,
    '../../scripts/python/metodos_numericos_mare_so2.py',
  )

  // No Windows o executável pode ser 'python', 'py' ou 'python3'
  const PYTHON_CMDS = ['python', 'py', 'python3']

  function trySpawn(cmds) {
    if (cmds.length === 0) {
      return res.status(500).json({
        ok: false,
        message: 'Python não encontrado. Instala Python e adiciona ao PATH.',
      })
    }

    const cmd = cmds[0]
    const python = spawn(cmd, [scriptPath], {
      env: { ...process.env },
      windowsHide: true,
    })

    let stdout = ''
    let stderr = ''

    python.stdout.on('data', (data) => { stdout += data.toString() })
    python.stderr.on('data', (data) => { stderr += data.toString() })

    python.on('close', (code) => {
      if (code !== 0 && !stdout) {
        return res.status(500).json({
          ok: false,
          message: 'Erro ao executar script Python.',
          detalhe: stderr || `Processo terminou com código ${code}`,
          scriptPath,
          cmd,
        })
      }

      try {
        const resultado = JSON.parse(stdout.trim())
        return res.json(resultado)
      } catch {
        return res.status(500).json({
          ok: false,
          message: 'O script Python devolveu dados inválidos.',
          raw: stdout.substring(0, 500),
          stderr: stderr.substring(0, 300),
        })
      }
    })

    python.on('error', () => {
      // Este comando não existe, tenta o próximo
      trySpawn(cmds.slice(1))
    })
  }

  trySpawn(PYTHON_CMDS)
})

module.exports = router
