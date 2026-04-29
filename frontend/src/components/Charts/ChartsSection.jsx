import './ChartsSection.css'
import NumericalMethods from './NumericalMethods'

const CHART_PREVIEWS = [
  {
    id: 'so2-boxplot',
    title: 'SO₂ por Fase da Lua',
    desc: 'Distribuição dos valores de SO₂ segmentada pelas fases lunares — lua nova, quarto crescente, lua cheia e quarto minguante.',
    icon: '🟡',
    tag: 'Boxplot',
    color: '#e63946',
  },
  {
    id: 'so2-fase-lua',
    title: 'SO₂ em Função da Fase da Lua',
    desc: 'Evolução temporal dos níveis de SO₂ em correlação com as diferentes fases da lua ao longo do período de estudo.',
    icon: '🌙',
    tag: 'Séries Temporais',
    color: '#4a6fa5',
  },
  {
    id: 'mare-so2',
    title: 'Maré vs. SO₂',
    desc: 'Correlação entre a altura da maré e os níveis de SO₂ medidos. Evidencia o papel da maré alta na diluição dos efluentes.',
    icon: '🌊',
    tag: 'Correlação',
    color: '#e63946',
  },
  {
    id: 'vento-risco',
    title: 'Vento e Risco de Odor',
    desc: 'Análise da direção e velocidade do vento em relação ao risco de impacto odorífero na malha urbana de Setúbal.',
    icon: '💨',
    tag: 'Análise de Risco',
    color: '#4a6fa5',
  },
]

function ChartCard({ chart }) {
  return (
    <div className="cs-chart-card" id={`chart-card-${chart.id}`}>
      <div className="cs-chart-card-header">
        <span className="cs-chart-icon">{chart.icon}</span>
        <div>
          <div className="cs-chart-tag" style={{ color: chart.color, borderColor: `${chart.color}33`, background: `${chart.color}11` }}>
            {chart.tag}
          </div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="cs-chart-placeholder" aria-label={`Gráfico: ${chart.title}`}>
        <div className="cs-chart-skeleton">
          {/* Simulated bar chart bars */}
          {[65, 80, 45, 90, 55, 75, 60, 85, 40, 70].map((h, i) => (
            <div
              key={i}
              className="cs-skeleton-bar"
              style={{
                height: `${h}%`,
                background: `${chart.color}`,
                opacity: 0.15 + (i % 3) * 0.08,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <div className="cs-chart-coming">
          <span className="cs-chart-coming-icon">📊</span>
          <span>Gráfico em breve</span>
        </div>
      </div>

      <div className="cs-chart-info">
        <h3 className="cs-chart-title">{chart.title}</h3>
        <p className="cs-chart-desc">{chart.desc}</p>
      </div>
    </div>
  )
}

export default function ChartsSection() {
  return (
    <section id="charts" className="cs-section" aria-label="Gráficos e Análises">

      {/* Section label */}
      <div className="cs-section-label">
        <span className="cs-section-num">02</span>
        <div>
          <div className="cs-section-title">Gráficos e Análises</div>
          <div className="cs-section-sub">Visualizações geradas por queries sobre os dados históricos</div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="cs-grid">
        {CHART_PREVIEWS.map(chart => (
          <ChartCard key={chart.id} chart={chart} />
        ))}
      </div>

      {/* Numerical Methods section */}
      <div className="cs-section-label" style={{ marginTop: '48px' }}>
        <span className="cs-section-num">03</span>
        <div>
          <div className="cs-section-title">Métodos Numéricos</div>
          <div className="cs-section-sub">Análise computacional em Python sobre a base de dados real</div>
        </div>
      </div>

      <div className="cs-grid" style={{ marginBottom: '36px' }}>
        <NumericalMethods />
      </div>

      {/* Bottom callout */}
      <div className="cs-callout">
        <div className="cs-callout-icon">🔬</div>
        <div>
          <div className="cs-callout-title">Dados reais · Queries SQL · Análise estatística</div>
          <p className="cs-callout-text">
            Todos os gráficos são gerados a partir de dados históricos reais através de queries
            sobre a base de dados do projeto. Os dados incluem séries temporais de SO₂, maré e vento
            obtidos do estuário do Sado e estações de monitorização de Setúbal.
          </p>
        </div>
      </div>

    </section>
  )
}
