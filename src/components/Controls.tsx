import { useStore } from '../store'
import { LAYERS, ORGANS, ORGAN_BY_ID } from '../data/organs'

// Agrupa os meshes por órgão (Coração, Pulmão direito...) p/ listar na UI
const GRUPOS = ORGANS.reduce<Record<string, typeof ORGANS>>((acc, o) => {
  ;(acc[o.grupo] ??= []).push(o)
  return acc
}, {})

export function Controls() {
  const layerVisible = useStore((s) => s.layerVisible)
  const toggleLayer = useStore((s) => s.toggleLayer)
  const organoSelecionado = useStore((s) => s.organoSelecionado)
  const selecionarOrgao = useStore((s) => s.selecionarOrgao)

  const organ = organoSelecionado ? ORGAN_BY_ID[organoSelecionado] : null

  return (
    <>
      {/* Camadas + lista de estruturas */}
      <div className="panel panel-left">
        <h3>Camadas</h3>
        {LAYERS.map((l) => (
          <label key={l.id} className="row">
            <input
              type="checkbox"
              checked={layerVisible[l.id]}
              onChange={() => toggleLayer(l.id)}
            />
            {l.label}
          </label>
        ))}

        <h3 style={{ marginTop: 16 }}>Estruturas</h3>
        <div className="lista">
          {Object.entries(GRUPOS).map(([grupo, partes]) => (
            <div key={grupo} className="grupo">
              <span className="grupo-nome">{grupo}</span>
              {partes.map((p) => (
                <label
                  key={p.id}
                  className={`item ${organoSelecionado === p.id ? 'ativo' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={organoSelecionado === p.id}
                    onChange={() =>
                      selecionarOrgao(organoSelecionado === p.id ? null : p.id)
                    }
                  />
                  {p.label}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Painel do mesh em destaque (passo 7: botão voltar) */}
      {organ && (
        <div className="panel panel-right">
          <p className="muted-sm">{organ.grupo}</p>
          <h3>{organ.label}</h3>
          <p className="muted">Gire para ver em 360°.</p>
          <button onClick={() => selecionarOrgao(null)}>← Voltar</button>
        </div>
      )}
    </>
  )
}
