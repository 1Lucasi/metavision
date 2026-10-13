import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useStore } from '../store'
import { ORGAN_IDS, LAYERS } from '../data/organs'
import type { Object3D } from 'three'

// Modelo real da Carol. Cada mesh já vem nomeado (átrio, lobo, cólon...).
const MODEL_URL = '/models/conjunto.glb'

/**
 * Acha o id do órgão dono de um nó, subindo pelos pais se precisar.
 *
 * Quando um lobo tem mais de um slot de material no Blender, o GLTFLoader
 * exporta o mesh em VÁRIAS primitivas: o nó com o nome original
 * ("lobo_superior_direito") vira um Group, e os meshes de verdade ficam
 * dentro dele com sufixo ("lobo_superior_direito_1", "_2"...). Isso
 * acontece com o pulmão e o fígado (múltiplos lobos/sub-partes); coração,
 * estômago etc. têm 1 primitiva só, então o nome bate direto.
 * Por isso NUNCA comparar node.name === organoSelecionado direto — tem
 * que subir até achar um ancestral (ou o próprio nó) com id conhecido.
 */
function findOrganId(node: Object3D): string | undefined {
  let cur: Object3D | null = node
  while (cur) {
    if (ORGAN_IDS.has(cur.name)) return cur.name
    cur = cur.parent
  }
  return undefined
}

/**
 * Descobre a camada de um mesh:
 * 1. Se é um órgão conhecido -> camada 'organs'.
 * 2. Senão, casa o nome com uma camada (skin/ribcage/vessels),
 *    pra quando a Carol adicionar pele/caixa torácica/vasos depois.
 */
function layerOfNode(node: Object3D): string | null {
  if (findOrganId(node)) return 'organs'
  const hit = LAYERS.find((l) => node.name.toLowerCase().includes(l.id))
  return hit ? hit.id : null
}

export function Model() {
  const { scene } = useGLTF(MODEL_URL)
  const layerVisible = useStore((s) => s.layerVisible)
  const organoSelecionado = useStore((s) => s.organoSelecionado)
  const selecionarOrgao = useStore((s) => s.selecionarOrgao)

  // Visibilidade de camada + opacidade de destaque a cada mudança de estado
  useEffect(() => {
    scene.traverse((node) => {
      if (!(node as any).isMesh) return
      const organId = findOrganId(node)
      const layer = organId ? 'organs' : layerOfNode(node)
      const layerOn = layer
        ? layerVisible[layer as keyof typeof layerVisible]
        : true

      // isolamento: com um mesh selecionado, só ele (e suas sub-partes,
      // quando o lobo foi exportado em várias primitivas) fica visível.
      const isTarget = !organoSelecionado || organId === organoSelecionado
      node.visible = layerOn && isTarget

      // garante opacidade cheia no que está visível
      const mat = (node as any).material
      if (mat) {
        mat.transparent = false
        mat.opacity = 1
        mat.depthWrite = true
      }
    })
  }, [scene, layerVisible, organoSelecionado])

  return (
    <primitive
      object={scene}
      onClick={(e: any) => {
        // Passo 1 do fluxo: clique no mesh. stopPropagation p/ não pegar o de trás.
        e.stopPropagation()
        // O raycaster do three.js intersecta meshes mesmo com visible=false
        // (ex: um órgão escondido por trás do que está isolado agora).
        // Ignora o clique se o mesh atingido não está realmente visível,
        // senão girar/clicar perto do isolado troca pra um órgão escondido.
        if (!e.object.visible) return
        const id = findOrganId(e.object)
        if (id) selecionarOrgao(id)
      }}
      onPointerMissed={() => selecionarOrgao(null)}
    />
  )
}

useGLTF.preload(MODEL_URL)
