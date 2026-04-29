import { useState, useEffect, useRef } from 'react'
import './NumericalMethods.css'

/* ──────────────────────────────────────────────────────────────
   MATLAB code to show in the modal
   ────────────────────────────────────────────────────────────── */
const MATLAB_CODE = `%% 1. CARREGAMENTO E LIMPEZA
clear; clc; close all;
nomeFicheiro = 'dados.xlsx'; 
opts = detectImportOptions(nomeFicheiro);
T = readtable(nomeFicheiro, opts);

% Conversão e Limpeza (Maré=Col2, SO2=Col5, Vento=Col7)
limpar = @(v) str2double(strrep(string(v), ',', '.'));
mare_total = limpar(T{:, 2});
so2_total  = limpar(T{:, 5});
wind_total = limpar(T{:, 7});

% Filtro: Vento de Sul (135º-225º) + Dados válidos
idx = (wind_total >= 135 & wind_total <= 225) & ~isnan(mare_total) & ~isnan(so2_total);
m_sul = mare_total(idx);
s_sul = so2_total(idx);

%% 2. MÉTODO BINNED AVERAGES (Intervalo: 0.5 a 3.5 | Passo: 0.2)
passo = 0.2;
edges = 0.5 : passo : 3.5; % Define o início em 0.5 e fim em 3.5
centros_X = (edges(1:end-1) + edges(2:end)) / 2;
medias_Y = zeros(size(centros_X));

for i = 1:length(centros_X)
    % Filtra os pontos que caem dentro de cada "caixa" de 0.2m
    condicao = (m_sul >= edges(i) & m_sul < edges(i+1));
    pontos_no_bin = s_sul(condicao);
    
    if ~isempty(pontos_no_bin)
        medias_Y(i) = mean(pontos_no_bin);
    else
        medias_Y(i) = NaN; % Se não houver dados no intervalo, marca como vazio
    end
end

% Remover intervalos sem dados para o ajuste não falhar
validos = ~isnan(medias_Y);
x_binned_final = centros_X(validos)';
y_binned_final = medias_Y(validos)';

%% 3. EXPORTAR PARA O WORKSPACE E APP
assignin('base', 'x_binned_final', x_binned_final);
assignin('base', 'y_binned_final', y_binned_final);

fprintf('Sucesso! Variáveis criadas com o intervalo 0.5m - 3.5m.\\n');
fprintf('Número de pontos médios gerados: %d\\n', length(x_binned_final));

%% 4. GRÁFICO DE VERIFICAÇÃO RÁPIDA
figure('Color', 'w');
plot(x_binned_final, y_binned_final, 'ro-', 'LineWidth', 2, 'MarkerFaceColor', 'r');
grid on;
xlabel('Altura da Maré (m)');
ylabel('Média de SO_2 (\\mug/m^3)');
title('Média de SO_2 por Intervalos de 0.2m (Foco: 0.5m a 3.5m)');`

/* ──────────────────────────────────────────────────────────────
   SVG Chart Component
   ────────────────────────────────────────────────────────────── */
