import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARScene,
  ViroDirectionalLight,
  ViroNode,
} from "@reactvision/react-viro";
import { ORGANS } from "../data/organs";
import { useStore } from "../store";
import { CAIXAS } from "./caixas";
import { MODELOS } from "./modelos";

// Etapa 4: todos os 23 órgãos (pulmões, coração, fígado, digestório, rins, bexiga).
const ORGAOS_NA_CENA = ORGANS;

// Grupos de uma peça só (estômago, bexiga): com o grupo aberto não há
// partes para escolher, então o toque não faz nada.
const PARTES_POR_GRUPO = ORGANS.reduce<Record<string, number>>((acc, o) => {
  acc[o.grupo] = (acc[o.grupo] ?? 0) + 1;
  return acc;
}, {});

// O modelo inteiro tem ~63 cm de altura; 0,5 deixa ~31 cm sobre a mesa.
const ESCALA_INICIAL = 0.5;
const MIN_SCALE = 0.1;
const MAX_SCALE = 1.5;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// Ao isolar, o que ficou visível vai para o meio do corpo (onde o usuário
// já está olhando) e é ampliado até ~TAMANHO_ALVO, sem passar de ZOOM_MAX.
const CENTRO_CORPO: [number, number, number] = [0, 0.314, 0]; // metade dos ~63 cm
const TAMANHO_ALVO = 0.35;
const ZOOM_MAX = 3;

// Transformação do nó interno: p' = zoom * (p - centro) + CENTRO_CORPO
function enquadrar(ids: string[]) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const id of ids) {
    const c = CAIXAS[id];
    if (!c) continue;
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], c.min[i]);
      max[i] = Math.max(max[i], c.max[i]);
    }
  }
  const centro = min.map((v, i) => (v + max[i]) / 2);
  const maiorLado = Math.max(...max.map((v, i) => v - min[i]));
  const zoom = clamp(TAMANHO_ALVO / maiorLado, 1, ZOOM_MAX);
  const posicao = CENTRO_CORPO.map((v, i) => v - zoom * centro[i]) as [number, number, number];
  return { posicao, zoom };
}

