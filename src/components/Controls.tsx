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
  const orgaosSelecionados = useStore((s) => s.orgaosSelecionados)
  const alternarOrgao = useStore((s) => s.alternarOrgao)
  const alternarGrupo = useStore((s) => s.alternarGrupo)
  const limparSelecao = useStore((s) => s.limparSelecao)

  // Set pra checar "está selecionado?" em O(1) na renderização da lista.
  const selecionados = new Set(orgaosSelecionados)

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
          {Object.entries(GRUPOS).map(([grupo, partes]) => {
            const ids = partes.map((p) => p.id)
            const todos = ids.every((id) => selecionados.has(id))
            const alguns = !todos && ids.some((id) => selecionados.has(id))
            return (
              <div key={grupo} className="grupo">
                {/* Checkbox do grupo: marca/desmarca as partes todas de uma vez
                    (ex: liga os 4 pedaços do coração num clique). */}
                <label className="grupo-head">
                  <input
                    type="checkbox"
                    checked={todos}
                    // indeterminate = alguns (mas não todos) marcados
                    ref={(el) => {
                      if (el) el.indeterminate = alguns
                    }}
                    onChange={() => alternarGrupo(ids)}
                  />
                  <span className="grupo-nome">{grupo}</span>
                </label>

                {partes.map((p) => (
                  <label
                    key={p.id}
                    className={`item ${selecionados.has(p.id) ? 'ativo' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selecionados.has(p.id)}
                      onChange={() => alternarOrgao(p.id)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Painel dos meshes em destaque */}
      {orgaosSelecionados.length > 0 && (
        <div className="panel panel-right">
          <p className="muted-sm">
            {orgaosSelecionados.length} estrutura
            {orgaosSelecionados.length > 1 ? 's' : ''}
          </p>
          <div className="selecao-lista">
            {orgaosSelecionados.map((id) => {
              const o = ORGAN_BY_ID[id]
              if (!o) return null
              return (
                <div key={id} className="selecao-item">
                  <span>
                    <span className="selecao-grupo">{o.grupo}</span>
                    {o.label}
                  </span>
                  <button
                    className="btn-x"
                    title="Remover da seleção"
                    onClick={() => alternarOrgao(id)}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
          <p className="muted">Gire para ver em 360°.</p>
          <button onClick={() => limparSelecao()}>← Voltar</button>
        </div>
      )}
    </>
  )
}
