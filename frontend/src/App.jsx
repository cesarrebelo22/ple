import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import DischargeIndex from './components/DischargeIndex/DischargeIndex'
import ChartsSection from './components/Charts/ChartsSection'
import AboutUs from './components/AboutUs/AboutUs'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Redireciona raiz para /indice */}
        <Route path="/" element={<Navigate to="/indice" replace />} />

        {/* Página Índice — Hero + Índice de Descarga */}
        <Route path="/indice" element={
          <>
            <Home />
            <DischargeIndex />
          </>
        } />

        {/* Página Componentes — Gráficos */}
        <Route path="/componentes" element={<ChartsSection />} />

        {/* Página Problema — mapa animado com conteúdo do problema */}
        <Route path="/problema" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
