import { useEffect, useState } from 'react'

function App() {
  const [apiStatus, setApiStatus] = useState('A verificar ligacao...')
  const [serverTime, setServerTime] = useState('')

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (!response.ok) {
          throw new Error('Falha na resposta do servidor')
        }

        const data = await response.json()
        setApiStatus(data.message)
        setServerTime(data.timestamp)
      } catch {
        setApiStatus('Nao foi possivel comunicar com o backend.')
      }
    }

    loadHealth()
  }, [])

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-100 via-sky-50 to-white p-6 text-slate-900">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Fullstack App
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            React + Vite + Tailwind no frontend
          </h1>
          <p className="text-slate-600">
            Backend em Node.js a responder via API Express.
          </p>
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-sm font-medium text-sky-900">Estado da API</p>
          <p className="mt-1 text-lg font-semibold">{apiStatus}</p>
          {serverTime && (
            <p className="mt-2 text-sm text-slate-500">Timestamp: {serverTime}</p>
          )}
        </div>
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold">Frontend</p>
            <p>Vite + React + TailwindCSS</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold">Backend</p>
            <p>Node.js + Express + CORS</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
