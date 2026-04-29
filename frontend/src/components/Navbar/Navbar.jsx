import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

const LINKS = [
  { label: 'Índice',      to: '/indice' },
  { label: 'Componentes', to: '/componentes' },
  { label: 'Problema',    to: '/problema' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  
  const isProblemaPage = location.pathname === '/problema'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled && !isProblemaPage ? ' navbar--scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-links">
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? ' nav-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
