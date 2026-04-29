import { useEffect, useRef, useState, useMemo } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import './AboutUs.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const SETUBAL = [-8.8882, 38.5244]
const PORTUGAL_ID = 620
const FINAL_SCALE = 20   // zoom máximo

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function AboutUs() {
  const sectionRef = useRef(null)
  const [progress, setProgress]   = useState(0)
  const [mapData, setMapData]     = useState({ paths: [], sx: null, sy: null })
  const [vp, setVp]               = useState({ w: window.innerWidth, h: window.innerHeight })

  // Viewport
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Mapa
  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(world => {
        const proj = geoNaturalEarth1().scale(153).translate([480, 250])
        const countries = feature(world, world.objects.countries)
        const pathGen = geoPath().projection(proj)
        const paths = countries.features
          .filter(f => f.id !== '010') // Remover Antártida ("mapa duplicado" em baixo)
          .map(f => ({
            id: f.id,
            d: pathGen(f),
            isPortugal: Number(f.id) === PORTUGAL_ID,
          }))
        const [sx, sy] = proj(SETUBAL)
        setMapData({ paths, sx, sy })
      })
      .catch(console.warn)
  }, [])

  // Scroll Smoother (Lerp)
  const targetProgress = useRef(0)
  
  useEffect(() => {
    let reqId
    const tick = () => {
      setProgress(prev => {
        const diff = targetProgress.current - prev
        // Se a diferença for minúscula, estabiliza
        if (Math.abs(diff) < 0.0001) return targetProgress.current
        return prev + diff * 0.08 // Fator de suavidade
      })
      reqId = requestAnimationFrame(tick)
    }
    reqId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(reqId)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const scrolled  = window.scrollY - el.offsetTop
      const scrollable = el.offsetHeight - window.innerHeight
      targetProgress.current = Math.min(1, Math.max(0, scrolled / scrollable))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const eased    = easeInOutCubic(progress)
  const isMobile = vp.w <= 768

  // ── ViewBox animation ─────────────────────────────────────────────────
  const { sx, sy } = mapData
  const targetX = sx != null ? sx : 480
  const targetY = sy != null ? sy : 250

  // Cortar o espaço vazio acima e abaixo dos continentes (sem Antártida)
  const startX = 0
  const startY = 35
  const startW = 960
  const startH = 370
  
  const endW = 960 / FINAL_SCALE
  const endH = 370 / FINAL_SCALE
  
  const endX = targetX - endW / 2
  const endY = targetY - endH / 2

  // Interpolação linear perfeita das coordenadas e tamanho da janela (zoom + pan sincronizados)
  const vbX = startX + (endX - startX) * eased
  const vbY = startY + (endY - startY) * eased
  const vbW = startW + (endW - startW) * eased
  const vbH = startH + (endH - startH) * eased

  // ── Escala do marcador no ecrã (reverte a escala do SVG para manter tamanho fixo) ──
  const vbAspect = 960 / 370
  const vpAspect = vp.w / vp.h
  const browserScale = vpAspect > vbAspect ? vp.w / vbW : vp.h / vbH
  const markerScale = 1 / browserScale

  // Opacidades
  const markerOpacity = eased > 0.72 ? Math.min(1, (eased - 0.72) / 0.2) : 0
  const labelOpacity  = eased > 0.75 ? Math.min(1, (eased - 0.75) / 0.15) : 0
  const phase1Op = 1 - Math.min(1, eased / 0.25)
  const phase2Op = eased > 0.28
    ? Math.min(1, (eased - 0.28) / 0.15) * (1 - Math.min(1, (eased - 0.58) / 0.14))
    : 0
  const phase3Op = eased > 0.72 ? Math.min(1, (eased - 0.72) / 0.2) : 0

  const phaseTransform = (yOffset) =>
    isMobile ? `translateX(-50%) translateY(${yOffset}px)` : `translateY(${yOffset}px)`

  // Memoriza os paths do mapa para o React não re-renderizar 170+ elementos por frame!
  const mapPaths = useMemo(() => {
    return mapData.paths.map(({ id, d, isPortugal }) => (
      <path key={id} d={d}
        fill={isPortugal ? '#9098b2' : '#c4c9d8'}
        stroke="#d8dbe8" strokeWidth="0.4"
      />
    ))
  }, [mapData.paths])

  return (
    <div className="au-wrap">
      <section className="au-section" ref={sectionRef}>
        <div className="au-sticky">

          {/* SVG Map — viewBox animado, sem transform CSS */}
          <div className="au-map-clip">
            <svg
              className="au-svg"
              viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
              preserveAspectRatio="xMidYMid slice"
              overflow="hidden"
            >
              {/* Rect enorme — cobre qualquer posição do viewBox, cor = fundo */}
              <rect x="-9999" y="-9999" width="19918" height="19918" fill="#ffffff" />
              {mapPaths}

              {/* Marcador — NATIVO SVG usando <circle> e <animate> */}
              {sx != null && (
                <g style={{ opacity: markerOpacity }}>
                  {/* Ponto Vermelho */}
                  <circle
                    cx={sx}
                    cy={sy}
                    r={5 * markerScale}
                    fill="#e63946"
                    stroke="rgba(230,57,70,0.3)"
                    strokeWidth={3 * markerScale}
                  />
                  {/* Pulse animado */}
                  <circle
                    cx={sx}
                    cy={sy}
                    fill="none"
                    stroke="rgba(230,57,70,0.6)"
                    strokeWidth={1.5 * markerScale}
                  >
                    <animate 
                      attributeName="r" 
                      values={`${17 * markerScale * 0.35};${17 * markerScale * 1.5};${17 * markerScale * 1.5}`} 
                      keyTimes="0;0.8;1" 
                      dur="2s" 
                      repeatCount="indefinite" 
                    />
                    <animate 
                      attributeName="opacity" 
                      values="1;0;0" 
                      keyTimes="0;0.8;1" 
                      dur="2s" 
                      repeatCount="indefinite" 
                    />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          {/* Vinheta */}
          <div className="au-vignette" />


          {/* Scroll hint */}
          <div className="au-hint" style={{ opacity: progress < 0.04 ? 1 : 0 }}>
            <div className="au-hint-mouse"><div className="au-hint-wheel" /></div>
            <span>Scroll para explorar</span>
          </div>

          {/* Label Setúbal */}
          <div className="au-city-label" style={{ opacity: labelOpacity }}>
            <span className="au-city-name">Setúbal</span>
            <span className="au-city-country">Portugal</span>
          </div>

          {/* Fases */}
          <div className="au-phases">
            <div className="au-phase" style={{ opacity: phase1Op, transform: phaseTransform(-eased * 50) }}>
              <p className="au-tag">O Problema</p>
              <h1 className="au-title">Impacto odorífero<br />em meio urbano</h1>
              <p className="au-desc">A descarga industrial de efluentes da The Navigator Company causa impacto negativo na qualidade do ar em Setúbal.</p>
            </div>
            <div className="au-phase" style={{ opacity: phase2Op, transform: phaseTransform((0.5 - eased) * 40) }}>
              <p className="au-tag">A Causa Raiz</p>
              <h2 className="au-title">Produção linear,<br />ambiente dinâmico</h2>
              <p className="au-desc">A fábrica opera de forma constante, mas a capacidade de dispersão (Vento) e diluição (Maré) do estuário do Sado varia continuamente.</p>
            </div>
            <div className="au-phase" style={{ opacity: phase3Op, transform: phaseTransform((1 - eased) * 35) }}>
              <p className="au-tag">O Epicentro</p>
              <h2 className="au-title">Setúbal,<br />Portugal</h2>
              <p className="au-desc">A 3 km do centro da cidade, o estuário do Sado é o elo entre a produção industrial e o impacto urbano que queremos minimizar.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Secção inferior */}
      <section className="au-details">
        <p className="au-details-tag">O problema em três dimensões</p>
        <div className="au-grid">
          {[
            { icon: '⚠️', title: 'O Problema', text: 'Desfasamento entre o ritmo de produção e as condições naturais de dispersão e diluição — vento e maré — no estuário do Sado.' },
            { icon: '🎯', title: 'O Objetivo', text: 'Otimizar o scheduling das descargas industriais para janelas de baixo risco, minimizando o impacto odorífero sem comprometer a produção.' },
            { icon: '🔮', title: 'A Solução', text: 'Um Sistema de Apoio à Decisão (SAD) preditivo que usa SO₂, maré e vento para identificar as melhores janelas de descarga em tempo real.' },
          ].map(({ icon, title, text }) => (
            <div key={title} className="au-card">
              <div className="au-card-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
