# WL02 — Spatial AR — React Native / ViroReact

Baseline educacional para **Windows + Android**, equivalente ao WL02 Unity. O aplicativo detecta planos horizontais, permite ao usuario selecionar uma superficie real e posiciona um cubo 3D sobre o ponto tocado.

Depois do posicionamento, o cubo pode ser:
- arrastado sobre superficies reais (`FixedToWorld`);
- redimensionado com gesto de pinch;
- rotacionado com gesto de rotacao;
- restaurado ao estado inicial pelo botao virtual vermelho `RESET`.

## Ambiente de referencia
- Windows 10/11 64-bit
- Node.js 20 LTS ou 22 LTS
- Android Studio + Android SDK/Platform Tools
- Android fisico compativel com ARCore
- Expo 57.0.23
- React Native 0.86.3
- React 19.2.3
- ViroReact 2.57.3

## Pasta oficial
`C:\AR\WL02\wl02-spatial-ar-react-native`

## Execucao
```powershell
cd "C:\AR\WL02\wl02-spatial-ar-react-native"
npm install
npm run verify
npm run doctor
npm run prebuild
adb devices
npm run android
```

> Este projeto usa recursos nativos de RA e **nao funciona no Expo Go**.

## Teste funcional esperado
1. Abra o aplicativo no Android e conceda permissao de camera.
2. Mova lentamente o dispositivo apontando para uma mesa, piso ou bancada com textura visivel.
3. Aguarde os planos detectados aparecerem.
4. Toque em um plano horizontal.
5. O cubo azul deve aparecer exatamente no ponto selecionado.
6. Arraste o cubo para reposiciona-lo sobre uma superficie real.
7. Use pinch para aumentar ou diminuir.
8. Use o gesto de rotacao para girar o cubo.
9. Toque no pequeno bloco vermelho `RESET` para restaurar a transformacao inicial.

## Como funciona
O WL02 usa o fluxo atual do `ViroARPlaneSelector`:

```text
ViroARScene
   ↓
anchorDetectionTypes = PlanesHorizontal
   ↓
onAnchorFound / Updated / Removed
   ↓
ViroARPlaneSelector
   ↓
Usuario toca em um plano
   ↓
Conteudo e colocado no ponto selecionado
   ↓
Drag + Pinch + Rotate
```

A partir do ViroReact 2.53, os eventos de anchors da `ViroARScene` devem ser encaminhados explicitamente ao `ViroARPlaneSelector`. O arquivo `src/ar/SpatialScene.tsx` implementa esse padrao.

## Estrutura
```text
wl02-spatial-ar-react-native/
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── setup-windows.ps1
├── TESTE_DE_ACEITACAO.md
├── src/
│   └── ar/
│       └── SpatialScene.tsx
├── scripts/
│   └── verify-project.mjs
└── docs/
    ├── ARQUITETURA.md
    └── CUSTOMIZACAO.md
```

## Preparacao automatica no Windows
```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup-windows.ps1
```

Depois, com o Android listado como `device` em `adb devices`:
```powershell
npm run android
```

## Escopo do WL02
O WL02 ensina **Spatial AR**. Ele nao inclui image target, QR, navegacao indoor, API, banco de dados ou visao computacional. Esses recursos pertencem a outros white labels ou a extensoes do projeto da equipe.
