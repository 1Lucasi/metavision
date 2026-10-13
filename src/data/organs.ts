// Registro central de camadas e órgãos.
// Nomes EXATOS dos meshes no GLB da Carol (conjunto.glb) — não renomear.
// Interação (Duda/Ogino) usa o mesmo id pra clique + bounding box.

export type LayerId = 'skin' | 'ribcage' | 'organs' | 'vessels'

export interface Layer {
  id: LayerId
  label: string
  visible: boolean // estado inicial da camada
}

export interface Organ {
  id: string // nome do mesh no GLB — igual ao que a Carol exportou
  label: string // nome exibido na UI
  layer: LayerId
  grupo: string // órgão a que pertence, p/ agrupar na UI (coração, pulmão...)
}

// Ordem = ordem de "descascar" na UI (pele primeiro, vasos por último)
export const LAYERS: Layer[] = [
  { id: 'skin', label: 'Pele', visible: true },
  { id: 'ribcage', label: 'Caixa torácica', visible: true },
  { id: 'organs', label: 'Órgãos', visible: true },
  { id: 'vessels', label: 'Vasos', visible: true },
]

// Meshes exatamente como vieram no conjunto.glb (22 peças).
export const ORGANS: Organ[] = [
  // Pulmões
  { id: 'lobo_superior_direito', label: 'Lobo superior direito', layer: 'organs', grupo: 'Pulmão direito' },
  { id: 'lobo_medio_direito', label: 'Lobo médio direito', layer: 'organs', grupo: 'Pulmão direito' },
  { id: 'lobo_inferior_direito', label: 'Lobo inferior direito', layer: 'organs', grupo: 'Pulmão direito' },
  { id: 'lobo_superior_esquerdo', label: 'Lobo superior esquerdo', layer: 'organs', grupo: 'Pulmão esquerdo' },
  { id: 'lobo_inferior_esquerdo', label: 'Lobo inferior esquerdo', layer: 'organs', grupo: 'Pulmão esquerdo' },
  // Coração
  { id: 'atrio_direito', label: 'Átrio direito', layer: 'organs', grupo: 'Coração' },
  { id: 'atrio_esquerdo', label: 'Átrio esquerdo', layer: 'organs', grupo: 'Coração' },
  { id: 'ventriculo_direito', label: 'Ventrículo direito', layer: 'organs', grupo: 'Coração' },
  { id: 'ventriculo_esquerdo', label: 'Ventrículo esquerdo', layer: 'organs', grupo: 'Coração' },
  // Fígado
  { id: 'lobo_direito', label: 'Lobo direito', layer: 'organs', grupo: 'Fígado' },
  { id: 'lobo_esquerdo', label: 'Lobo esquerdo', layer: 'organs', grupo: 'Fígado' },
  { id: 'lobo_caudado', label: 'Lobo caudado', layer: 'organs', grupo: 'Fígado' },
  // Estômago
  { id: 'estomago', label: 'Estômago', layer: 'organs', grupo: 'Estômago' },
  // Intestino delgado
  { id: 'duodeno', label: 'Duodeno', layer: 'organs', grupo: 'Intestino delgado' },
  { id: 'jejuno_ileo', label: 'Jejuno-íleo', layer: 'organs', grupo: 'Intestino delgado' },
  // Intestino grosso
  { id: 'colon_ascendente', label: 'Cólon ascendente', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'colon_transverso', label: 'Cólon transverso', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'colon_descendente', label: 'Cólon descendente', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'colon_sigmoide', label: 'Cólon sigmoide', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'apendice', label: 'Apêndice', layer: 'organs', grupo: 'Intestino grosso' },
  // Rins
  { id: 'rim_direito', label: 'Rim direito', layer: 'organs', grupo: 'Rins' },
  { id: 'rim_esquerdo', label: 'Rim esquerdo', layer: 'organs', grupo: 'Rins' },
  // Bexiga
  { id: 'bexiga', label: 'Bexiga', layer: 'organs', grupo: 'Bexiga' },
]

// Índice id -> órgão, pra lookup rápido no clique
export const ORGAN_BY_ID: Record<string, Organ> = Object.fromEntries(
  ORGANS.map((o) => [o.id, o]),
)

// Set com todos os ids clicáveis
export const ORGAN_IDS = new Set(ORGANS.map((o) => o.id))
