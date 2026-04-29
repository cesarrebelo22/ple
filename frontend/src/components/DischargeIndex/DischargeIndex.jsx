import './DischargeIndex.css'

export default function DischargeIndex() {
  return (
    <section id="discharge" className="di-section" aria-label="Índice de Descarga">

      {/* Section label */}
      <div className="di-section-label">
        <span className="di-section-num">01</span>
        <div>
          <div className="di-section-title">Índice de Descarga</div>
          <div className="di-section-sub">Ferramenta preditiva de janelas de descarga seguras</div>
        </div>
      </div>

      {/* Main card */}
      <div className="di-card">

        {/* Header */}
        <div className="di-card-header">
          <div className="di-card-icon" aria-hidden="true">⚙️</div>
          <div>
            <h2 className="di-card-title">Motor de Decisão — SAD Preditivo</h2>
            <p className="di-card-desc">
              Insere as condições ambientais em tempo real e obtém, de 0 a 100%, 
              a qualidade da janela de descarga para minimizar o impacto odorífero urbano.
            </p>
          </div>
        </div>

        {/* Maintenance banner */}
        <div className="di-maintenance">
          <div className="di-maintenance-icon" aria-hidden="true">🔧</div>
          <div className="di-maintenance-content">
            <div className="di-maintenance-title">Em Manutenção</div>
            <p className="di-maintenance-text">
              Esta ferramenta está a ser desenvolvida e estará disponível em breve.
              O índice de descarga calculará, com base na altura da maré, transição de maré,
              velocidade e direção do vento, de 0 a 100% o quão favorável é o momento para efetuar a descarga.
            </p>
          </div>
        </div>

        {/* Preview of what's coming — sliders locked/greyed */}
        <div className="di-preview">
          <div className="di-preview-title">Pré-visualização das variáveis de entrada</div>

          <div className="di-controls-grid">
            {[
              { label: 'Altura da Maré (m)', icon: '🌊', min: 0.5, max: 3.5, val: 2.0, unit: 'm' },
              { label: 'Transição de Maré (m/h)', icon: '↕️', min: -0.5, max: 0.5, val: 0.1, unit: 'm/h' },
              { label: 'Velocidade do Vento (kt)', icon: '💨', min: 0, max: 15, val: 5.0, unit: 'kt' },
              { label: 'SO₂ Ambiente (μg/m³)', icon: '🟡', min: 1, max: 6, val: 2.5, unit: 'μg/m³' },
            ].map(ctrl => (
              <div key={ctrl.label} className="di-ctrl">
                <div className="di-ctrl-top">
                  <span className="di-ctrl-icon">{ctrl.icon}</span>
                  <span className="di-ctrl-label">{ctrl.label}</span>
                </div>
                <div className="di-ctrl-val">{ctrl.val} <span className="di-ctrl-unit">{ctrl.unit}</span></div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={0.1}
                  defaultValue={ctrl.val}
                  className="di-slider di-slider--disabled"
                  disabled
                  aria-label={ctrl.label}
                />
              </div>
            ))}
          </div>

          {/* Wind direction — locked */}
          <div className="di-wind-dir">
            <span className="di-wind-dir-label">Direção do Vento</span>
            <div className="di-wind-dir-btns">
              {['N ✅', 'NW ✅', 'W', 'SW', 'S', 'SE 🔴'].map(d => (
                <button key={d} className="di-dir-btn" disabled aria-label={`Direção ${d}`}>{d}</button>
              ))}
            </div>
          </div>

          {/* Gauge placeholder */}
          <div className="di-gauge-wrap">
            <svg className="di-gauge-svg" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(26,26,46,0.08)" strokeWidth="16" />
              <circle
                cx="50" cy="50" r="40"
                fill="none" strokeWidth="16" strokeLinecap="round"
                stroke="rgba(26,26,46,0.12)"
                strokeDasharray="0 251.3"
              />
            </svg>
            <div className="di-gauge-center">
              <div className="di-gauge-pct">—</div>
              <div className="di-gauge-label">Índice</div>
            </div>
            <div className="di-gauge-status">
              <div className="di-gauge-status-dot" />
              Aguardar dados
            </div>
          </div>
        </div>

      </div>

      {/* Info cards */}
      <div className="di-info-grid">
        {[
          {
            icon: '🌊',
            title: 'Maré Alta',
            desc: 'Maior volume de água no estuário aumenta a capacidade de diluição dos efluentes.',
            tag: 'Favorável',
            tagColor: 'green',
          },
          {
            icon: '🧭',
            title: 'Vento N / NW',
            desc: 'Vento proveniente do norte afasta os compostos odoríferos do centro urbano.',
            tag: 'Favorável',
            tagColor: 'green',
          },
          {
            icon: '🟡',
            title: 'SO₂ Baixo',
            desc: 'Concentração de SO₂ baixa indica atividade industrial reduzida e menor risco.',
            tag: 'Favorável',
            tagColor: 'green',
          },
          {
            icon: '📉',
            title: 'Maré Baixa',
            desc: 'Menor volume de água diminui capacidade de diluição — janela desfavorável.',
            tag: 'Desfavorável',
            tagColor: 'red',
          },
        ].map(card => (
          <div key={card.title} className="di-info-card">
            <div className="di-info-card-icon">{card.icon}</div>
            <div className={`di-info-tag di-info-tag--${card.tagColor}`}>{card.tag}</div>
            <h3 className="di-info-card-title">{card.title}</h3>
            <p className="di-info-card-desc">{card.desc}</p>
          </div>
        ))}
      </div>

    </section>
  )
}
