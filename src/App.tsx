import { Suspense } from 'react'
import { Scene } from './scene/Scene'
import { Controls } from './components/Controls'
import './index.css'

export default function App() {
  return (
    <div className="app">
      <Suspense fallback={<div className="loading">Carregando modelo…</div>}>
        <Scene />
      </Suspense>
      <Controls />
      <header className="brand">MetaVision</header>
    </div>
  )
}
