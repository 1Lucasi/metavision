import { create } from 'zustand'
import { LAYERS, type LayerId } from './data/organs'

interface AppState {
  // Visibilidade por camada
  layerVisible: Record<LayerId, boolean>
  toggleLayer: (id: LayerId) => void

  // Órgãos em destaque (vazio = nenhum -> mostra a cena inteira).
  // Agora é uma seleção MÚLTIPLA: dá pra isolar vários meshes de uma vez
  // (ex: os 4 pedaços do coração) pra ver a estrutura completa.
  orgaosSelecionados: string[]
  alternarOrgao: (id: string) => void // adiciona/remove um órgão da seleção
  alternarGrupo: (ids: string[]) => void // liga/desliga um grupo inteiro
  limparSelecao: () => void

  // Navegação na cena AR: corpo inteiro -> um grupo (órgão) -> partes dele.
  // null = corpo inteiro. Com grupo aberto, orgaosSelecionados isola partes.
  grupoAtivo: string | null
  abrirGrupo: (grupo: string) => void
  voltar: () => void // sobe um nível: parte -> grupo -> corpo

  // Controles do HUD (botões em App.tsx, aplicados em SpatialScene)
  corpoNaMesa: boolean // já tocou num plano e o corpo apareceu
  setCorpoNaMesa: (v: boolean) => void
  rotacaoY: number // graus em torno do eixo vertical
  setRotacaoY: (graus: number) => void
  girar: (graus: number) => void
  resetContador: number // muda a cada reset; a cena observa e se recompõe
  resetar: () => void
}

const initialVisibility = Object.fromEntries(
  LAYERS.map((l) => [l.id, l.visible]),
) as Record<LayerId, boolean>

export const useStore = create<AppState>((set) => ({
  layerVisible: initialVisibility,
  toggleLayer: (id) =>
    set((s) => ({
      layerVisible: { ...s.layerVisible, [id]: !s.layerVisible[id] },
    })),

  orgaosSelecionados: [],

  alternarOrgao: (id) =>
    set((s) => ({
      orgaosSelecionados: s.orgaosSelecionados.includes(id)
        ? s.orgaosSelecionados.filter((x) => x !== id)
        : [...s.orgaosSelecionados, id],
    })),

  // Se TODO o grupo já está selecionado -> desmarca o grupo todo.
  // Senão -> adiciona as partes que faltam (mantendo o resto da seleção).
  alternarGrupo: (ids) =>
    set((s) => {
      const todosOn = ids.every((id) => s.orgaosSelecionados.includes(id))
      if (todosOn) {
        const remover = new Set(ids)
        return {
          orgaosSelecionados: s.orgaosSelecionados.filter((x) => !remover.has(x)),
        }
      }
      const atual = new Set(s.orgaosSelecionados)
      ids.forEach((id) => atual.add(id))
      return { orgaosSelecionados: [...atual] }
    }),

  limparSelecao: () => set({ orgaosSelecionados: [] }),

  grupoAtivo: null,
  abrirGrupo: (grupo) => set({ grupoAtivo: grupo, orgaosSelecionados: [] }),
  voltar: () =>
    set((s) =>
      s.orgaosSelecionados.length > 0
        ? { orgaosSelecionados: [] }
        : { grupoAtivo: null },
    ),

  corpoNaMesa: false,
  setCorpoNaMesa: (v) => set({ corpoNaMesa: v }),
  rotacaoY: 0,
  setRotacaoY: (graus) => set({ rotacaoY: graus }),
  girar: (graus) => set((s) => ({ rotacaoY: s.rotacaoY + graus })),
  resetContador: 0,
  resetar: () =>
    set((s) => ({
      rotacaoY: 0,
      grupoAtivo: null,
      orgaosSelecionados: [],
      resetContador: s.resetContador + 1,
    })),
}))
