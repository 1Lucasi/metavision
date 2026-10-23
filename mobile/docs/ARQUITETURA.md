# Arquitetura — WL02 Spatial AR

## Objetivo
Ensinar a diferenca entre uma RA baseada em reconhecimento de imagem (WL01) e uma RA baseada na compreensao espacial do ambiente (WL02).

## Fluxo
```text
Android / ARCore
      ↓
ViroARSceneNavigator
      ↓
ViroARScene
      ↓
Deteccao de anchors de planos horizontais
      ↓
ViroARPlaneSelector
      ↓
Selecao por toque
      ↓
ViroBox
      ↓
Drag / Pinch / Rotate
```

## Componentes principais

### `App.tsx`
Responsavel pela navegacao AR e pela interface 2D de instrucoes.

### `SpatialScene.tsx`
Contem toda a logica de Spatial AR:
- deteccao de planos;
- encaminhamento dos anchors;
- selecao da superficie;
- objeto 3D;
- manipulacao;
- reset.

## Por que encaminhar os anchors?
Nas versoes atuais do ViroReact, `ViroARPlaneSelector` nao gerencia sozinho a deteccao de planos. A `ViroARScene` recebe os anchors e os encaminha ao selector por meio de:
- `handleAnchorFound`;
- `handleAnchorUpdated`;
- `handleAnchorRemoved`.

Essa separacao deixa o fluxo explicito e permite que projetos futuros usem os mesmos anchors para outras regras de negocio.
