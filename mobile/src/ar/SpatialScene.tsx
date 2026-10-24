import React, { useRef, useState } from "react";
import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARScene,
  ViroBox,
  ViroDirectionalLight,
  ViroMaterials,
  ViroNode,
  ViroText,
} from "@reactvision/react-viro";
import { ORGANS, ORGAN_BY_ID } from "../data/organs";
import { useStore } from "../store";
import { MODELOS } from "./modelos";

ViroMaterials.createMaterials({
  wl02Red: {
    diffuseColor: "#D32F2F",
    lightingModel: "Lambert",
  },
});

// Etapa 3: só o coração, para testar carregamento e toque no S10.
const ORGAOS_NA_CENA = ORGANS.filter((o) => o.grupo === "Coração");

// O modelo inteiro tem ~63 cm de altura; 0,5 deixa ~31 cm sobre a mesa.
const ESCALA_INICIAL = 0.5;
const MIN_SCALE = 0.1;
const MAX_SCALE = 1.5;

// Giro por botão: o rotate de dois dedos quase nunca acerta o coração
// (o Viro testa o ponto médio entre os dedos, que cai fora da malha).
const PASSO_GIRO = 30;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// Botão na mesa: base vermelha tocável + rótulo deitado por cima.
function BotaoMesa({
  x,
  z,
  rotulo,
  onClick,
}: {
  x: number;
  z: number;
  rotulo: string;
  onClick: () => void;
}) {
  return (
    <>
      <ViroBox
        width={0.07}
        height={0.02}
        length={0.07}
        position={[x, 0.011, z]}
        materials={["wl02Red"]}
        onClick={onClick}
      />
      <ViroText
        text={rotulo}
        position={[x, 0.025, z]}
        rotation={[-90, 0, 0]}
        scale={[0.025, 0.025, 0.025]}
        width={3}
        height={1}
        style={{ fontSize: 22, color: "#FFFFFF", textAlign: "center" }}
        ignoreEventHandling={true}
      />
    </>
  );
}

export default function SpatialScene() {
  const selectorRef = useRef<any>(null);
  const baseScaleRef = useRef(ESCALA_INICIAL);
  const baseRotationRef = useRef(0);

  const [objectKey, setObjectKey] = useState(0);
  const [scaleValue, setScaleValue] = useState(ESCALA_INICIAL);
  const [rotationY, setRotationY] = useState(0);
  const [planeSelected, setPlaneSelected] = useState(false);

  const orgaosSelecionados = useStore((s) => s.orgaosSelecionados);
  const alternarOrgao = useStore((s) => s.alternarOrgao);

  // Provisório (até a Etapa 5): mostra a seleção no texto flutuante
  const dica = !planeSelected
    ? ""
    : orgaosSelecionados.length > 0
      ? orgaosSelecionados.map((id) => ORGAN_BY_ID[id]?.label ?? id).join(", ")
      : "Arraste • Pinch • Rotacione";

  const resetObject = () => {
    baseScaleRef.current = ESCALA_INICIAL;
    baseRotationRef.current = 0;
    setScaleValue(ESCALA_INICIAL);
    setRotationY(0);
    setObjectKey((value) => value + 1);
  };

  const handlePinch = (pinchState: number, scaleFactor: number) => {
    const next = clamp(baseScaleRef.current * scaleFactor, MIN_SCALE, MAX_SCALE);
    setScaleValue(next);
    if (pinchState === 3) {
      baseScaleRef.current = next;
    }
  };

  const girar = (graus: number) => {
    const next = baseRotationRef.current + graus;
    baseRotationRef.current = next;
    setRotationY(next);
  };

  const handleRotate = (rotateState: number, rotationFactor: number) => {
    const next = baseRotationRef.current + rotationFactor;
    setRotationY(next);
    if (rotateState === 3) {
      baseRotationRef.current = next;
    }
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
        onPlaneSelected={() => setPlaneSelected(true)}
      >
        {/* Gestos ficam no nó pai: o toque num órgão sem onDrag/onPinch/onRotate
            sobe para cá, então dá pra mover o tronco tocando em qualquer pedaço. */}
        <ViroNode
          key={`object-${objectKey}`}
          position={[0, 0, 0]}
          scale={[scaleValue, scaleValue, scaleValue]}
          rotation={[0, rotationY, 0]}
          dragType="FixedToWorld"
          onDrag={() => {}}
          onPinch={handlePinch}
          onRotate={handleRotate}
        >
          {/* Vértices já estão na posição final (ver scripts/split.mjs),
              então todos os pedaços ficam em [0, 0, 0] e se encaixam. */}
          {ORGAOS_NA_CENA.map((o) => (
            <Viro3DObject
              key={o.id}
              source={MODELOS[o.id]}
              type="GLB"
              position={[0, 0, 0]}
              onClick={() => alternarOrgao(o.id)}
              onError={(e) => console.warn(`Falha ao carregar ${o.id}`, e.nativeEvent)}
            />
          ))}
        </ViroNode>

        <BotaoMesa x={0.18} z={-0.09} rotulo="<" onClick={() => girar(PASSO_GIRO)} />
        <BotaoMesa x={0.18} z={0} rotulo="RESET" onClick={resetObject} />
        <BotaoMesa x={0.18} z={0.09} rotulo=">" onClick={() => girar(-PASSO_GIRO)} />

        <ViroText
          text={dica}
          position={[0, 0.36, 0]}
          transformBehaviors={["billboardY"]}
          scale={[0.04, 0.04, 0.04]}
          width={6}
          height={1}
          style={{ fontSize: 20, color: "#FFFFFF", textAlign: "center" }}
          ignoreEventHandling={true}
        />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
}
