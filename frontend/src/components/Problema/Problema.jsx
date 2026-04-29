import './Problema.css'

export default function Problema() {
  return (
    <div className="prob-page">

      {/* ── HERO ── */}
      <section className="prob-hero">
        <div className="prob-hero-bg-grid" aria-hidden="true" />
        <div className="prob-hero-orb prob-hero-orb--1" aria-hidden="true" />
        <div className="prob-hero-orb prob-hero-orb--2" aria-hidden="true" />

        <div className="prob-hero-content">
          <div className="prob-badge">
            <span className="prob-badge-dot" />
            Ficha de Projeto · Grupo 2 · EGI · 2025/26
          </div>
          <p className="prob-eyebrow">The Navigator Company · Setúbal</p>
          <h1 className="prob-title">
            Otimização do Impacto Odorífero
            <br />
            <span className="prob-title-accent">na The Navigator Company</span>
          </h1>
          <p className="prob-subtitle">
            Um Modelo de Gestão Preditiva baseado em Variáveis Oceanográficas
          </p>
        </div>
      </section>

      {/* ── SECTIONS ── */}
      <div className="prob-body">

        {/* ── 1. O Problema ── */}
        <section className="prob-section">
          <div className="prob-section-num">01</div>
          <div className="prob-section-content">
            <h2 className="prob-section-title">O Problema <span className="prob-section-sub-title">— A Dor</span></h2>

            <div className="prob-cards">
              <div className="prob-card prob-card--red">
                <div className="prob-card-icon">🏭</div>
                <h3>Contexto</h3>
                <p>Impacto social e ambiental negativo causado por odores industriais em Setúbal, afetando a qualidade de vida da população urbana próxima das instalações.</p>
              </div>

              <div className="prob-card prob-card--blue">
                <div className="prob-card-icon">⚠️</div>
                <h3>Causa Raiz</h3>
                <p>Desfasamento entre o ritmo de produção e descarga e as condições naturais de <strong>dispersão</strong> (Vento) e <strong>diluição</strong> (Maré) disponíveis no estuário do Sado.</p>
              </div>

              <div className="prob-card prob-card--dark">
                <div className="prob-card-icon">🔄</div>
                <h3>O "Gap"</h3>
                <p>A fábrica opera de forma <strong>linear</strong> e contínua, mas o ambiente é <strong>dinâmico</strong>. As condições ideais de descarga variam com a maré, o vento e os níveis de SO₂.</p>
              </div>
            </div>

            {/* Diagrama visual */}
            <div className="prob-gap-diagram">
              <div className="prob-gap-side">
                <div className="prob-gap-label">Produção Industrial</div>
                <div className="prob-gap-bar prob-gap-bar--linear">
                  <div className="prob-gap-bar-fill" />
                  <span>Fluxo constante e linear</span>
                </div>
              </div>
              <div className="prob-gap-vs">≠</div>
              <div className="prob-gap-side">
                <div className="prob-gap-label">Capacidade Natural</div>
                <div className="prob-gap-bar prob-gap-bar--dynamic">
                  {[40, 70, 90, 55, 80, 45, 95, 60].map((h, i) => (
                    <div key={i} className="prob-gap-wave-bar" style={{ height: `${h}%` }} />
                  ))}
                  <span>Variável com maré e vento</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="prob-divider" />

        {/* ── 2. Objetivo Geral ── */}
        <section className="prob-section">
          <div className="prob-section-num">02</div>
          <div className="prob-section-content">
            <h2 className="prob-section-title">Objetivo Geral</h2>

            <div className="prob-objective-card">
              <div className="prob-objective-quote">"</div>
              <p className="prob-objective-text">
                Para além de reduzir o número de descargas, num segundo plano{' '}
                <strong>otimizar o escalonamento (scheduling) das descargas industriais</strong>{' '}
                para minimizar o risco de odor na malha urbana, sem comprometer a continuidade da produção.
              </p>
            </div>

            <div className="prob-objective-grid">
              <div className="prob-obj-item">
                <div className="prob-obj-icon">📉</div>
                <div className="prob-obj-label">Reduzir descargas</div>
                <div className="prob-obj-desc">Diminuir o número total de eventos de descarga em condições desfavoráveis</div>
              </div>
              <div className="prob-obj-item">
                <div className="prob-obj-icon">📅</div>
                <div className="prob-obj-label">Scheduling otimizado</div>
                <div className="prob-obj-desc">Escalonar descargas para janelas temporais de baixo risco ambiental</div>
              </div>
              <div className="prob-obj-item">
                <div className="prob-obj-icon">🏙️</div>
                <div className="prob-obj-label">Minimizar impacto urbano</div>
                <div className="prob-obj-desc">Proteger a qualidade do ar na malha urbana de Setúbal</div>
              </div>
              <div className="prob-obj-item">
                <div className="prob-obj-icon">⚙️</div>
                <div className="prob-obj-label">Sem parar a produção</div>
                <div className="prob-obj-desc">Manter a continuidade operacional e produtiva da fábrica</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="prob-divider" />

        {/* ── 3. Variáveis ── */}
        <section className="prob-section">
          <div className="prob-section-num">03</div>
          <div className="prob-section-content">
            <h2 className="prob-section-title">Variáveis de Decisão</h2>
            <p className="prob-section-intro">
              O modelo integra cinco variáveis oceanográficas e ambientais para calcular a janela ideal de descarga:
            </p>

            <div className="prob-vars">
              {[
                { icon: '🟡', name: 'SO₂',               desc: 'Proxy da atividade industrial (μg/m³)', color: '#e63946' },
                { icon: '🌊', name: 'Altura da Maré',     desc: 'Capacidade de diluição (m)',            color: '#4a6fa5' },
                { icon: '↕️', name: 'Transição da Maré',  desc: 'Dinâmica do estuário (m/h)',            color: '#4a6fa5' },
                { icon: '🧭', name: 'Direção do Vento',   desc: 'Transporte atmosférico (°)',            color: '#1a1a2e' },
                { icon: '💨', name: 'Velocidade do Vento',desc: 'Dispersão / transporte (kt)',           color: '#1a1a2e' },
              ].map(v => (
                <div key={v.name} className="prob-var-card">
                  <div className="prob-var-icon">{v.icon}</div>
                  <div className="prob-var-name" style={{ color: v.color }}>{v.name}</div>
                  <div className="prob-var-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="prob-divider" />

        {/* ── 4. Abordagem ── */}
        <section className="prob-section prob-section--last">
          <div className="prob-section-num">04</div>
          <div className="prob-section-content">
            <h2 className="prob-section-title">Da Gestão Reativa à Preditiva</h2>

            <div className="prob-flow">
              {[
                { icon: '📊', title: 'Dados em Tempo Real',     desc: 'SO₂, maré e vento integrados' },
                { icon: '🧮', title: 'Algoritmo SAD',            desc: 'Calcula janelas de baixo risco' },
                { icon: '📅', title: 'Scheduling Otimizado',    desc: 'Descarga apenas em janelas seguras' },
                { icon: '✅', title: 'Risco Mínimo',            desc: 'Sem parar a produção' },
              ].map((step, i) => (
                <div key={step.title} className="prob-flow-step">
                  <div className="prob-flow-icon">{step.icon}</div>
                  <div className="prob-flow-title">{step.title}</div>
                  <div className="prob-flow-desc">{step.desc}</div>
                  {i < 3 && <div className="prob-flow-arrow" aria-hidden="true">→</div>}
                </div>
              ))}
            </div>

            <div className="prob-callout">
              <span className="prob-callout-em">De reativo</span> para{' '}
              <span className="prob-callout-em">preditivo</span> —
              a fábrica passa a antecipar janelas de risco em vez de reagir a crises.
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
