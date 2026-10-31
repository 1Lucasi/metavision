// Gera mobile/src/ar/caixas.ts com a caixa (min/max) de cada modelo do app,
// usada para centralizar o órgão isolado na cena AR.
// Uso: node scripts/centros.mjs [pasta_modelos] [saida.ts]
//
// Rodar de novo sempre que o split.mjs regerar os modelos.

import { readdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { getBounds } from '@gltf-transform/core'

const [pasta = 'mobile/assets/modelos', saida = 'mobile/src/ar/caixas.ts'] = process.argv.slice(2)

const io = new NodeIO()
const arredonda = (v) => v.map((n) => Number(n.toFixed(4)))
const linhas = []

for (const arquivo of (await readdir(pasta)).filter((f) => f.endsWith('.glb')).sort()) {
  const doc = await io.read(join(pasta, arquivo))
  const { min, max } = getBounds(doc.getRoot().listScenes()[0])
  linhas.push(`  ${basename(arquivo, '.glb')}: { min: [${arredonda(min)}], max: [${arredonda(max)}] },`)
}

await writeFile(
  saida,
  `// Gerado por scripts/centros.mjs — não editar à mão.
// Caixa de cada modelo em metros, no espaço do conjunto (escala 1).
export type Caixa = { min: [number, number, number]; max: [number, number, number] };

export const CAIXAS: Record<string, Caixa> = {
${linhas.join('\n')}
};
`,
)
console.log(`${linhas.length} caixas -> ${saida}`)
