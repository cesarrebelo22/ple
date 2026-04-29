# ╔══════════════════════════════════════════════════════════════╗
# ║  start.ps1 — Arranca a app completa com Cloudflare Tunnel   ║
# ╚══════════════════════════════════════════════════════════════╝
#
# USO: Clica com botão direito → "Run with PowerShell"
#      ou na terminal: .\start.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         Grupo 2 — Arrancar App           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── 1. Compilar o frontend ────────────────────────────────────
Write-Host "📦 [1/3] A compilar o frontend..." -ForegroundColor Yellow
Set-Location "$Root\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar o frontend." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend compilado." -ForegroundColor Green
Write-Host ""

# ── 2. Iniciar o backend numa nova janela ─────────────────────
Write-Host "🖥️  [2/3] A iniciar o backend (porta 3000)..." -ForegroundColor Yellow
Set-Location "$Root\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; npm start" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "✅ Backend a correr em http://localhost:3000" -ForegroundColor Green
Write-Host ""

# ── 3. Iniciar o Cloudflare Tunnel ───────────────────────────
Write-Host "🌐 [3/3] A criar o Cloudflare Tunnel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  ┌─────────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "  │  O URL público vai aparecer abaixo em       │" -ForegroundColor Cyan
Write-Host "  │  segundos. Partilha esse link com outros.   │" -ForegroundColor Cyan
Write-Host "  └─────────────────────────────────────────────┘" -ForegroundColor Cyan
Write-Host ""

Set-Location $Root
Write-Host "  (Ctrl+C para parar o tunnel)" -ForegroundColor DarkGray
Write-Host ""
cloudflared tunnel --url http://localhost:3000