function BinnedChart({ pontos }) {
  if (!pontos || pontos.length === 0) return null

  const W = 520
  const H = 240
  const PAD = { top: 20, right: 20, bottom: 48, left: 62 }

  const minX = 0.5
  const maxX = 3.5
  const minY = 1.5
  const maxY = 1.9

  const toSvgX = (x) =>
    PAD.left + ((x - minX) / (maxX - minX || 1)) * (W - PAD.left - PAD.right)
  const toSvgY = (y) =>
    PAD.top + (1 - (y - minY) / (maxY - minY || 1)) * (H - PAD.top - PAD.bottom)

  // Polyline
  const linePoints = pontos.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ')
  // Area: âncora em minY (não em 0)
  const areaPoints = [
    `${toSvgX(minX)},${toSvgY(minY)}`,
    ...pontos.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`),
    `${toSvgX(maxX)},${toSvgY(minY)}`,
  ].join(' ')

  // Y ticks: 5 linhas igualmente espaçadas dentro do range real
  const yTicks = 5
  const yStep = (maxY - minY) / yTicks

  // X ticks: mostra todos os bins (são apenas 15)
  const xTicks = pontos.filter((_, i) => i % 2 === 0)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="nm-svg-chart"
      role="img"
      aria-label="Gráfico binned averages SO₂ por maré"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e63946" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e63946" stopOpacity="0.03" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines Y */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const yVal = minY + i * yStep
        const sy = toSvgY(yVal)
        return (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={sy}
              x2={W - PAD.right}
              y2={sy}
              stroke="rgba(26,26,46,0.07)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            <text
              x={PAD.left - 6}
              y={sy + 4}
              textAnchor="end"
              fontSize="9.5"
              fill="rgba(26,26,46,0.45)"
            >
              {yVal.toFixed(2)}
            </text>
          </g>
        )
      })}

      {/* X-axis ticks */}
      {xTicks.map((p, i) => (
        <text
          key={i}
          x={toSvgX(p.x)}
          y={H - PAD.bottom + 16}
          textAnchor="middle"
          fontSize="9.5"
          fill="rgba(26,26,46,0.45)"
        >
          {p.x.toFixed(1)}m
        </text>
      ))}

      {/* Axis labels */}
      <text
        x={W / 2}
        y={H - 4}
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="600"
        fill="rgba(26,26,46,0.55)"
      >
        Altura da Maré (m)
      </text>
      <text
        transform={`rotate(-90, 13, ${H / 2})`}
        x={13}
        y={H / 2}
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="600"
        fill="rgba(26,26,46,0.55)"
      >
        Média SO₂ (µg/m³)
      </text>

      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke="#e63946"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Dots */}
      {pontos.map((p, i) => (
        <g key={i}>
          <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r="5" fill="#fff" stroke="#e63946" strokeWidth="2" />
          <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r="2.5" fill="#e63946" />
        </g>
      ))}
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────
   Code Modal
   ────────────────────────────────────────────────────────────── */
function CodeModal({ onClose }) {
  const modalRef = useRef(null)
  const [copied, setCopied] = useState(false)

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === modalRef.current) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleCopy = () => {
    navigator.clipboard.writeText(MATLAB_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="nm-modal-backdrop" ref={modalRef} onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Código MATLAB">
      <div className="nm-modal">
        <div className="nm-modal-header">
          <div className="nm-modal-title-group">
            <span className="nm-modal-icon">🔬</span>
            <div>
              <div className="nm-modal-title">Código MATLAB Original</div>
              <div className="nm-modal-sub">Binned Averages · Curve Fitter · SO₂ vs Maré</div>
            </div>
          </div>
          <div className="nm-modal-actions">
            <button className="nm-copy-btn" onClick={handleCopy} title="Copiar código">
              {copied ? '✓ Copiado' : '⎘ Copiar'}
            </button>
            <button className="nm-close-btn" onClick={onClose} title="Fechar" aria-label="Fechar modal">
              ✕
            </button>
          </div>
        </div>
        <div className="nm-modal-body">
          <div className="nm-code-label">
            <span className="nm-code-lang">MATLAB</span>
            <span className="nm-code-file">dados_mare_so2.m</span>
          </div>
          <pre className="nm-code-block">
            <code>{MATLAB_CODE}</code>
          </pre>
        </div>
        <div className="nm-modal-footer">
          <div className="nm-modal-note">
            💡 Este código foi adaptado para <strong>Python</strong> e executa em tempo real sobre a base de dados <code>minha_base</code>.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Dados simulados (fallback quando backend não está disponível)
   ────────────────────────────────────────────────────────────── */
function getDadosSimulados() {
  // Seed determinístico simples (sem Math.random para evitar variação)
  const base = [77.6, 73.9, 72.1, 73.8, 62.9, 59.6, 57.2, 58.4, 48.1, 39.7, 39.1, 39.6, 33.8, 27.9, 31.3]
  const centros = [0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4]
  // Normaliza para a gama real da BD (1.58–1.80 µg/m³)
  const minB = Math.min(...base), maxB = Math.max(...base)
  const pontos = centros.map((x, i) => ({
    x,
    y: parseFloat((1.58 + ((base[i] - minB) / (maxB - minB)) * 0.22).toFixed(4)),
    n: 0,
  }))
  return {
    ok: true,
    fonte: 'simulado',
    total_registos_bd: null,
    total_vento_sul: null,
    aviso: '⚠️ Backend não disponível (Vercel). A mostrar dados simulados com tendência real.',
    pontos,
  }
}

/* ──────────────────────────────────────────────────────────────
   Main NumericalMethods Component
   ────────────────────────────────────────────────────────────── */
export default function NumericalMethods() {
  const [estado, setEstado] = useState('idle') // idle | loading | ok | erro
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [modalAberto, setModalAberto] = useState(false)

  const fetchDados = async () => {
    setEstado('loading')
    setErro('')
    try {
      const resp = await fetch('/api/metodos-numericos/mare-so2')

      // Se a resposta não for JSON (ex: Vercel sem backend devolve HTML)
      const contentType = resp.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        // Backend não disponível — usar dados simulados no frontend
        setDados(getDadosSimulados())
        setEstado('ok')
        return
      }

      const json = await resp.json()
      if (json.ok) {
        setDados(json)
        setEstado('ok')
      } else {
        // Backend respondeu mas com erro — também usar simulados
        setDados(getDadosSimulados())
        setEstado('ok')
      }
    } catch {
      // Erro de rede (backend offline) — usar dados simulados
      setDados(getDadosSimulados())
      setEstado('ok')
    }
  }

  return (
    <>
      <div className="nm-card" id="metodos-numericos-card">

        {/* Header */}
        <div className="nm-header">
          <div className="nm-header-left">
            <div className="nm-badge">
              <span className="nm-badge-dot" />
              Métodos Numéricos
            </div>
            <h3 className="nm-title">Maré vs. SO₂ — Binned Averages</h3>
            <p className="nm-desc">
              Médias de SO₂ por intervalos de 0.2 m de maré (0.5 m a 3.5 m),
              filtradas para <strong>vento de Sul</strong> (135°–225°). Implementado
              em <span className="nm-py-tag">Python</span> sobre <code>minha_base</code>.
            </p>
          </div>
          <div className="nm-header-right">
            <div className="nm-method-tags">
              <span className="nm-tag nm-tag--blue">Intervalo: 0.2 m</span>
              <span className="nm-tag nm-tag--red">Vento Sul: 135°–225°</span>
              <span className="nm-tag nm-tag--green">Python · MySQL</span>
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="nm-chart-area">
          {estado === 'idle' && (
            <div className="nm-idle">
              <div className="nm-idle-icon">📊</div>
              <p>Clica em <strong>Executar Análise</strong> para calcular as médias.</p>
            </div>
          )}

          {estado === 'loading' && (
            <div className="nm-loading">
              <div className="nm-spinner" />
              <p>A executar script Python…</p>
            </div>
          )}

          {estado === 'erro' && (
            <div className="nm-error">
              <div className="nm-error-icon">⚠️</div>
              <p className="nm-error-msg">{erro}</p>
              <button className="nm-retry-btn" onClick={fetchDados}>Tentar novamente</button>
            </div>
          )}

          {estado === 'ok' && dados && (
            <div className="nm-result">
              {dados.aviso && (
                <div className="nm-aviso">
                  <span>⚠️</span> {dados.aviso}
                </div>
              )}
              <BinnedChart pontos={dados.pontos} />
              <div className="nm-stats">
                {dados.total_registos_bd != null && (
                  <div className="nm-stat">
                    <span className="nm-stat-val">{dados.total_registos_bd.toLocaleString('pt-PT')}</span>
                    <span className="nm-stat-label">Registos na BD</span>
                  </div>
                )}
                {dados.total_vento_sul != null && (
                  <div className="nm-stat">
                    <span className="nm-stat-val">{dados.total_vento_sul.toLocaleString('pt-PT')}</span>
                    <span className="nm-stat-label">Com vento de Sul</span>
                  </div>
                )}
                <div className="nm-stat">
                  <span className="nm-stat-val">{dados.pontos?.length ?? 0}</span>
                  <span className="nm-stat-label">Bins calculados</span>
                </div>
                <div className="nm-stat">
                  <span className="nm-stat-val nm-stat-fonte">
                    {dados.fonte === 'base_de_dados' ? '🟢 BD Real' : '🟡 Simulado'}
                  </span>
                  <span className="nm-stat-label">Fonte</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="nm-footer">
          <button
            className="nm-run-btn"
            onClick={fetchDados}
            disabled={estado === 'loading'}
            id="btn-executar-analise"
          >
            {estado === 'loading' ? (
              <><span className="nm-btn-spinner" /> A calcular…</>
            ) : (
              <><span>▶</span> Executar Análise</>
            )}
          </button>
          <button
            className="nm-code-btn"
            onClick={() => setModalAberto(true)}
            id="btn-ver-codigo-matlab"
          >
            <span>{'</>'}</span> Ver Código MATLAB
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && <CodeModal onClose={() => setModalAberto(false)} />}
    </>
  )
}
