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
}))
