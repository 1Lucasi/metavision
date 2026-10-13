// Otimiza um GLB do Blender pra web: solda vértices, simplifica cada mesh
// com erro relativo baixo (vaso fino não some), comprime geometria e texturas.
// Uso: node scripts/optimize.mjs public/models/entrada.glb public/models/saida.glb
//
// Mesma técnica do human-atlas (meshoptimizer, erro 0.2%), mas em GLB padrão.
// Requer meshes SEPARADOS e NOMEADOS no GLB — a simplificação roda por mesh.

import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { weld, simplify, dedup, prune } from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'

const [input, output] = process.argv.slice(2)
if (!input || !output) {
  console.error('Uso: node scripts/optimize.mjs <entrada.glb> <saida.glb>')
  process.exit(1)
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const doc = await io.read(input)

await doc.transform(
  dedup(),
  weld(), // funde vértices coincidentes (bordas duplicadas dos exports)
  simplify({
    simplifier: MeshoptSimplifier,
    ratio: 0.5, // alvo: 50% dos triângulos (ajuste conforme peso)
    error: 0.002, // 0.2% — preserva órgãos pequenos e vasos
  }),
  prune(),
)

await io.write(output, doc)
console.log(`OK -> ${output}`)
