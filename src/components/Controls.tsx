import { useLayoutEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { LAYERS, ORGANS, ORGAN_BY_ID, ORGAN_INFO_BY_ID, GROUP_INFO_BY_NAME } from '../data/organs'
import { OrganInfoOverlay } from './OrganInfoOverlay'

// Agrupa os meshes por órgão (Coração, Pulmão direito...) p/ listar na UI
const GRUPOS = ORGANS.reduce<Record<string, typeof ORGANS>>((acc, o) => {
  ;(acc[o.grupo] ??= []).push(o)
  return acc
}, {})

type InfoTarget = { kind: 'part'; id: string } | { kind: 'group'; name: string }

export function Controls() {
  const layerVisible = useStore((s) => s.layerVisible)
  const toggleLayer = useStore((s) => s.toggleLayer)
  const orgaosSelecionados = useStore((s) => s.orgaosSelecionados)
  const alternarOrgao = useStore((s) => s.alternarOrgao)
  const alternarGrupo = useStore((s) => s.alternarGrupo)
  const limparSelecao = useStore((s) => s.limparSelecao)
  const leftPanel = useRef<HTMLDivElement>(null)
  const rightPanel = useRef<HTMLDivElement>(null)
  const previousSelection = useRef(orgaosSelecionados)
  const [infoTarget, setInfoTarget] = useState<InfoTarget | null>(null)

  // O foco dos textos é independente dos órgãos isolados na cena.
  useLayoutEffect(() => {
    const added = orgaosSelecionados.filter((id) => !previousSelection.current.includes(id))
    previousSelection.current = orgaosSelecionados
    setInfoTarget((current) => {
      const lastAdded = added[added.length - 1]
      if (lastAdded) {
        const group = ORGAN_BY_ID[lastAdded]?.grupo
        if (group && GROUP_INFO_BY_NAME[group] &&
          GRUPOS[group].every((part) => orgaosSelecionados.includes(part.id))) {
          return { kind: 'group', name: group }
        }
        return { kind: 'part', id: lastAdded }
      }

      if (current?.kind === 'part' && orgaosSelecionados.includes(current.id)) return current
      if (current?.kind === 'group') {
        const parts = GRUPOS[current.name]
        const remaining = parts.filter((part) => orgaosSelecionados.includes(part.id))
        if (remaining.length === parts.length) return current
        // Ao desfazer um grupo, prefere a última parte restante na ordem do cadastro.
        if (remaining.length > 0) return { kind: 'part', id: remaining[remaining.length - 1].id }
      }

      const last = orgaosSelecionados[orgaosSelecionados.length - 1]
      return last ? { kind: 'part', id: last } : null
    })
  }, [orgaosSelecionados])

  const infoOrgan = infoTarget?.kind === 'part' && orgaosSelecionados.includes(infoTarget.id)
    ? ORGAN_BY_ID[infoTarget.id] : undefined
  const infoGroup = infoTarget?.kind === 'group' &&
    GRUPOS[infoTarget.name].every((part) => orgaosSelecionados.includes(part.id))
    ? infoTarget.name : undefined
  const info = infoGroup ? GROUP_INFO_BY_NAME[infoGroup]
    : infoOrgan ? ORGAN_INFO_BY_ID[infoOrgan.id] : undefined
  const infoTitle = infoGroup ?? infoOrgan?.label

  // Set pra checar "está selecionado?" em O(1) na renderização da lista.
  const selecionados = new Set(orgaosSelecionados)

  return (
    <>
      {/* Camadas + lista de estruturas */}
      <div ref={leftPanel} className="panel panel-left">
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
        <div ref={rightPanel} className="panel panel-right">
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
                  <button
                    className="organ-info-focus"
                    aria-pressed={infoTarget?.kind === 'part' && infoTarget.id === id}
                    title={`Consultar informações: ${o.label}`}
                    onClick={() => setInfoTarget({ kind: 'part', id })}
                  >
                    <span className="selecao-grupo">{o.grupo}</span>
                    {o.label}
                  </button>
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
      {infoTitle && info && (
        <OrganInfoOverlay
          title={infoTitle}
          group={infoOrgan?.grupo}
          info={info}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
      )}
    </>
  )
}
