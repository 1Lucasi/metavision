# MetaVision — Anatomia Torácica em RA

Site de Realidade Aumentada pra visualizar órgãos da região torácica em 3D.
UPX — React + React Three Fiber.

## Stack
- React 18 + TypeScript + Vite
- @react-three/fiber + @react-three/drei (Three.js)
- zustand (estado)
- CameraControls (fitToBox) pra foco em órgão

## Rodar
```bash
npm install
npm run dev   # http://localhost:3016
```

## Estrutura
```
src/
  data/organs.ts      Registro de camadas + ids dos órgãos (fonte da verdade)
  store.ts            Estado: camadas visíveis + órgão selecionado
  scene/
    Scene.tsx         Canvas, luzes, câmera (fitToBox no órgão)
    Placeholder.tsx   Órgãos falsos p/ testar sem GLB (deletar depois)
    Model.tsx         Carrega o GLB real (trocar MODEL_URL)
  components/
    Controls.tsx      UI: toggles de camada + painel do órgão
```

## Convenção de ids (COMBINAR com Assets + Interação)
Os meshes no GLB devem se chamar: `heart`, `lung_left`, `lung_right`,
`liver`, `stomach`. Camadas: nomes contendo `skin`, `ribcage`, `organs`,
`vessels`. Definido em `src/data/organs.ts`.

## Trocar placeholder pelo modelo real
1. Carol entrega o GLB otimizado em `public/models/`
2. Em `Model.tsx`, ajusta `MODEL_URL`
3. Em `Scene.tsx`, comenta `<Placeholder />` e descomenta `<Model />`

## Otimizar GLB da Carol
```bash
node scripts/optimize.mjs public/models/bruto.glb public/models/torax.glb
```
