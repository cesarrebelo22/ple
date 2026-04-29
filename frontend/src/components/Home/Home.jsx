import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const WORDS = ['Preditiva.', 'Inteligente.', 'Sustentável.', 'Eficaz.']



export default function Home() {
  const [visible, setVisible] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120)
    return () => clearTimeout(t)
  }, [])


  // Typewriter
  useEffect(() => {
    const current = WORDS[wordIdx]
    const delay = deleting ? 60 : charIdx === current.length ? 1600 : 90
    const t = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setCharIdx(c => c + 1)
      } else if (!deleting && charIdx === current.length) {
        setDeleting(true)
      } else if (deleting && charIdx > 0) {
        setCharIdx(c => c - 1)
      } else {
        setDeleting(false)
        setWordIdx(i => (i + 1) % WORDS.length)
      }
    }, delay)
    return () => clearTimeout(t)
  }, [charIdx, deleting, wordIdx])

  const displayWord = WORDS[wordIdx].slice(0, charIdx)

  return (
    <section id="home" className={`home-hero${visible ? ' home-hero--visible' : ''}`} aria-label="Início">

      {/* Background grid */}
      <div className="home-bg-grid" aria-hidden="true" />

      {/* Floating orbs */}
      <div className="home-orb home-orb--1" aria-hidden="true" />
      <div className="home-orb home-orb--2" aria-hidden="true" />

      <div className="home-content">

        {/* Badge */}
        <div className="home-badge">
          <span className="home-badge-dot" />
          Ficha de Projeto · Grupo 2 · EGI · 2025/26
        </div>

        {/* Eyebrow */}
        <p className="home-eyebrow">The Navigator Company · Setúbal · Estuário do Sado</p>

        {/* Title */}
        <h1 className="home-title">
          Gestão de Efluentes
          <br />
          <span className="home-title-accent">&amp; Odor Industrial</span>
        </h1>

        {/* Typewriter */}
        <div className="home-typewriter">
          Uma gestão{' '}
          <span className="home-typewriter-word">
            {displayWord}
            <span className="home-cursor">|</span>
          </span>
        </div>

        {/* Description */}
        <p className="home-desc">
          Utilizamos variáveis oceanográficas — maré, vento e SO₂ — para transformar
          descargas industriais de <em>reativas</em> em <em>preditivas</em>,
          minimizando o impacto odorífero na malha urbana de Setúbal.
        </p>

        {/* CTA buttons */}
        <div className="home-ctas">
          <a href="#discharge" className="home-btn-primary">
            Índice de Descarga
            <span className="home-btn-icon">↓</span>
          </a>
          <Link to="/problema" className="home-btn-secondary">
            Ver Problema
          </Link>
        </div>

      </div>

      {/* Scroll indicator */}
      <a href="#discharge" className="home-scroll" aria-label="Descer">
        <span className="home-scroll-text">Explorar</span>
        <div className="home-scroll-wheel">
          <div className="home-scroll-dot" />
        </div>
      </a>

    </section>
  )
}