// Reset, giro e voltar ficam no HUD (App.tsx) e chegam aqui pela store.
export default function SpatialScene() {
  const selectorRef = useRef<any>(null);
  const planoRef = useRef<string | null>(null); // anchorId do plano escolhido
  const baseScaleRef = useRef(ESCALA_INICIAL);
  const baseRotationRef = useRef(0);

  const [scaleValue, setScaleValue] = useState(ESCALA_INICIAL);

  const orgaosSelecionados = useStore((s) => s.orgaosSelecionados);
  const alternarOrgao = useStore((s) => s.alternarOrgao);
  const grupoAtivo = useStore((s) => s.grupoAtivo);
  const abrirGrupo = useStore((s) => s.abrirGrupo);
  const corpoNaMesa = useStore((s) => s.corpoNaMesa);
  const setCorpoNaMesa = useStore((s) => s.setCorpoNaMesa);
  const rotacaoY = useStore((s) => s.rotacaoY);
  const setRotacaoY = useStore((s) => s.setRotacaoY);
  const resetContador = useStore((s) => s.resetContador);

  // Reset do HUD: volta a escala; a posição volta pela key do nó, que
  // remonta no lugar onde o plano foi tocado.
  useEffect(() => {
    baseScaleRef.current = ESCALA_INICIAL;
    setScaleValue(ESCALA_INICIAL);
  }, [resetContador]);

  const visivel = (id: string, grupo: string) => {
    if (grupoAtivo === null) return true;
    if (grupo !== grupoAtivo) return false;
    return orgaosSelecionados.length === 0 || orgaosSelecionados.includes(id);
  };

  // Corpo inteiro fica como veio do GLB; isolado, enquadra o que está visível.
  const quadro = useMemo(() => {
    if (grupoAtivo === null) return { posicao: [0, 0, 0] as [number, number, number], zoom: 1 };
    return enquadrar(ORGANS.filter((o) => visivel(o.id, o.grupo)).map((o) => o.id));
  }, [grupoAtivo, orgaosSelecionados]);

  // Corpo inteiro -> toque abre o órgão todo; órgão aberto -> toque isola a parte.
  const tocar = (id: string, grupo: string) => {
    if (grupoAtivo === null) abrirGrupo(grupo);
    else if (PARTES_POR_GRUPO[grupo] > 1) alternarOrgao(id);
  };

  const handlePinch = (pinchState: number, scaleFactor: number) => {
    const next = clamp(baseScaleRef.current * scaleFactor, MIN_SCALE, MAX_SCALE);
    setScaleValue(next);
    if (pinchState === 3) {
      baseScaleRef.current = next;
    }
  };

  const handleRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 1) {
      baseRotationRef.current = useStore.getState().rotacaoY;
    }
    setRotacaoY(baseRotationRef.current + rotationFactor);
  };

  return (
    <ViroARScene
      anchorDetectionTypes={["PlanesHorizontal"]}
      onAnchorFound={(anchor) => selectorRef.current?.handleAnchorFound(anchor)}
      onAnchorUpdated={(anchor) => selectorRef.current?.handleAnchorUpdated(anchor)}
      onAnchorRemoved={(anchor) =>
        anchor && selectorRef.current?.handleAnchorRemoved(anchor)
      }
    >
      <ViroAmbientLight color="#FFFFFF" intensity={300} />
      {/* Luz de cima/frente: dá volume aos materiais PBR dos órgãos */}
      <ViroDirectionalLight color="#FFFFFF" direction={[0, -1, -0.5]} intensity={600} />

      <ViroARPlaneSelector
        ref={selectorRef}
        alignment="Horizontal"
        useActualShape={true}
        hideOverlayOnSelection={true}
        // Os planos seguem tocáveis mesmo invisíveis: um toque que erra o órgão
        // acertaria um deles e o corpo pularia para lá (parecia sumir).
        disableClickSelection={corpoNaMesa}
        onPlaneSelected={(plane: any) => {
          planoRef.current = plane?.anchorId ?? null;
          setCorpoNaMesa(true);
        }}
        // O ARCore às vezes funde planos e remove o escolhido; o seletor então
        // tira o corpo da cena. Libera a seleção para tocar num plano de novo.
        onPlaneRemoved={(anchorId: string) => {
          if (anchorId === planoRef.current) {
            planoRef.current = null;
            setCorpoNaMesa(false);
          }
        }}
      >
        {/* Gestos ficam no nó pai: o toque num órgão sem onDrag/onPinch/onRotate
            sobe para cá, então dá pra mover o tronco tocando em qualquer pedaço. */}
        <ViroNode
          key={`object-${resetContador}`}
          position={[0, 0, 0]}
          scale={[scaleValue, scaleValue, scaleValue]}
          rotation={[0, rotacaoY, 0]}
          dragType="FixedToWorld"
          onDrag={() => {}}
          onPinch={handlePinch}
          onRotate={handleRotate}
        >
          {/* Nó interno só enquadra (centro + zoom); os gestos ficam no de fora. */}
          <ViroNode position={quadro.posicao} scale={[quadro.zoom, quadro.zoom, quadro.zoom]}>
            {/* Vértices já estão na posição final (ver scripts/split.mjs),
                então todos os pedaços ficam em [0, 0, 0] e se encaixam. */}
            {ORGAOS_NA_CENA.map((o) => (
              <Viro3DObject
                key={o.id}
                source={MODELOS[o.id]}
                type="GLB"
                position={[0, 0, 0]}
                visible={visivel(o.id, o.grupo)}
                onClick={() => tocar(o.id, o.grupo)}
                onError={(e) => console.warn(`Falha ao carregar ${o.id}`, e.nativeEvent)}
              />
            ))}
          </ViroNode>
        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
}
