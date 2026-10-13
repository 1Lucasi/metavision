import { create } from 'zustand'
import { LAYERS, type LayerId } from './data/organs'

interface AppState {
  // Visibilidade por camada
  layerVisible: Record<LayerId, boolean>
  toggleLayer: (id: LayerId) => void

  // Órgão em destaque (null = nenhum). É o passo 2 do fluxo de interação.
  organoSelecionado: string | null
  selecionarOrgao: (id: string | null) => void
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

  organoSelecionado: null,
  selecionarOrgao: (id) => set({ organoSelecionado: id }),
}))
