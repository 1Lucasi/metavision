// Divide o conjunto.glb em um GLB por nó, para o app mobile (ViroReact).
// Cada arquivo leva só aquele nó + sua mesh/material; o prune() tira o resto.
// Uso: node scripts/split.mjs [entrada.glb] [pasta_saida]
//
// Os nós do conjunto.glb não têm transformação própria (vértices já estão na
// posição final), então os pedaços se encaixam sozinhos quando colocados no
// mesmo nó pai, todos em [0, 0, 0].

import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { prune } from '@gltf-transform/functions'

const [input = 'public/models/conjunto.glb', outDir = 'mobile/assets/modelos'] = process.argv.slice(2)

const io = new NodeIO()
const nomes = (await io.read(input)).getRoot().listNodes().map((n) => n.getName())

await mkdir(outDir, { recursive: true })

for (const nome of nomes) {
  // Relê o arquivo a cada pedaço: mais simples que clonar o documento
  const doc = await io.read(input)
  for (const node of doc.getRoot().listNodes()) {
    if (node.getName() !== nome) node.dispose()
  }
  await doc.transform(prune()) // remove meshes, materiais e accessors órfãos

  const saida = join(outDir, `${nome}.glb`)
  await io.write(saida, doc)
  console.log(`OK -> ${saida}`)
}

console.log(`${nomes.length} modelos gerados em ${outDir}`)
