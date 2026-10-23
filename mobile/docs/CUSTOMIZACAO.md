# Customizacao — WL02 Spatial AR

O aluno deve primeiro reproduzir o baseline sem alteracoes.

## Etapa 1 — trocar o objeto
Substitua `ViroBox` por outro conteudo Viro, por exemplo um `Viro3DObject`.

## Etapa 2 — ajustar tamanho inicial
No arquivo `src/ar/SpatialScene.tsx`, altere `width`, `height` e `length`, ou a escala inicial.

## Etapa 3 — mudar interacao
O template usa:
- `dragType="FixedToWorld"` + `onDrag`;
- `onPinch`;
- `onRotate`.

A equipe pode manter apenas os gestos que fizerem sentido para o projeto.

## Etapa 4 — filtrar superficies
O baseline aceita planos horizontais. Para projetos futuros, avalie se paredes ou outros planos sao necessarios antes de habilitar deteccao vertical.

## Etapa 5 — aplicar ao dominio
Exemplos:
- estruturas historicas: posicionar modelo em escala;
- matematica: manipular solidos geometricos;
- anatomia: explorar modelo 3D;
- cardapio: posicionar prato virtual sobre a mesa.

Nao transforme o WL02 em um projeto final pronto. O white label deve continuar sendo apenas a infraestrutura tecnica de Spatial AR.
